"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Zap, MapPin, Navigation, Settings2, Clock,
  AlertTriangle, Play, Pause, ArrowRight, Shield,
  Radio, CheckCircle2, Siren, Activity, Layers
} from "lucide-react";
import { ProvenanceBadge } from "@jeevan-ai/ui";

const DynamicMap = dynamic(() => import("@web/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-ink-900 skeleton">Loading Green Corridor Telemetry Grid...</div>,
});

interface GreenCorridor {
  id: string;
  hub: string;
  name: string;
  from: string;
  to: string;
  signalsSynchronized: number;
  eta: string;
  timeSaved: string;
  status: "ACTIVE" | "DEGRADED" | "STANDBY";
  traffic: "CLEAR" | "MODERATE" | "HEAVY";
  center: [number, number];
  zoom: number;
}

const NATIONAL_CORRIDORS: GreenCorridor[] = [
  {
    id: "gc-del-01",
    hub: "Delhi NCR",
    name: "Red Fort — AIIMS Apex Trauma Expressway Corridor",
    from: "Old Delhi Heritage Concourse",
    to: "AIIMS Apex Trauma Center (Safdarjung)",
    signalsSynchronized: 18,
    eta: "9m 14s",
    timeSaved: "22 mins",
    status: "ACTIVE",
    traffic: "CLEAR",
    center: [28.6139, 77.2090],
    zoom: 13
  },
  {
    id: "gc-mum-01",
    hub: "Mumbai MMR",
    name: "Dadar TT — KEM Casualty Green Wave",
    from: "Dadar Central Junction",
    to: "KEM Emergency Trauma Care",
    signalsSynchronized: 12,
    eta: "4m 50s",
    timeSaved: "16 mins",
    status: "ACTIVE",
    traffic: "CLEAR",
    center: [19.0178, 72.8478],
    zoom: 14
  },
  {
    id: "gc-var-01",
    hub: "Varanasi Ganga",
    name: "Dashashwamedh Ghat — BHU Trauma Corridor",
    from: "Dashashwamedh Pilgrim Enclosure",
    to: "BHU IMS Super Speciality Trauma",
    signalsSynchronized: 9,
    eta: "11m 30s",
    timeSaved: "34 mins",
    status: "DEGRADED",
    traffic: "MODERATE",
    center: [25.3074, 83.0103],
    zoom: 14
  },
  {
    id: "gc-ben-01",
    hub: "Bengaluru Urban",
    name: "Silk Board — Victoria Hospital Trauma Route",
    from: "Silk Board Elevated Ramp",
    to: "Victoria Hospital Disaster Care",
    signalsSynchronized: 15,
    eta: "13m 20s",
    timeSaved: "28 mins",
    status: "ACTIVE",
    traffic: "CLEAR",
    center: [12.9642, 77.5753],
    zoom: 13
  },
  {
    id: "gc-ind-01",
    hub: "Indore Malwa",
    name: "Rajwada — MY Hospital BRTS Dedicated Channel",
    from: "Rajwada Palace Square",
    to: "MY Hospital Medical Hub",
    signalsSynchronized: 8,
    eta: "5m 10s",
    timeSaved: "14 mins",
    status: "STANDBY",
    traffic: "CLEAR",
    center: [22.7196, 75.8577],
    zoom: 14
  }
];

export default function SmartCorridors() {
  const [activeCorridorId, setActiveCorridorId] = useState<string>("gc-del-01");
  const [isPreemptionActive, setIsPreemptionActive] = useState(true);

  const active = NATIONAL_CORRIDORS.find((c) => c.id === activeCorridorId) || NATIONAL_CORRIDORS[0];

  return (
    <div className="flex-1 flex h-[100dvh] overflow-hidden relative bg-ink-950 text-white" data-theme="ink">
      {/* Sidebar Controls */}
      <div className="w-80 lg:w-96 flex flex-col bg-ink-950 border-r border-ink-800 shrink-0 z-10 shadow-2xl relative">
        <div className="p-5 border-b border-ink-800 bg-ink-900/60">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-400" /> Smart Green Corridors
            </h2>
            <ProvenanceBadge provenance="[LIVE]" />
          </div>
          <p className="text-[10px] text-ink-400 font-mono leading-relaxed">
            Dynamic Traffic Signal Preemption (EVP) & Automated Police Pilot Routing across Indian Metros.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-2">
              <Navigation className="w-3 h-3 text-primary-400" /> Active Emergency Corridors
            </h3>
            <button
              onClick={() => setIsPreemptionActive(!isPreemptionActive)}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 ${
                isPreemptionActive
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                  : "bg-ink-800 border-ink-700 text-ink-400"
              }`}
              title="Toggle Preemption Engine"
            >
              {isPreemptionActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPreemptionActive ? "EVP ON" : "PAUSED"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {NATIONAL_CORRIDORS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveCorridorId(c.id)}
                className={`w-full card-elevated p-4 text-left border transition-all ${
                  activeCorridorId === c.id
                    ? "border-accent-500 bg-accent-950/20 shadow-glow-accent"
                    : "border-ink-800 bg-ink-900/70 hover:border-ink-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-ink-400 bg-ink-800 px-2 py-0.5 rounded">
                    {c.hub}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider ${
                      c.status === "ACTIVE"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : c.status === "DEGRADED"
                        ? "bg-alert-950 text-alert-400 border border-alert-800"
                        : "bg-ink-800 text-ink-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className={`font-display font-bold text-sm ${activeCorridorId === c.id ? "text-accent-400" : "text-white"}`}>
                  {c.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-ink-300 font-medium my-2">
                  <span className="truncate flex-1">{c.from}</span>
                  <ArrowRight className="w-3 h-3 text-ink-600 shrink-0" />
                  <span className="truncate flex-1 text-right">{c.to}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-ink-800 text-[10px] font-mono text-ink-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-accent-400" /> ETA {c.eta}
                  </span>
                  <span className="text-emerald-400 font-bold">Saved: {c.timeSaved}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Summary Footer */}
        <div className="p-4 border-t border-ink-800 bg-ink-950 shrink-0 text-xs font-mono space-y-2">
          <div className="flex justify-between text-ink-400">
            <span>Signals Preempted:</span>
            <span className="text-white font-bold">{active.signalsSynchronized} Intersections</span>
          </div>
          <div className="flex justify-between text-ink-400">
            <span>Corridor Health:</span>
            <span className="text-emerald-400 font-bold">100% Signal Override Active</span>
          </div>
        </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 flex flex-col relative bg-ink-900">
        <div className="absolute inset-0">
          <DynamicMap center={active.center} zoom={active.zoom} className="h-full w-full" theme="dark" />
        </div>

        {/* Floating Telemetry Card */}
        <div className="absolute top-4 right-4 z-20 w-80 card-elevated p-5 bg-ink-950/90 backdrop-blur border-ink-800 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-accent-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> EVP Signal Control
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● LIVE PRIORITY</span>
          </div>

          <h4 className="text-sm font-display font-bold text-white mb-1">{active.name}</h4>
          <p className="text-[11px] text-ink-400 font-mono leading-relaxed mb-4">
            AI synchronized {active.signalsSynchronized} traffic junctions along the primary route. Estimated time savings:{" "}
            <span className="text-emerald-400 font-bold">{active.timeSaved}</span> compared to baseline traffic.
          </p>

          <div className="space-y-2 pt-3 border-t border-ink-800 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-ink-400">Transit ETA:</span>
              <span className="text-white font-bold">{active.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">Hospital Alert:</span>
              <span className="text-emerald-400 font-bold">Casualty Ward Pre-Notified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
