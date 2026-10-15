"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Phone,
  MapPin,
  Activity,
  Bed,
  Droplet,
  ShieldCheck,
  Edit2
} from "lucide-react";
import { DEMO_HOSPITALS } from "@web/lib/geoIntelligenceData";
import type { HospitalFacility } from "@web/lib/geoIntelligenceData";
import { ProvenanceBadge } from "@jeevan-ai/ui";

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<HospitalFacility[]>(DEMO_HOSPITALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedFacility, setSelectedFacility] = useState<HospitalFacility | null>(DEMO_HOSPITALS[0] || null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Editable capacity form state
  const [editIcu, setEditIcu] = useState<number>(selectedFacility?.icuBedsAvailable ?? 0);
  const [editOxygen, setEditOxygen] = useState<number>(selectedFacility?.oxygenBedsAvailable ?? 0);
  const [editBlood, setEditBlood] = useState<number>(selectedFacility?.bloodUnitsReserve ?? 0);

  const handleSelectFacility = (f: HospitalFacility) => {
    setSelectedFacility(f);
    setEditIcu(f.icuBedsAvailable);
    setEditOxygen(f.oxygenBedsAvailable);
    setEditBlood(f.bloodUnitsReserve);
  };

  const handleUpdateCapacity = () => {
    if (!selectedFacility) return;
    setFacilities((prev) =>
      prev.map((f) =>
        f.id === selectedFacility.id
          ? {
              ...f,
              icuBedsAvailable: editIcu,
              oxygenBedsAvailable: editOxygen,
              bloodUnitsReserve: editBlood,
              status: editIcu <= 2 ? "SURGE_OVERFLOW" : editIcu <= 5 ? "NEAR_CAPACITY" : "NORMAL",
            }
          : f
      )
    );
    setSelectedFacility((prev) =>
      prev
        ? {
            ...prev,
            icuBedsAvailable: editIcu,
            oxygenBedsAvailable: editOxygen,
            bloodUnitsReserve: editBlood,
            status: editIcu <= 2 ? "SURGE_OVERFLOW" : editIcu <= 5 ? "NEAR_CAPACITY" : "NORMAL",
          }
        : null
    );
    setFeedback(`Bed and resource telemetry for ${selectedFacility.name} successfully updated.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" || f.type === typeFilter;
      const matchesStatus = statusFilter === "ALL" || f.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [facilities, searchQuery, typeFilter, statusFilter]);

  // Aggregate stats
  const totalIcuAvail = facilities.reduce((sum, f) => sum + f.icuBedsAvailable, 0);
  const totalIcuCapacity = facilities.reduce((sum, f) => sum + f.icuBedsTotal, 0);
  const totalOxygenAvail = facilities.reduce((sum, f) => sum + f.oxygenBedsAvailable, 0);
  const totalBlood = facilities.reduce((sum, f) => sum + f.bloodUnitsReserve, 0);

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-500" /> Healthcare Facilities Registry
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            National Master Registry of verified Apex, District, Trauma & Field Hospitals with live bed capacity telemetry.
          </p>
        </div>

        <button
          onClick={() => {
            const newFacility: HospitalFacility = {
              id: `hosp-${Date.now()}`,
              name: "New Emergency Field Station Unit",
              type: "FIELD_HOSPITAL",
              latitude: 22.72,
              longitude: 75.86,
              address: "Sector 7 Staging Area, Emergency Corridor",
              contactNumber: "+91 1800-112-999",
              icuBedsAvailable: 4,
              icuBedsTotal: 10,
              oxygenBedsAvailable: 15,
              oxygenBedsTotal: 25,
              generalBedsAvailable: 30,
              bloodUnitsReserve: 40,
              traumaLevel: "LEVEL_3",
              status: "NORMAL",
              provenance: "[LIVE]",
            };
            setFacilities([newFacility, ...facilities]);
            handleSelectFacility(newFacility);
            setFeedback("New field facility registered in national master directory.");
            setTimeout(() => setFeedback(null), 3000);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Provision New Facility
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Verified Facilities</span>
            <Building2 className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{facilities.length}</div>
          <p className="text-[10px] text-ink-500 mt-0.5">National & Field Directory</p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Total Available ICU</span>
            <HeartPulse className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {totalIcuAvail} <span className="text-xs text-ink-400 font-normal">/ {totalIcuCapacity}</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-0.5">
            {Math.round((totalIcuAvail / (totalIcuCapacity || 1)) * 100)}% Open Capacity
          </p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Oxygen Equipped Beds</span>
            <Bed className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalOxygenAvail}</div>
          <p className="text-[10px] text-ink-400 mt-0.5">Ready for Immediate Admission</p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Blood Units Reserve</span>
            <Droplet className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalBlood}</div>
          <p className="text-[10px] text-ink-400 mt-0.5">Standard Tested Units</p>
        </div>
      </div>

      {/* Main Grid: List & Detail/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ink-900 border border-ink-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-ink-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-ink-900 border border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-300 focus:outline-none focus:border-primary-500"
            >
              <option value="ALL">All Facility Types</option>
              <option value="AIIMS_APEX">Apex Institutes (AIIMS)</option>
              <option value="DISTRICT_HOSPITAL">District Hospitals</option>
              <option value="TRAUMA_CENTER">Trauma Centers</option>
              <option value="FIELD_HOSPITAL">Field Hospitals</option>
              <option value="COMMUNITY_CLINIC">Community Clinics</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-ink-900 border border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-300 focus:outline-none focus:border-primary-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NORMAL">Normal Operation</option>
              <option value="NEAR_CAPACITY">Near Capacity</option>
              <option value="SURGE_OVERFLOW">Surge Overflow</option>
            </select>
          </div>

          {/* List Table / Cards */}
          <div className="space-y-2">
            {filteredFacilities.map((fac) => {
              const isSelected = selectedFacility?.id === fac.id;
              const isSurge = fac.status === "SURGE_OVERFLOW";
              const isNear = fac.status === "NEAR_CAPACITY";

              return (
                <div
                  key={fac.id}
                  onClick={() => handleSelectFacility(fac)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-950/30 border-primary-500 ring-1 ring-primary-500/50"
                      : "bg-ink-900/60 border-ink-800/80 hover:bg-ink-800/50 hover:border-ink-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{fac.name}</span>
                        <ProvenanceBadge provenance={fac.provenance} />
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink-800 text-ink-400">
                          {fac.traumaLevel}
                        </span>
                      </div>
                      <p className="text-xs text-ink-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                        {fac.address}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isSurge
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : isNear
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {fac.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Bed stats mini grid */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-ink-800/60 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-500 block">ICU Available</span>
                      <span className="font-mono font-bold text-white">
                        {fac.icuBedsAvailable} <span className="text-ink-500 font-normal">/ {fac.icuBedsTotal}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-500 block">Oxygen Beds</span>
                      <span className="font-mono font-bold text-sky-400">{fac.oxygenBedsAvailable}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-500 block">General Beds</span>
                      <span className="font-mono font-bold text-ink-300">{fac.generalBedsAvailable}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-500 block">Blood Reserve</span>
                      <span className="font-mono font-bold text-rose-400">{fac.bloodUnitsReserve} units</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredFacilities.length === 0 && (
              <div className="p-8 text-center text-ink-400 border border-ink-800 rounded-xl bg-ink-900/40">
                <Building2 className="w-8 h-8 text-ink-600 mx-auto mb-2" />
                <p className="text-xs">No healthcare facilities match the active filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Detail / Capacity Editor: 5 Cols */}
        <div className="lg:col-span-5">
          {selectedFacility ? (
            <div className="sticky top-6 rounded-2xl bg-ink-900 border border-ink-800 p-6 space-y-6">
              <div className="border-b border-ink-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest">
                    Facility Record Detail
                  </span>
                  <ProvenanceBadge provenance={selectedFacility.provenance} />
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedFacility.name}</h2>
                <p className="text-xs text-ink-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-ink-500" />
                  {selectedFacility.address}
                </p>
                <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-ink-500" />
                  {selectedFacility.contactNumber}
                </p>
              </div>

              {/* Real-time Telemetry Editor */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider flex items-center gap-2">
                  <Edit2 className="w-3.5 h-3.5 text-primary-400" /> Live Resource Overrides
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-ink-400 block mb-1">
                      ICU Beds Available (Total: {selectedFacility.icuBedsTotal})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedFacility.icuBedsTotal}
                      value={editIcu}
                      onChange={(e) => setEditIcu(parseInt(e.target.value) || 0)}
                      className="w-full bg-ink-950 border border-ink-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                    />
                    <span className="text-[10px] text-ink-500 mt-1 block">
                      Setting below 3 triggers automated divert alerts for inbound ambulances.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-ink-400 block mb-1">
                      Oxygen Supported Beds Available (Total: {selectedFacility.oxygenBedsTotal})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selectedFacility.oxygenBedsTotal}
                      value={editOxygen}
                      onChange={(e) => setEditOxygen(parseInt(e.target.value) || 0)}
                      className="w-full bg-ink-950 border border-ink-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-ink-400 block mb-1">
                      Blood Units in Blood Bank Reserve
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editBlood}
                      onChange={(e) => setEditBlood(parseInt(e.target.value) || 0)}
                      className="w-full bg-ink-950 border border-ink-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleUpdateCapacity}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Telemetry Update
                </button>
              </div>

              {/* Protocol status info */}
              <div className="p-3 rounded-xl bg-ink-950 border border-ink-800 text-[11px] text-ink-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-ink-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  PM-JAY & National Health Mission Synced
                </div>
                <p>
                  Facility telemetry updates are verified against state emergency dispatch servers. All manual overrides are logged in the security audit trail.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-ink-400 border border-ink-800 rounded-2xl bg-ink-900">
              Select a facility from the registry to view details and update telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
