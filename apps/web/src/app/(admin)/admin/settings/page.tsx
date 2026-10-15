"use client";

import React, { useState } from "react";
import {
  Settings,
  Cpu,
  Database,
  Radio,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Shield,
  Zap,
  Power
} from "lucide-react";

interface ServiceHealth {
  name: string;
  category: "AI_MODELS" | "DATA_INGESTION" | "TELEMETRY_PIPELINE" | "TELEPHONY";
  status: "OPERATIONAL" | "DEGRADED" | "STANDBY";
  latencyMs: number;
  uptimePercent: number;
  version: string;
  lastSync: string;
}

const INITIAL_SERVICES: ServiceHealth[] = [
  {
    name: "Gemini 2.5 Flash Triage Engine",
    category: "AI_MODELS",
    status: "OPERATIONAL",
    latencyMs: 142,
    uptimePercent: 99.94,
    version: "v2.5-flash-triage-prod",
    lastSync: "32s ago",
  },
  {
    name: "Sarvam Indic Voice (10 Languages)",
    category: "TELEPHONY",
    status: "OPERATIONAL",
    latencyMs: 210,
    uptimePercent: 99.82,
    version: "sarvam-speech-v1.4",
    lastSync: "12s ago",
  },
  {
    name: "Spatiotemporal Crowd Surge ML Model",
    category: "AI_MODELS",
    status: "OPERATIONAL",
    latencyMs: 84,
    uptimePercent: 99.98,
    version: "xgboost-crowd-density-v3.1",
    lastSync: "1m ago",
  },
  {
    name: "IMD National Weather Radar Feed",
    category: "DATA_INGESTION",
    status: "OPERATIONAL",
    latencyMs: 340,
    uptimePercent: 99.40,
    version: "imd-radar-sync-v2",
    lastSync: "3m ago",
  },
  {
    name: "Central Pollution Control Board (CPCB AQI)",
    category: "DATA_INGESTION",
    status: "OPERATIONAL",
    latencyMs: 410,
    uptimePercent: 98.90,
    version: "cpcb-api-v1",
    lastSync: "4m ago",
  },
  {
    name: "108 Emergency Telemetry Webhook Stream",
    category: "TELEMETRY_PIPELINE",
    status: "OPERATIONAL",
    latencyMs: 58,
    uptimePercent: 99.99,
    version: "postgis-pubsub-cluster",
    lastSync: "Live",
  },
];

export default function AdminSettingsPage() {
  const [services, setServices] = useState<ServiceHealth[]>(INITIAL_SERVICES);
  const [platformMode, setPlatformMode] = useState<"NORMAL" | "MASS_GATHERING" | "NATIONAL_EMERGENCY">("MASS_GATHERING");
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState<number>(75);
  const [autoDivertHospitalThreshold, setAutoDivertHospitalThreshold] = useState<number>(85);
  const [syncRateSeconds, setSyncRateSeconds] = useState<number>(5);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveSettings = () => {
    setFeedback("Platform operational thresholds and model parameters updated.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-500" /> Platform Configuration & System Health
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Global operational modes, AI inference model versions, telemetry thresholds, and upstream service SLAs.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" /> Save Global Configuration
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Operational State Banner */}
      <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Platform Operational State Override
            </h2>
          </div>
          <span className="text-[10px] font-mono text-ink-400">Affects rate limits and notification channels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setPlatformMode("NORMAL")}
            className={`p-4 rounded-xl border text-left transition-all ${
              platformMode === "NORMAL"
                ? "bg-primary-950/40 border-primary-500 ring-1 ring-primary-500"
                : "bg-ink-950 border-ink-800 hover:border-ink-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">NORMAL OPERATIONS</span>
              {platformMode === "NORMAL" && <CheckCircle2 className="w-4 h-4 text-primary-400" />}
            </div>
            <p className="text-[11px] text-ink-400 mt-1">Standard polling (15s), baseline triage dispatch.</p>
          </button>

          <button
            onClick={() => setPlatformMode("MASS_GATHERING")}
            className={`p-4 rounded-xl border text-left transition-all ${
              platformMode === "MASS_GATHERING"
                ? "bg-amber-950/40 border-amber-500 ring-1 ring-amber-500"
                : "bg-ink-950 border-ink-800 hover:border-ink-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">MASS GATHERING SURGE</span>
              {platformMode === "MASS_GATHERING" && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-ink-400 mt-1">
              Active for Kumbh Mela / Rallies. High frequency GPS (3s), real-time stampede detection.
            </p>
          </button>

          <button
            onClick={() => setPlatformMode("NATIONAL_EMERGENCY")}
            className={`p-4 rounded-xl border text-left transition-all ${
              platformMode === "NATIONAL_EMERGENCY"
                ? "bg-red-950/40 border-red-500 ring-1 ring-red-500"
                : "bg-ink-950 border-ink-800 hover:border-ink-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-300">NATIONAL DISASTER PROTOCOL</span>
              {platformMode === "NATIONAL_EMERGENCY" && <CheckCircle2 className="w-4 h-4 text-red-400" />}
            </div>
            <p className="text-[11px] text-ink-400 mt-1">
              NDRF / Civil Defense direct preemption. Automated hospital bed surge mobilization.
            </p>
          </button>
        </div>
      </div>

      {/* Grid: Service Health & Telemetry Thresholds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Service Health: 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-primary-400" /> Upstream Services & AI Infrastructure SLAs
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              6 / 6 OPERATIONAL
            </span>
          </div>

          <div className="space-y-2">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-4 rounded-xl bg-ink-900 border border-ink-800 hover:border-ink-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{svc.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ink-800 text-ink-400">
                      {svc.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-ink-400 font-mono">
                    <span>Latency: {svc.latencyMs}ms</span>
                    <span>•</span>
                    <span>Uptime: {svc.uptimePercent}%</span>
                    <span>•</span>
                    <span>Synced: {svc.lastSync}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    OPERATIONAL
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry & AI Model Controls: 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary-400" /> Automated Intelligence Controls
          </h3>

          <div className="p-5 rounded-2xl bg-ink-900 border border-ink-800 space-y-5 text-xs">
            <div>
              <div className="flex items-center justify-between text-ink-300 mb-1.5">
                <label className="font-semibold">AI Triage Severity Confidence Gate</label>
                <span className="font-mono text-primary-400 font-bold">{aiConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(parseInt(e.target.value))}
                className="w-full accent-primary-500 cursor-pointer"
              />
              <p className="text-[10px] text-ink-500 mt-1">
                Incidents scoring below this threshold require human operator verification before responder dispatch.
              </p>
            </div>

            <div className="pt-3 border-t border-ink-800">
              <div className="flex items-center justify-between text-ink-300 mb-1.5">
                <label className="font-semibold">Hospital Auto-Divert Trigger</label>
                <span className="font-mono text-red-400 font-bold">{autoDivertHospitalThreshold}% Occupancy</span>
              </div>
              <input
                type="range"
                min={70}
                max={98}
                value={autoDivertHospitalThreshold}
                onChange={(e) => setAutoDivertHospitalThreshold(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <p className="text-[10px] text-ink-500 mt-1">
                Automatically reroutes incoming ALS ambulances to secondary facilities once ICU capacity crosses this limit.
              </p>
            </div>

            <div className="pt-3 border-t border-ink-800">
              <div className="flex items-center justify-between text-ink-300 mb-1.5">
                <label className="font-semibold">GPS Telemetry Ingestion Cadence</label>
                <span className="font-mono text-sky-400 font-bold">{syncRateSeconds} Seconds</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={syncRateSeconds}
                onChange={(e) => setSyncRateSeconds(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[10px] text-ink-500 mt-1">
                Cadence for responder vehicle WebSockets and crowd heat density re-calculation.
              </p>
            </div>

            <div className="pt-3 border-t border-ink-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Mock / Synthetic Fallback Mode</span>
                  <span className="text-[10px] text-ink-400">When external APIs are unreachable</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  GRACEFUL DEGRADE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
