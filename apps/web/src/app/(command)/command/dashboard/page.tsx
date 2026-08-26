"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../../../contexts/AuthContext";
import { apiFetch } from "../../../../lib/api";
import { useWebsocket } from "../../../../hooks/useWebsocket";
import { 
  Activity, Shield, AlertTriangle, Users, MapPin, Radio, 
  Brain, BarChart3, CloudRain, Thermometer, Layers, Clock, 
  CheckCircle2, XCircle
} from "lucide-react";

const DynamicMap = dynamic(() => import("@jeevan-ai/ui/src/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-ink-900 skeleton">Loading Global Grid...</div>,
});

interface CrowdDensityPrediction { sector_id: string; current_density: number; predicted_density_15m: number; threshold: number; status: string; }

export default function CommandCenterDashboard() {
  const { user } = useAuth();
  const { lastMessage, isConnected } = useWebsocket<any>("/ws/incidents");
  const [liveIncidents, setLiveIncidents] = useState<any[]>([]);
  const [densityMetrics, setDensityMetrics] = useState<CrowdDensityPrediction[]>([]);

  const defaultCenter: [number, number] = [23.1793, 75.7849]; // Ujjain

  useEffect(() => {
    if (lastMessage) {
      setLiveIncidents((prev) => [lastMessage, ...prev].slice(0, 30));
    }
  }, [lastMessage]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await apiFetch<CrowdDensityPrediction[]>("/analytics/crowd-density");
        setDensityMetrics(data);
      } catch (err) {}
    }
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      
      {/* Top Status Bar */}
      <header className="h-14 bg-surface-card border-b border-surface-border flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-success-500 animate-sos-pulse" : "bg-alert-500"}`} />
            <span className={isConnected ? "text-success-400" : "text-alert-400"}>
              {isConnected ? "SATCOM LINK ACTIVE" : "LINK OFFLINE"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-ink-400 border-l border-surface-border pl-4">
            <Clock className="w-3.5 h-3.5" /> {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-mono text-ink-300">
            <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-blue-400" /> 12%</span>
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-accent-500" /> 34°C</span>
          </div>
        </div>
      </header>

      {/* Dynamic Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Analytics & AI */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* AI Recommendation Card */}
          <div className="card-elevated bg-ink-950 border-primary-900 shadow-glow-primary p-4 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-mono text-primary-400 mb-3 tracking-widest">
              <Brain className="w-3.5 h-3.5" /> AI RECOMMENDATION
            </div>
            <h3 className="text-sm font-display font-bold text-white mb-1">Zone C Risk Escalation</h3>
            <p className="text-xs text-ink-300 mb-4 leading-relaxed">Crowd density predicted to exceed safe threshold by 18% in next 15 mins. Incident probability HIGH.</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[10px] text-ink-400 font-mono">
                <span>CONFIDENCE</span>
                <span className="text-primary-400">92.4%</span>
              </div>
              <div className="w-full bg-ink-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: "92.4%" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="h-8 rounded bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm shadow-primary-600/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Execute
              </button>
              <button className="h-8 rounded bg-ink-800 hover:bg-ink-700 text-ink-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </div>

          {/* Crowd Density Gauges */}
          <div className="card-elevated p-4 flex-1 min-h-[250px]">
            <h3 className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-4">Live Sector Density</h3>
            <div className="space-y-4">
              {densityMetrics.length === 0 ? (
                [1,2,3].map(i => <div key={i} className="h-12 skeleton w-full bg-ink-800/50" />)
              ) : densityMetrics.map(m => (
                <div key={m.sector_id}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-mono text-ink-200">{m.sector_id}</span>
                    <span className={`text-xs font-mono font-bold ${m.predicted_density_15m > m.threshold ? "text-alert-400" : "text-primary-400"}`}>
                      {m.current_density.toLocaleString()} / {m.threshold.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-ink-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${m.predicted_density_15m > m.threshold ? "bg-alert-500 shadow-glow-alert" : "bg-primary-500"}`}
                      style={{ width: `${Math.min((m.current_density / m.threshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Global Tactical Map */}
        <div className="lg:col-span-6 flex flex-col relative rounded-xl overflow-hidden border border-surface-border shadow-lg min-h-[400px]">
          {/* We apply CSS filters on the map to force a dark tactical look */}
          <div className="absolute inset-0 grayscale invert contrast-125 hue-rotate-180 brightness-75">
            <DynamicMap center={defaultCenter} zoom={14} className="h-full w-full" />
          </div>
          
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-ink-950/80 backdrop-blur border border-ink-800 text-xs font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-alert-500 animate-sos-pulse" /> 14 Active Critical
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-ink-950/80 backdrop-blur border border-ink-800 text-xs font-semibold text-ink-300 hover:text-white transition-colors">
              Heatmap
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary-600/80 backdrop-blur border border-primary-500 text-xs font-semibold text-white hover:bg-primary-600 transition-colors">
              Units
            </button>
          </div>
        </div>

        {/* Right Column: Fleet & Intel Feed */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          
          {/* Resource Allocation */}
          <div className="card-elevated p-4 shrink-0">
            <h3 className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-4">Resource Readiness</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-ink-800/50 border border-ink-800 text-center">
                <div className="text-2xl font-display font-bold text-white mb-1">42</div>
                <div className="text-[10px] text-ink-400 font-mono uppercase">Ambulances</div>
                <div className="text-[10px] text-success-400 font-bold mt-1">68% AVAIL</div>
              </div>
              <div className="p-3 rounded-lg bg-ink-800/50 border border-ink-800 text-center">
                <div className="text-2xl font-display font-bold text-white mb-1">115</div>
                <div className="text-[10px] text-ink-400 font-mono uppercase">Responders</div>
                <div className="text-[10px] text-accent-400 font-bold mt-1">41% AVAIL</div>
              </div>
            </div>
          </div>

          {/* Live Intel Feed */}
          <div className="card-elevated flex-1 flex flex-col overflow-hidden min-h-[300px]">
            <div className="p-3 border-b border-surface-border shrink-0 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Tactical Feed</h3>
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar font-mono text-[10px]">
              {liveIncidents.length === 0 ? (
                <div className="text-ink-500 italic h-full flex items-center justify-center">Awaiting telemetry...</div>
              ) : liveIncidents.map((msg, i) => (
                <div key={i} className="p-2 bg-ink-900 rounded border border-ink-800 break-words animate-fade-in-down">
                  <span className="text-primary-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-ink-300">{JSON.stringify(msg)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
