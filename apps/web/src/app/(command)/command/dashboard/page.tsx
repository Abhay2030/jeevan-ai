"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiFetch } from "../../../../lib/api";
import { useWebsocket } from "../../../../hooks/useWebsocket";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@jeevan-ai/ui";

const DynamicMap = dynamic(() => import("@jeevan-ai/ui/src/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-surface-bg text-surface-text">Loading Grid...</div>,
});

interface CrowdDensityPrediction {
  sector_id: string;
  current_density: number;
  predicted_density_15m: number;
  threshold: number;
  status: string;
}

export default function CommandCenterDashboard() {
  const { user } = useAuth();
  
  // Real-time WS feed for incidents
  const { lastMessage, isConnected } = useWebsocket<any>("/ws/incidents");
  const [liveIncidents, setLiveIncidents] = useState<any[]>([]);

  // Predictive Analytics State
  const [densityMetrics, setDensityMetrics] = useState<CrowdDensityPrediction[]>([]);

  const defaultCenter: [number, number] = [23.1793, 75.7849]; // Ujjain

  useEffect(() => {
    // Append new WS messages to the feed
    if (lastMessage) {
      setLiveIncidents((prev) => [lastMessage, ...prev].slice(0, 50)); // Keep last 50
    }
  }, [lastMessage]);

  useEffect(() => {
    // Fetch initial predictive analytics
    async function fetchAnalytics() {
      try {
        const data = await apiFetch<CrowdDensityPrediction[]>("/analytics/crowd-density");
        setDensityMetrics(data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-surface-bg text-surface-text overflow-hidden" data-theme="ink">
      {/* Top Command Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-surface-card border-b border-surface-border shadow-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-display font-bold tracking-tight text-white">
            Command Center
          </h1>
          <Badge variant={isConnected ? "high" : "critical"}>
            {isConnected ? "WS: CONNECTED" : "WS: DISCONNECTED"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-ink-300 font-mono">OP: {user?.full_name}</div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 h-[calc(100vh-64px)]">
        
        {/* Left Panel: Analytics & Density (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
          <h2 className="font-display font-semibold text-lg text-white mb-2 uppercase tracking-wide">Predictive Analytics</h2>
          {densityMetrics.map((metric) => (
            <Card key={metric.sector_id} className="bg-surface-card border-surface-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-ink-300">
                  {metric.sector_id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-xs text-ink-400">Current</div>
                    <div className="text-2xl font-bold text-white">{metric.current_density.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-400">T+15m Predicted</div>
                    <div className={`text-xl font-bold ${metric.predicted_density_15m >= metric.threshold ? 'text-alert-500' : 'text-primary-400'}`}>
                      {metric.predicted_density_15m.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-ink-800 rounded-full h-2 mt-4">
                  <div 
                    className={`h-2 rounded-full ${metric.predicted_density_15m >= metric.threshold ? 'bg-alert-500' : 'bg-primary-500'}`} 
                    style={{ width: `${Math.min((metric.predicted_density_15m / metric.threshold) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Center Panel: Global Map (6 cols) */}
        <section className="lg:col-span-6 relative rounded-lg overflow-hidden border border-surface-border shadow-lg">
          <DynamicMap center={defaultCenter} zoom={14} className="grayscale invert contrast-125" />
          {/* We apply CSS filters on the map above to force a dark-mode look on standard OSM tiles for the Ink theme */}
        </section>

        {/* Right Panel: Live Feed (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-4 overflow-hidden bg-surface-card rounded-lg border border-surface-border">
          <div className="p-4 border-b border-surface-border">
            <h2 className="font-display font-semibold text-lg text-white uppercase tracking-wide">Live Event Stream</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
            {liveIncidents.length === 0 ? (
              <div className="text-ink-500 italic">Waiting for incoming telemetry...</div>
            ) : (
              liveIncidents.map((msg, i) => (
                <div key={i} className="p-3 bg-ink-800/50 rounded border border-ink-800">
                  <div className="text-xs text-primary-400 mb-1">{new Date().toLocaleTimeString()}</div>
                  <div className="text-ink-100">{JSON.stringify(msg)}</div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
