"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, AlertTriangle, ThermometerSun, Users, BarChart3, Activity, ArrowRight, Settings2, SlidersHorizontal, Layers, Crosshair, Clock, CheckCircle2 } from "lucide-react";
import type { MapPoint } from "@web/components/Map";

const DynamicMap = dynamic(() => import("@web/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-ink-900 skeleton">Loading 3D Digital Twin...</div>,
});

type Scenario = "baseline" | "crowd_surge" | "heatwave" | "road_closure";

const STATIC_POINTS: MapPoint[] = [
  { id: "z1", type: "zone", title: "RAMKUND", latitude: 20.0059, longitude: 73.7903, severity: "HIGH", metadata: { risk: 84 } },
  { id: "z2", type: "zone", title: "PANCHAVATI", latitude: 20.0080, longitude: 73.7920, severity: "MEDIUM", metadata: { risk: 42 } },
  { id: "z3", type: "zone", title: "TAPOVAN", latitude: 19.9950, longitude: 73.8050, severity: "LOW", metadata: { risk: 15 } },
  { id: "h1", type: "hospital", title: "Civil Hospital", latitude: 19.9975, longitude: 73.7890 },
  { id: "h2", type: "hospital", title: "Apollo Apollo", latitude: 20.0120, longitude: 73.7800 },
  { id: "c1", type: "camp", title: "Medical Camp Alpha", latitude: 20.0030, longitude: 73.7950 },
  { id: "c2", type: "camp", title: "Medical Camp Beta", latitude: 20.0090, longitude: 73.7850 },
];

// Shahi Marg path
const CORRIDOR_PATH = [
  [73.7850, 20.0120], [73.7880, 20.0090], [73.7903, 20.0059], [73.7950, 20.0030], [73.8000, 20.0000]
];

export default function DigitalTwin() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<boolean>(false);
  
  // Simulation modifiers
  const [crowdMultiplier, setCrowdMultiplier] = useState(1.0);
  const [temperature, setTemperature] = useState(34);

  const [activeAmbulances, setActiveAmbulances] = useState<MapPoint[]>([
    { id: "a1", type: "ambulance", title: "AMB-04", latitude: 20.0120, longitude: 73.7850, metadata: { speed: 0, status: "STANDBY", dest: "-" } },
    { id: "a2", type: "ambulance", title: "AMB-12", latitude: 19.9950, longitude: 73.8000, metadata: { speed: 45, status: "EN_ROUTE", dest: "Civil Hospital" } },
  ]);

  const [activeIncidents, setActiveIncidents] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const defaultCenter: [number, number] = [20.0059, 73.7903]; // Nashik Ramkund

  const handleSimulate = () => {
    setSimulating(true);
    setResults(false);
    setSelectedPoint(null);
    setTimeout(() => {
      setSimulating(false);
      setResults(true);
      
      // Spawn incidents based on scenario
      if (scenario === "crowd_surge") {
        setActiveIncidents([{ id: "i1", type: "incident", title: "CROWD CRUSH ALERT", latitude: 20.0065, longitude: 73.7910, severity: "CRITICAL" }]);
      } else if (scenario === "heatwave") {
        setActiveIncidents([
          { id: "i2", type: "incident", title: "HEATSTROKE", latitude: 20.0040, longitude: 73.7930, severity: "HIGH" },
          { id: "i3", type: "incident", title: "FAINTING", latitude: 20.0080, longitude: 73.7900, severity: "MEDIUM" }
        ]);
      }
    }, 2500);
  };

  // Live Ambulance Movement Simulation Loop
  useEffect(() => {
    if (!results) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02; // Move along path
      if (progress > 1) progress = 1;
      
      setActiveAmbulances(prev => {
        const amb1 = prev.find(a => a.id === "a1");
        if (!amb1) return prev;
        
        // Move AMB-04 towards Ramkund (73.7903, 20.0059)
        const targetLng = 73.7903;
        const targetLat = 20.0059;
        
        const newLng = amb1.longitude + (targetLng - amb1.longitude) * 0.05;
        const newLat = amb1.latitude + (targetLat - amb1.latitude) * 0.05;
        
        return [
          { ...amb1, longitude: newLng, latitude: newLat, metadata: { ...amb1.metadata, speed: Math.floor(30 + Math.random() * 15), status: "DISPATCHED", dest: "RAMKUND SOS" } },
          prev[1]
        ];
      });
      
    }, 1000);

    return () => clearInterval(interval);
  }, [results, scenario]);

  const scenarios = [
    { id: "crowd_surge", icon: Users, title: "Crowd Surge", desc: "Simulate massive influx at Ram Ghat" },
    { id: "heatwave", icon: ThermometerSun, title: "Heatwave", desc: "Simulate extreme temperature impact on elderly" },
    { id: "road_closure", icon: AlertTriangle, title: "Arterial Closure", desc: "Simulate Dewas Road blockage and reroutes" },
  ];

  const generateMockHeatmapData = useCallback(() => {
    if (scenario !== "crowd_surge") return null;
    
    const centerLat = 20.0059;
    const centerLng = 73.7903;
    
    const features = [];
    const count = Math.floor(500 * crowdMultiplier);
    
    for (let i = 0; i < count; i++) {
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
  }, [scenario, crowdMultiplier]);

  const heatmapData = useMemo(() => results ? generateMockHeatmapData() : null, [results, generateMockHeatmapData]);

  const corridorsData = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { color: scenario === "road_closure" && results ? "#ef4444" : "#10b981" },
          geometry: {
            type: "LineString",
            coordinates: CORRIDOR_PATH
          }
        }
      ]
    };
  }, [scenario, results]);

  // Dynamic Risk calculation for zones
  const mapPoints = useMemo(() => {
    return STATIC_POINTS.map(p => {
      if (p.type === "zone") {
        let risk = p.metadata?.risk || 50;
        if (results && scenario === "crowd_surge" && p.id === "z1") risk = Math.min(99, risk + 15 * crowdMultiplier);
        if (results && scenario === "heatwave" && p.id === "z1") risk = Math.min(99, risk + (temperature - 34) * 2);
        
        let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "LOW";
        if (risk > 80) severity = "CRITICAL";
        else if (risk > 60) severity = "HIGH";
        else if (risk > 40) severity = "MEDIUM";
        
        return { ...p, severity, metadata: { ...p.metadata, risk: Math.floor(risk) } };
      }
      return p;
    }).concat(activeAmbulances).concat(activeIncidents);
  }, [results, scenario, crowdMultiplier, temperature, activeAmbulances, activeIncidents]);


  return (
    <div className="flex-1 flex h-[100dvh] overflow-hidden relative" data-theme="ink">
      
      {/* Simulation Controls Sidebar */}
      <div className="w-80 lg:w-96 flex flex-col bg-ink-950 border-r border-ink-800 shrink-0 z-10 shadow-2xl relative">
        <div className="p-5 border-b border-ink-800 bg-ink-950">
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-500" /> Digital Twin Engine
          </h2>
          <p className="text-[10px] text-ink-400 font-mono mt-1 leading-relaxed">Adjust parameters and run predictive simulations to stress-test Kumbh operations.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          
          {/* Scenario Selection */}
          <div>
            <h3 className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> Select Base Scenario
            </h3>
            <div className="space-y-2">
              {scenarios.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setScenario(s.id as Scenario); setResults(false); setActiveIncidents([]); }}
                  className={`w-full card-elevated p-3 text-left border transition-all ${scenario === s.id ? "border-primary-500 bg-primary-950/20 shadow-glow-primary" : "border-ink-800 bg-ink-900 hover:border-ink-600"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${scenario === s.id ? "bg-primary-600 text-white" : "bg-ink-800 text-ink-400"}`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${scenario === s.id ? "text-white" : "text-ink-200"}`}>{s.title}</h3>
                      <p className="text-[10px] text-ink-400 font-mono mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modifiers (Sliders) */}
          <div className="pt-4 border-t border-ink-800">
             <h3 className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-3 h-3" /> Environmental Modifiers
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-ink-300 font-semibold">Crowd Multiplier</span>
                  <span className="text-primary-400 font-mono font-bold">x{crowdMultiplier.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="3.0" step="0.1" 
                  value={crowdMultiplier}
                  onChange={(e) => { setCrowdMultiplier(parseFloat(e.target.value)); setResults(false); }}
                  className="w-full accent-primary-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-ink-300 font-semibold">Temperature (°C)</span>
                  <span className={`font-mono font-bold ${temperature > 40 ? "text-alert-500" : temperature > 35 ? "text-accent-500" : "text-primary-400"}`}>{temperature}°C</span>
                </div>
                <input 
                  type="range" 
                  min="20" max="50" step="1" 
                  value={temperature}
                  onChange={(e) => { setTemperature(parseInt(e.target.value)); setResults(false); }}
                  className="w-full accent-accent-500"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="p-5 border-t border-ink-800 bg-ink-950 shrink-0">
          <button 
            onClick={handleSimulate}
            disabled={simulating}
            className={`w-full h-12 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${simulating ? "bg-primary-800 cursor-wait" : "bg-primary-600 hover:bg-primary-500 shadow-primary-600/20"}`}
          >
            {simulating ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> RUNNING SIMULATION...</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> EXECUTE SCENARIO</>
            )}
          </button>
          
          <button 
            onClick={() => { setScenario("baseline"); setCrowdMultiplier(1.0); setTemperature(34); setResults(false); setActiveIncidents([]); }}
            className="w-full h-10 mt-3 rounded-lg text-ink-400 text-xs font-semibold hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Live Baseline
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="flex-1 flex flex-col relative bg-ink-900">
        
        {/* Map Layer */}
        <div className="absolute inset-0 grayscale invert contrast-125 hue-rotate-180 brightness-[0.7] saturate-50">
          <DynamicMap 
            center={defaultCenter} 
            zoom={14} 
            className="h-full w-full" 
            heatmapData={heatmapData} 
            corridorsData={corridorsData}
            points={mapPoints}
            onPointClick={setSelectedPoint}
            animateOnLoad={true}
          />
        </div>

        {/* Visual Overlay for Road Closure */}
        {results && scenario === "road_closure" && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-alert-500/30 via-transparent to-transparent mix-blend-screen animate-fade-in pointer-events-none" />
        )}
        
        {/* Visual Overlay for Heatwave */}
        {results && temperature >= 40 && (
          <div className="absolute inset-0 bg-accent-500/10 mix-blend-screen animate-fade-in pointer-events-none" />
        )}

        {/* Intelligence Side Panel (Right) */}
        {selectedPoint && (
          <div className="absolute top-4 right-4 w-[340px] card-elevated bg-ink-950/95 backdrop-blur border-ink-800 shadow-2xl p-5 animate-slide-in-right z-20">
            <h3 className="text-sm font-display font-bold text-white mb-4 flex items-center justify-between border-b border-ink-800 pb-3">
              <span className="flex items-center gap-2">
                {selectedPoint.type === "hospital" && <span className="text-indigo-400 text-lg">🏥</span>}
                {selectedPoint.type === "camp" && <span className="text-emerald-400 text-lg">⛑</span>}
                {selectedPoint.type === "ambulance" && <span className="text-sky-400 text-lg">🚑</span>}
                {selectedPoint.type === "zone" && <Crosshair className="w-4 h-4 text-primary-500" />}
                {selectedPoint.title}
              </span>
              <button onClick={() => setSelectedPoint(null)} className="text-ink-500 hover:text-white">&times;</button>
            </h3>
            
            <div className="space-y-4">
              {selectedPoint.type === "zone" && (
                <>
                  <div className="text-center p-4 bg-ink-900 border border-ink-800 rounded-xl">
                    <p className="text-[10px] font-mono text-ink-500 mb-1">AI RISK SCORE</p>
                    <p className={`text-4xl font-display font-bold ${selectedPoint.metadata?.risk > 80 ? 'text-alert-500' : selectedPoint.metadata?.risk > 60 ? 'text-accent-500' : 'text-primary-500'}`}>{selectedPoint.metadata?.risk}</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="flex justify-between text-ink-300"><span>Crowd Density</span> <span>{Math.floor(4.2 * crowdMultiplier)} pax/m²</span></p>
                    <p className="flex justify-between text-ink-300"><span>Temperature</span> <span>{temperature}°C</span></p>
                    <p className="flex justify-between text-ink-300"><span>Active SOS</span> <span>{activeIncidents.length}</span></p>
                  </div>
                </>
              )}

              {selectedPoint.type === "ambulance" && (
                <>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 bg-ink-900 border border-ink-800 rounded-lg">
                      <p className="text-[10px] font-mono text-ink-500 mb-1">SPEED</p>
                      <p className="text-lg font-bold text-sky-400">{selectedPoint.metadata?.speed || 0} km/h</p>
                    </div>
                    <div className="p-3 bg-ink-900 border border-ink-800 rounded-lg">
                      <p className="text-[10px] font-mono text-ink-500 mb-1">STATUS</p>
                      <p className="text-xs font-bold text-white mt-2">{selectedPoint.metadata?.status}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-ink-900 border border-ink-800 rounded-lg mt-2">
                    <p className="text-[10px] font-mono text-ink-500 mb-1">DESTINATION</p>
                    <p className="text-sm font-bold text-ink-200">{selectedPoint.metadata?.dest}</p>
                  </div>
                </>
              )}

              {selectedPoint.type === "hospital" && (
                <>
                  <div className="p-3 bg-indigo-950/30 border border-indigo-900 rounded-lg mb-2 flex items-center gap-2 text-indigo-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> EMERGENCY READY
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-ink-300">
                      <span>ICU Beds</span> <span className="font-bold text-white">12 Available</span>
                    </div>
                    <div className="h-1 w-full bg-ink-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[70%]" /></div>
                    
                    <div className="flex justify-between text-ink-300 pt-2">
                      <span>Blood Bank (O-)</span> <span className="font-bold text-alert-400">Low Stock (2 Units)</span>
                    </div>
                  </div>
                </>
              )}
              
              {selectedPoint.type === "camp" && (
                <>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-900 rounded-lg mb-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> FULLY OPERATIONAL
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="flex justify-between text-ink-300"><span>Doctors on duty</span> <span className="font-bold text-white">8</span></p>
                    <p className="flex justify-between text-ink-300"><span>Active Cases</span> <span className="font-bold text-white">{Math.floor(12 * crowdMultiplier)}</span></p>
                    <p className="flex justify-between text-ink-300"><span>Water Reserves</span> <span className="font-bold text-sky-400">92%</span></p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Global Results Panel (If nothing selected) */}
        {results && !selectedPoint && (
          <div className="absolute top-4 right-4 w-[340px] card-elevated bg-ink-950/95 backdrop-blur border-ink-800 shadow-2xl p-5 animate-slide-in-bottom pointer-events-none">
            <h3 className="text-sm font-display font-bold text-white mb-4 flex items-center justify-between border-b border-ink-800 pb-3">
              <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-500" /> Impact Analysis</span>
              <span className="text-[10px] font-mono text-ink-400 bg-ink-900 px-2 py-0.5 rounded">T+15 MINS</span>
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-mono text-ink-400 mb-1 flex justify-between"><span>MEDICAL INCIDENTS</span> <span className="text-alert-400 font-bold">+{Math.floor(crowdMultiplier * (temperature > 38 ? 45 : 12))}%</span></p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-ink-500 w-1/3" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-ink-600" />
                  <div className="h-1.5 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-alert-500 w-[78%] shadow-glow-alert" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-ink-400 mb-1 flex justify-between"><span>AMBULANCE RESPONSE ETA</span> <span className="text-alert-400 font-bold">{scenario === "road_closure" ? "+14m" : "+4m"}</span></p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className="h-full bg-ink-500 w-1/4" />
                  </div>
                  <ArrowRight className="w-3 h-3 text-ink-600" />
                  <div className="h-1.5 flex-1 bg-ink-800 rounded-full overflow-hidden">
                    <div className={`h-full w-[85%] ${scenario === "road_closure" ? "bg-alert-500 shadow-glow-alert" : "bg-accent-500"}`} />
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-mono text-ink-400 mb-1 flex justify-between"><span>CROWD DENSITY (RAMKUND)</span> <span className="text-primary-400 font-bold">{Math.floor(4.2 * crowdMultiplier)} pax/m²</span></p>
                <div className="h-1.5 w-full bg-ink-800 rounded-full overflow-hidden">
                  <div className={`h-full ${crowdMultiplier > 1.5 ? "bg-alert-500 shadow-glow-alert" : "bg-primary-500"}`} style={{ width: `${Math.min(100, (4.2 * crowdMultiplier / 6) * 100)}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ink-800 bg-alert-950/20 -mx-5 px-5 -mb-5 pb-5 rounded-b-xl border-t-alert-900/50">
              <p className="text-[10px] font-mono text-alert-400 mb-2 font-bold flex items-center gap-1.5"><Activity className="w-3 h-3" /> AI MITIGATION PLAN</p>
              <ul className="text-xs text-ink-200 space-y-1.5 list-disc pl-3">
                {scenario === "road_closure" && <li>Reroute AMB-04 and AMB-12 via Gangapur Road.</li>}
                {temperature >= 40 && <li>Deploy 5 mobile hydration units to Sector B.</li>}
                {crowdMultiplier > 1.5 && <li>Halt entry at Gate 4; divert foot traffic to Godavari bridge.</li>}
                <li>Pre-emptively alert Civil Hospital for mass casualty protocol.</li>
              </ul>
            </div>
          </div>
        )}

        {/* State Indicator */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-ink-950/90 backdrop-blur border border-ink-800 rounded-lg flex items-center gap-2 shadow-lg">
          {simulating ? (
            <><span className="w-2 h-2 rounded-full bg-accent-500 animate-ping" /> <span className="text-[10px] font-mono text-accent-400 font-bold">COMPUTING</span></>
          ) : results ? (
            <><span className="w-2 h-2 rounded-full bg-alert-500 animate-pulse" /> <span className="text-[10px] font-mono text-alert-400 font-bold">SIMULATION ACTIVE</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-primary-500" /> <span className="text-[10px] font-mono text-primary-400 font-bold">BASELINE</span></>
          )}
        </div>
      </div>

    </div>
  );
}
