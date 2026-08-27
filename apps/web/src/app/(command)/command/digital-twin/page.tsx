"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, AlertTriangle, ThermometerSun, Users, Map as MapIcon, BarChart3, Activity, ArrowRight } from "lucide-react";

const DynamicMap = dynamic(() => import("@web/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-ink-900 skeleton">Loading Simulator Engine...</div>,
});

type Scenario = "baseline" | "crowd_surge" | "heatwave" | "road_closure";

export default function DigitalTwin() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<boolean>(false);

  const defaultCenter: [number, number] = [20.0059, 73.7903]; // Nashik

  const handleSimulate = () => {
    setSimulating(true);
    setResults(false);
    setTimeout(() => {
      setSimulating(false);
      setResults(true);
    }, 2500);
  };

  const scenarios = [
    { id: "crowd_surge", icon: Users, title: "Crowd Surge (+40%)", desc: "Simulate massive influx at Ram Ghat" },
    { id: "heatwave", icon: ThermometerSun, title: "Heatwave (42°C)", desc: "Simulate extreme temperature impact on elderly" },
    { id: "road_closure", icon: AlertTriangle, title: "Main Arterial Closure", desc: "Simulate Dewas Road blockage and reroute impact" },
  ];

  const generateMockHeatmapData = () => {
    if (scenario !== "crowd_surge") return null;
    
    const centerLat = 20.0059;
    const centerLng = 73.7903;
    
    const features = [];
    // Generate ~500 points with higher density near the center
    for (let i = 0; i < 500; i++) {
      // Simple normal distribution approximation
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.sin(2.0 * Math.PI * u2);
      
      const latOffset = (z0 * 0.015);
      const lngOffset = (z1 * 0.015);
      
      const distance = Math.sqrt(latOffset*latOffset + lngOffset*lngOffset);
      const density = Math.max(10, 100 - (distance * 4000));
      
      features.push({
        type: "Feature",
        properties: { density },
        geometry: {
          type: "Point",
          coordinates: [centerLng + lngOffset, centerLat + latOffset]
        }
      });
    }
    
    return {
      type: "FeatureCollection",
      features
    };
  };

  const heatmapData = results ? generateMockHeatmapData() : null;

  return (
    <div className="flex-1 flex h-full overflow-hidden relative" data-theme="ink">
      
      {/* Simulation Controls Sidebar */}
      <div className="w-80 flex flex-col bg-ink-950 border-r border-surface-border shrink-0 z-10 shadow-xl">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-500" /> Scenario Engine
          </h2>
          <p className="text-xs text-ink-400 mt-1">Select parameters to stress-test the operational grid.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {scenarios.map(s => (
            <button 
              key={s.id}
              onClick={() => { setScenario(s.id as Scenario); setResults(false); }}
              className={`w-full card-elevated p-4 text-left border transition-all ${scenario === s.id ? "border-primary-500 bg-primary-950/20 shadow-glow-primary" : "border-surface-border bg-ink-900 hover:border-ink-600"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${scenario === s.id ? "bg-primary-600 text-white" : "bg-ink-800 text-ink-300"}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-white">{s.title}</h3>
              </div>
              <p className="text-xs text-ink-400">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-surface-border bg-ink-900/50">
          <button 
            onClick={handleSimulate}
            disabled={simulating || scenario === "baseline"}
            className="w-full h-12 rounded-xl bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
          >
            {simulating ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Computing...</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Execute Simulation</>
            )}
          </button>
          <button 
            onClick={() => { setScenario("baseline"); setResults(false); }}
            className="w-full h-10 mt-2 rounded-xl text-ink-400 text-xs font-semibold hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="flex-1 flex flex-col relative bg-ink-900">
        
        {/* Map Layer */}
        <div className="absolute inset-0 grayscale invert contrast-125 hue-rotate-180 brightness-75">
          <DynamicMap center={defaultCenter} zoom={13} className="h-full w-full" heatmapData={heatmapData} />
        </div>

        {/* Visual Overlay for Road Closure */}
        {results && scenario === "road_closure" && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-alert-500/40 via-transparent to-transparent mix-blend-screen animate-fade-in pointer-events-none" />
        )}

        {/* Results Panel */}
        {results && (
          <div className="absolute top-4 right-4 w-80 card-elevated bg-ink-950/90 backdrop-blur border-ink-800 shadow-2xl p-5 animate-slide-up">
            <h3 className="text-sm font-display font-bold text-white mb-4 flex items-center gap-2 border-b border-ink-800 pb-3">
              <BarChart3 className="w-4 h-4 text-primary-500" /> Simulation Impact
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 mb-1 flex justify-between"><span>Avg Response Time</span> <span className="text-alert-400 font-mono font-bold">+2.4m</span></p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-ink-600 w-1/3" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-500" />
                  <div className="h-2 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-alert-500 w-2/3 shadow-glow-alert" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-400 mb-1 flex justify-between"><span>Medical Tent Capacity</span> <span className="text-alert-400 font-mono font-bold">115%</span></p>
                <div className="h-2 w-full bg-ink-800 rounded-full overflow-hidden">
                  <div className="h-full bg-alert-500 shadow-glow-alert" style={{ width: '100%' }} />
                </div>
              </div>
              
              <div>
                <p className="text-xs text-ink-400 mb-1 flex justify-between"><span>Ambulance Utilization</span> <span className="text-accent-400 font-mono font-bold">94%</span></p>
                <div className="h-2 w-full bg-ink-800 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-500" style={{ width: '94%' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-ink-800">
              <p className="text-[10px] font-mono text-primary-400 mb-2">AI RECOMMENDED ACTION</p>
              <p className="text-xs text-ink-200">Redeploy 12 responder units from Sector A to Sector C. Activate reserve ambulance fleet (Tier 2).</p>
            </div>
          </div>
        )}

        {/* State Indicator */}
        <div className="absolute top-4 left-4 card-elevated px-4 py-2 bg-ink-950/80 backdrop-blur border-ink-800 flex items-center gap-3">
          {simulating ? (
            <><span className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-ping" /> <span className="text-xs font-mono text-accent-400 font-bold">COMPUTING OUTCOMES</span></>
          ) : results ? (
            <><span className="w-2.5 h-2.5 rounded-full bg-alert-500 animate-pulse" /> <span className="text-xs font-mono text-alert-400 font-bold">SIMULATION ACTIVE</span></>
          ) : (
            <><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> <span className="text-xs font-mono text-primary-400 font-bold">BASELINE READY</span></>
          )}
        </div>
      </div>

    </div>
  );
}
