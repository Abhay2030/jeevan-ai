"use client";

import React, { useState } from "react";
import {
  Layers,
  MapPin,
  AlertTriangle,
  Users,
  Shield,
  Plus,
  Edit2,
  CheckCircle2,
  Filter
} from "lucide-react";
import { DEMO_OPERATIONAL_ZONES } from "@web/lib/geoIntelligenceData";
import type { OperationalZone } from "@web/lib/geoIntelligenceData";

export default function AdminZonesPage() {
  const [zones, setZones] = useState<OperationalZone[]>(DEMO_OPERATIONAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<OperationalZone | null>(DEMO_OPERATIONAL_ZONES[0]);
  const [editingCapacity, setEditingCapacity] = useState<number>(DEMO_OPERATIONAL_ZONES[0].crowdDensitySqM);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdateZone = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, crowdDensitySqM: editingCapacity } : z))
    );
    setFeedback(`Operational parameters for ${selectedZone?.name} updated successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary-500" /> Operational Zones & Geofencing
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Configure dynamic gathering perimeters, crowd surge danger thresholds, and automated ambulance corridor alignments.
          </p>
        </div>

        <button
          onClick={() => {
            const newZone: OperationalZone = {
              id: `zone-${Date.now()}`,
              name: "Eastern Concourse Extension Sector 5",
              code: "SEC-EST-05",
              riskScore: 35,
              tier: "MONITORED_YELLOW",
              crowdDensitySqM: 1.8,
              latitude: 22.723,
              longitude: 75.87,
              incidentCount: 0,
              description: "Newly provisioned peripheral crowd staging and temporary hospital zone.",
            };
            setZones([...zones, newZone]);
            setSelectedZone(newZone);
            setFeedback("New geofenced operational zone created.");
            setTimeout(() => setFeedback(null), 3000);
          }}
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Zone</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid: Zones List & Configuration Panel */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Zones Table */}
        <div className="lg:col-span-7 card-elevated rounded-2xl border border-ink-800 bg-ink-950 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-ink-800 bg-ink-900/40 flex items-center justify-between">
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Active Geofenced Sectors ({zones.length})
            </h2>
            <span className="text-[10px] font-mono text-ink-400">SRID: EPSG:4326 (WGS84)</span>
          </div>

          <div className="divide-y divide-ink-900">
            {zones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    setEditingCapacity(zone.crowdDensitySqM);
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary-950/40 border-l-4 border-primary-500 text-white"
                      : "hover:bg-ink-900/40 text-ink-300"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ink-800 text-ink-300">
                        {zone.code}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        zone.tier === "CRITICAL_RED"
                          ? "bg-alert-950 text-alert-400 border border-alert-800"
                          : zone.tier === "ELEVATED_ORANGE"
                          ? "bg-orange-950 text-orange-400 border border-orange-800"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      }`}>
                        {zone.tier.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white truncate">{zone.name}</h3>
                    <p className="text-[11px] text-ink-400 line-clamp-1 mt-0.5">{zone.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-display font-bold text-white block">
                      {zone.crowdDensitySqM} <span className="text-[10px] font-normal text-ink-400">pax/m²</span>
                    </span>
                    <span className="text-[10px] font-mono text-ink-400">
                      Risk Index: <strong className={zone.riskScore > 75 ? "text-alert-400" : "text-emerald-400"}>{zone.riskScore}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Zone Geofencing & Capacity Tuning */}
        <div className="lg:col-span-5">
          {selectedZone ? (
            <div className="card-elevated p-6 rounded-2xl border border-ink-800 bg-ink-950 shadow-xl space-y-5">
              <div className="border-b border-ink-800 pb-3">
                <span className="text-[10px] font-mono text-primary-400 uppercase font-bold block mb-1">
                  ZONE PARAMETER INSPECTOR
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-ink-400 font-mono mt-0.5">
                  Centroid: {selectedZone.latitude.toFixed(4)}° N, {selectedZone.longitude.toFixed(4)}° E
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-ink-300 block mb-1.5 uppercase tracking-wide">
                    Max Safe Crowd Density Threshold (Persons/m²)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={editingCapacity}
                      onChange={(e) => setEditingCapacity(parseFloat(e.target.value))}
                      className="flex-1 accent-primary-500"
                    />
                    <span className="text-sm font-mono font-bold text-primary-400 w-12 text-right">
                      {editingCapacity}
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-500 mt-1">
                    Exceeding 4.0 persons/m² automatically flags the sector for ingress gate throttling.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
                  <div className="flex justify-between text-ink-400">
                    <span>Active Incident Count:</span>
                    <strong className="text-white">{selectedZone.incidentCount} active</strong>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>Assigned Quick Response Team:</span>
                    <strong className="text-white">QRT Unit Alpha-4</strong>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>Automated Green Corridor Link:</span>
                    <strong className="text-emerald-400">District Apex Line</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateZone(selectedZone.id)}
                  className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Save Zone Geofence Thresholds
                </button>
              </div>
            </div>
          ) : (
            <div className="text-ink-400 text-xs text-center p-8">
              Select a zone from the registry to view and adjust operational parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
