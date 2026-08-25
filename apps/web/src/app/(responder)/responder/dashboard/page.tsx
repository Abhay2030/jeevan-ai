"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiFetch } from "../../../../lib/api";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@jeevan-ai/ui";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import("@jeevan-ai/ui/src/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-paper-200">Loading Map...</div>,
});

// Pydantic Schema interface
interface Location {
  longitude: number;
  latitude: number;
}
interface IncidentRead {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "NEW" | "DISPATCHED" | "RESPONDING" | "RESOLVED";
  location: Location;
  created_at: string;
}

export default function ResponderDashboard() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<IncidentRead[]>([]);
  const [loading, setLoading] = useState(true);

  // Ujjain default center coordinates (Simhastha Kumbh 2027 location)
  const defaultCenter: [number, number] = [23.1793, 75.7849];

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const data = await apiFetch<IncidentRead[]>("/incidents");
        setIncidents(data);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIncidents();
    
    // Polling every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const updated = await apiFetch<IncidentRead>(`/incidents/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
    } catch (error) {
      console.error("Status update failed:", error);
      // Here we would implement IndexedDB queuing for Offline Sync
    }
  };

  const mapPoints = incidents.map(inc => ({
    id: inc.id,
    latitude: inc.location.latitude,
    longitude: inc.location.longitude,
    title: inc.title,
    severity: inc.severity,
  }));

  return (
    <div className="flex flex-col h-screen bg-surface-bg" data-theme="paper">
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-4 bg-surface-card border-b border-surface-border z-10 shadow-sm">
        <h1 className="text-xl font-display font-bold text-ink-900">Responder Hub</h1>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{user?.full_name}</Badge>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Map View */}
        <section className="flex-1 h-[50vh] md:h-full relative">
          <DynamicMap center={defaultCenter} points={mapPoints} />
        </section>
        
        {/* Incident List Overlay/Panel */}
        <section className="w-full md:w-96 bg-surface-bg border-t md:border-t-0 md:border-l border-surface-border overflow-y-auto z-10 shadow-xl flex flex-col">
          <div className="p-4 border-b border-surface-border bg-surface-card sticky top-0 z-20">
            <h2 className="font-display font-semibold text-lg text-ink-900">Active Incidents</h2>
          </div>
          
          <div className="p-4 space-y-4">
            {loading ? (
              <p className="text-sm text-ink-500">Loading incidents...</p>
            ) : incidents.length === 0 ? (
              <p className="text-sm text-ink-500">No active incidents.</p>
            ) : (
              incidents.map((inc) => (
                <Card key={inc.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{inc.title}</CardTitle>
                      <Badge variant={inc.severity === "CRITICAL" ? "critical" : inc.severity === "HIGH" ? "high" : "neutral"}>
                        {inc.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink-700 mb-4 line-clamp-2">{inc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-1 bg-paper-200 rounded text-ink-700">
                        {inc.status}
                      </span>
                      {inc.status === "NEW" && (
                        <Button 
                          size="sm" 
                          variant="primary" 
                          onClick={() => handleStatusUpdate(inc.id, "RESPONDING")}
                        >
                          Accept Dispatch
                        </Button>
                      )}
                      {inc.status === "RESPONDING" && (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleStatusUpdate(inc.id, "RESOLVED")}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
