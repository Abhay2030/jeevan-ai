"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  User,
  HeartPulse,
  Activity,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { SeverityBadge, ProvenanceBadge } from "@jeevan-ai/ui";
import type { IncidentStatus, Severity } from "@jeevan-ai/types";

interface ResponderIncident {
  id: string;
  refNumber: string;
  title: string;
  category: string;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  distanceKm: number;
  etaMin: number;
  reportedTime: string;
  callerName: string;
  callerPhone: string;
  casualtiesCount: number;
  triageNotes: string;
  recommendedHospital: string;
  provenance: "[LIVE]" | "[REPORTED]";
}

const INITIAL_INCIDENTS: ResponderIncident[] = [
  {
    id: "inc-01",
    refNumber: "IND-2026-9921",
    title: "Acute Cardiac Arrest & Dehydration Collapse",
    category: "MEDICAL_EMERGENCY",
    severity: "CRITICAL",
    status: "EN_ROUTE",
    location: "Gate 2 Main Concourse, Sector 4",
    distanceKm: 1.4,
    etaMin: 3,
    reportedTime: "4 mins ago",
    callerName: "Sanjay Patil (Volunteer)",
    callerPhone: "+91 98230 44211",
    casualtiesCount: 1,
    triageNotes: "Patient 58yo male unresponsive. Bystander CPR initiated. Defibrillator requested on arrival.",
    recommendedHospital: "District Apex Trauma Centre (1.8 km)",
    provenance: "[LIVE]",
  },
  {
    id: "inc-02",
    refNumber: "IND-2026-9934",
    title: "Foot Overpass Crowd Bottleneck & Panic",
    category: "STAMPEDE_SURGE",
    severity: "HIGH",
    status: "ASSIGNED",
    location: "North Pedestrian Overpass Rail Interchange",
    distanceKm: 2.8,
    etaMin: 6,
    reportedTime: "9 mins ago",
    callerName: "Inspector R. Deshmukh",
    callerPhone: "+91 94222 10988",
    casualtiesCount: 4,
    triageNotes: "Minor lacerations and anxiety hyperventilation. Crowd flow diverted. Stretcher access available from Gate 3.",
    recommendedHospital: "Red Cross Emergency Field Hospital Alpha (1.2 km)",
    provenance: "[LIVE]",
  },
  {
    id: "inc-03",
    refNumber: "IND-2026-9890",
    title: "Severe Heatstroke & Syncope",
    category: "HEAT_EXHAUSTION",
    severity: "MEDIUM",
    status: "RESOLVED",
    location: "Pavilion 3 Pilgrim Waiting Area",
    distanceKm: 0.8,
    etaMin: 0,
    reportedTime: "35 mins ago",
    callerName: "Deepak Joshi",
    callerPhone: "+91 91580 88200",
    casualtiesCount: 1,
    triageNotes: "Patient stabilized with IV hydration salts and misting fans. Refused hospital transfer. Relatives accompanied.",
    recommendedHospital: "Community Health Outreach Post South",
    provenance: "[REPORTED]",
  },
];

export default function ResponderIncidentsPage() {
  const [incidents, setIncidents] = useState<ResponderIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<ResponderIncident | null>(INITIAL_INCIDENTS[0]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleUpdateStatus = (incidentId: string, nextStatus: IncidentStatus, message: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: nextStatus } : inc))
    );
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-surface-bg">
      {/* LEFT COLUMN: Incident Queue */}
      <div className="w-full md:w-96 lg:w-[420px] flex flex-col border-r border-paper-200 bg-white shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-paper-200 bg-paper-50 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display font-bold text-sm text-ink-900 tracking-wide uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-alert-600" /> Tactical Incident Queue
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-alert-100 text-alert-700 font-bold">
              {incidents.filter((i) => i.status !== "RESOLVED").length} PENDING
            </span>
          </div>
          <p className="text-[11px] text-ink-500">
            Real-time emergency tickets assigned to Unit <strong>ALS-01</strong>.
          </p>
        </div>

        {actionFeedback && (
          <div className="p-3 m-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-scale-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="p-3 space-y-2.5">
          {incidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`card-elevated p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary-500 ring-2 ring-primary-100 bg-primary-50/20 shadow-md"
                    : "border-paper-200 bg-white hover:border-paper-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={incident.severity} size="sm" />
                    <ProvenanceBadge provenance={incident.provenance} size="sm" />
                  </div>
                  <span className="text-[10px] font-mono text-ink-400">
                    {incident.reportedTime}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-ink-900 mb-1 leading-snug line-clamp-2">
                  {incident.title}
                </h3>

                <p className="text-xs text-ink-600 flex items-center gap-1.5 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </p>

                <div className="flex items-center justify-between pt-2.5 border-t border-paper-100 text-xs font-mono">
                  <span className="text-primary-700 font-bold">
                    ETA: ~{incident.etaMin}m ({incident.distanceKm} km)
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    incident.status === "EN_ROUTE"
                      ? "bg-sky-100 text-sky-800"
                      : incident.status === "ASSIGNED"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Full Incident Detail & Operational Actions */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {selectedIncident ? (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header Status Bar */}
            <div className="card-elevated p-5 rounded-2xl border border-paper-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-primary-700">
                    #{selectedIncident.refNumber}
                  </span>
                  <SeverityBadge severity={selectedIncident.severity} size="sm" />
                  <ProvenanceBadge provenance={selectedIncident.provenance} size="sm" />
                </div>
                <h2 className="text-xl font-display font-bold text-ink-900">
                  {selectedIncident.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/responder/map"
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Launch Live GPS</span>
                </Link>
                <a
                  href={`tel:${selectedIncident.callerPhone}`}
                  className="px-4 py-2.5 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-300 text-ink-800 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span>Call Caller</span>
                </a>
              </div>
            </div>

            {/* Quick Status Control Ribbon */}
            <div className="p-4 rounded-2xl bg-paper-100 border border-paper-200">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-500 block mb-2">
                Current Operational Lifecycle Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedIncident.id, "EN_ROUTE", "Unit ALS-01 status updated: EN ROUTE TO SCENE")
                  }
                  className={`h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    selectedIncident.status === "EN_ROUTE"
                      ? "bg-sky-600 text-white shadow-md font-bold"
                      : "bg-white border border-paper-300 text-ink-700 hover:bg-paper-50"
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" /> 1. En Route
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(selectedIncident.id, "ON_SCENE", "Unit ALS-01 status updated: ARRIVED ON SCENE")
                  }
                  className={`h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    selectedIncident.status === "ON_SCENE"
                      ? "bg-amber-600 text-white shadow-md font-bold"
                      : "bg-white border border-paper-300 text-ink-700 hover:bg-paper-50"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" /> 2. On Scene
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(selectedIncident.id, "TRANSPORTING", "Unit ALS-01 status updated: TRANSPORTING PATIENT TO HOSPITAL")
                  }
                  className={`h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    selectedIncident.status === "TRANSPORTING"
                      ? "bg-purple-600 text-white shadow-md font-bold"
                      : "bg-white border border-paper-300 text-ink-700 hover:bg-paper-50"
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" /> 3. Transport
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(selectedIncident.id, "RESOLVED", "Incident marked RESOLVED. Telemetry logged to Audit Trail.")
                  }
                  className={`h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    selectedIncident.status === "RESOLVED"
                      ? "bg-emerald-600 text-white shadow-md font-bold"
                      : "bg-white border border-paper-300 text-ink-700 hover:bg-paper-50"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4. Resolved
                </button>
              </div>
            </div>

            {/* Incident Medical & Triage Intelligence */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card-elevated p-5 rounded-2xl border border-paper-200 bg-white">
                <h3 className="font-display font-bold text-sm text-ink-900 mb-3 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-alert-600" /> Triage & Vital Signs
                </h3>
                <div className="p-3.5 rounded-xl bg-alert-50/40 border border-alert-100 text-xs text-ink-800 leading-relaxed mb-4">
                  {selectedIncident.triageNotes}
                </div>
                <div className="flex justify-between items-center text-xs text-ink-600">
                  <span>Casualties Count:</span>
                  <span className="font-bold text-ink-900">{selectedIncident.casualtiesCount} person(s)</span>
                </div>
              </div>

              <div className="card-elevated p-5 rounded-2xl border border-paper-200 bg-white">
                <h3 className="font-display font-bold text-sm text-ink-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" /> Caller & Reporter Info
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-paper-100">
                    <span className="text-ink-500">Name:</span>
                    <span className="font-bold text-ink-900">{selectedIncident.callerName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-paper-100">
                    <span className="text-ink-500">Phone:</span>
                    <a href={`tel:${selectedIncident.callerPhone}`} className="font-mono font-bold text-primary-700 hover:underline">
                      {selectedIncident.callerPhone}
                    </a>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-500">Assigned Facility:</span>
                    <span className="font-bold text-ink-900">{selectedIncident.recommendedHospital}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-ink-400 text-xs">
            Select an incident from the queue to view full tactical triage details.
          </div>
        )}
      </div>
    </div>
  );
}
