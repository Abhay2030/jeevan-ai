"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Navigation,
  Compass,
  Hospital,
  AlertTriangle,
  ArrowRight,
  Shield,
  Phone,
  Gauge,
  MapPin,
  Clock,
  Layers
} from "lucide-react";
import { DEMO_INCIDENTS, DEMO_HOSPITALS, DEMO_AMBULANCES } from "@web/lib/geoIntelligenceData";
import type { MapPoint } from "@web/components/Map";

const DynamicMap = dynamic(() => import("@web/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-mono text-xs">
      Loading Tactical Navigation Grid...
    </div>
  ),
});

export default function ResponderMapPage() {
  const [activeAmbulance] = useState(DEMO_AMBULANCES[0]); // ALS-01
  const [targetIncident] = useState(DEMO_INCIDENTS[0]); // Heat exhaustion cluster
  const [targetHospital] = useState(DEMO_HOSPITALS[0]); // District Apex Trauma Centre

  const responderPoints: MapPoint[] = [
    {
      id: activeAmbulance.id,
      latitude: activeAmbulance.latitude,
      longitude: activeAmbulance.longitude,
      title: activeAmbulance.callsign,
      type: "ambulance",
      severity: "CRITICAL",
      metadata: activeAmbulance,
    },
    {
      id: targetIncident.id,
      latitude: targetIncident.latitude,
      longitude: targetIncident.longitude,
      title: targetIncident.title,
      type: "incident",
      severity: targetIncident.severity,
      metadata: targetIncident,
    },
    {
      id: targetHospital.id,
      latitude: targetHospital.latitude,
      longitude: targetHospital.longitude,
      title: targetHospital.name,
      type: "hospital",
      metadata: targetHospital,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950">
      {/* Map Surface */}
      <div className="absolute inset-0 z-0">
        <DynamicMap
          center={[activeAmbulance.latitude, activeAmbulance.longitude]}
          zoom={15}
          pitch={65}
          bearing={315}
          points={responderPoints}
          selectedPointId={activeAmbulance.id}
          show3DBuildings={true}
          theme="dark"
          styleMode="google-hybrid"
        />
      </div>

      {/* Top Floating Turn-By-Turn Navigation Card */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:w-96 z-10 animate-fade-in-down">
        <div className="p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-sky-500/30 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block mb-0.5">
                NEXT CORRIDOR MANEUVER • IN 280 METERS
              </span>
              <h2 className="font-display font-bold text-sm text-white leading-tight truncate">
                Turn Right onto Shahi Marg Arterial
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Target: {targetIncident.locationName}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>ETA: ~3 MINS</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400 font-bold">
              <Gauge className="w-3.5 h-3.5" />
              <span>48 KM/H (CORRIDOR PRIORITY)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Telemetry & Hospital Handover Card */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-6 sm:left-auto sm:w-96 z-10 animate-fade-in-up">
        <div className="p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200">
                Unit {activeAmbulance.callsign}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              BATTERY 88%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase block">
                Pre-Notified Trauma Facility:
              </span>
              <h3 className="font-bold text-xs text-white truncate max-w-[200px]">
                {targetHospital.name}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                ICU Beds Avail: {targetHospital.icuBedsAvailable} • O2 Avail: {targetHospital.oxygenBedsAvailable}
              </p>
            </div>
            <a
              href={`tel:${targetHospital.contactNumber}`}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              title="Call Hospital Emergency Desk"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="flex gap-2">
            <Link
              href="/responder/incidents"
              className="flex-1 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" /> Back to Triage Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
