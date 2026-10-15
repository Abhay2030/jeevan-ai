"use client";

import React, { useState } from "react";
import {
  User,
  Ambulance,
  ShieldCheck,
  Radio,
  Phone,
  Mail,
  CheckCircle2,
  Wifi,
  WifiOff,
  BatteryCharging,
  Fuel,
  RefreshCw,
  Clock,
  HardDrive
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";

export default function ResponderProfilePage() {
  const { user } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("All field logs synchronized with Command");

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("Synchronization completed successfully at " + new Date().toLocaleTimeString("en-IN"));
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">
            Responder Profile & Equipment Check
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Official operational credentials, ambulance equipment status, and offline telemetry log.
          </p>
        </div>

        <button
          onClick={() => setIsOnDuty(!isOnDuty)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
            isOnDuty
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-paper-200 text-ink-600 hover:bg-paper-300"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? "bg-white animate-pulse" : "bg-ink-400"}`} />
          <span>{isOnDuty ? "STATUS: ON-DUTY (ACTIVE)" : "STATUS: OFF-DUTY"}</span>
        </button>
      </div>

      {/* Responder Identity Card */}
      <div className="card-elevated p-6 rounded-2xl border border-paper-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white font-display font-bold text-2xl flex items-center justify-center shadow-md">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "R"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-ink-900">
                  {user?.full_name || "Emergency Medical Technician"}
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-ink-500 font-mono">
                Badge ID: <strong className="text-ink-800">EMS-IN-2026-4401</strong>
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-semibold border border-primary-200">
                  Advanced Paramedic (ALS Tier)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-paper-100 text-ink-600 font-mono">
                  Nashik-Trimbak Sector 4
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-ink-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary-600" />
              <span>{user?.email || "responder@jeevan.ai"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-primary-600" />
              <span>+91 94250 88200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Vehicle & Medical Equipment Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Ambulance Telemetry */}
        <div className="card-elevated p-5 rounded-2xl border border-paper-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm text-ink-900 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-primary-600" /> Assigned Vehicle: ALS-01
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold">
              REG: MH-15-EM-9921
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-ink-500 mb-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" /> Fuel Level
              </div>
              <span className="text-xl font-display font-bold text-ink-900">88%</span>
            </div>

            <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-ink-500 mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Medical Inverter
              </div>
              <span className="text-xl font-display font-bold text-emerald-600">96%</span>
            </div>
          </div>

          <ul className="text-xs text-ink-600 space-y-2">
            <li className="flex items-center justify-between py-1 border-b border-paper-100">
              <span>Driver:</span>
              <strong className="text-ink-800">S. Pawar</strong>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-paper-100">
              <span>Paramedic Team:</span>
              <strong className="text-ink-800">Dr. Roy & EMT Joshi</strong>
            </li>
            <li className="flex items-center justify-between py-1">
              <span>Base Station:</span>
              <strong className="text-ink-800">District Civil Lines Depot</strong>
            </li>
          </ul>
        </div>

        {/* Offline Sync & Telemetry Logs */}
        <div className="card-elevated p-5 rounded-2xl border border-paper-200 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm text-ink-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-600" /> Offline Sync Engine
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold font-mono">
                <Wifi className="w-3.5 h-3.5" /> ONLINE
              </div>
            </div>

            <p className="text-xs text-ink-600 mb-4 leading-relaxed">
              When operating in zero-connectivity tunnels or rural valleys, all triage updates and GPS coordinates are preserved securely in local IndexedDB storage.
            </p>

            <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-xs font-mono text-ink-700 space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Pending Offline Queue:</span>
                <span className="font-bold text-emerald-600">0 records (Clear)</span>
              </div>
              <div className="flex justify-between">
                <span>IndexedDB Database:</span>
                <span>jeevan-offline-db (v1)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-ink-400 mb-2 truncate">{syncStatus}</p>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full h-10 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-300 text-ink-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Synchronizing Queue..." : "Sync Telemetry with Command"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
