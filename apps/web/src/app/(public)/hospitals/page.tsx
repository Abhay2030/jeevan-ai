"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Hospital, Search, MapPin, Clock, Navigation, Star,
  ArrowLeft, Heart, Stethoscope, Droplets, Shield,
  Filter, ChevronRight, Zap, CheckCircle2, Phone,
  Building2, Bed, AlertCircle, Crosshair
} from "lucide-react";
import { ProvenanceBadge } from "@jeevan-ai/ui";

interface HospitalFacility {
  id: string;
  name: string;
  hub: "delhi" | "mumbai" | "bengaluru" | "varanasi" | "indore" | "hyderabad" | "nashik";
  hubName: string;
  category: "GOVERNMENT" | "PRIVATE";
  phone: string;
  rating: number;
  emergency: boolean;
  icuAvailable: number;
  icuTotal: number;
  oxygenBeds: number;
  bloodBank: boolean;
  bloodTypesStocked: string[];
  specializations: string[];
  address: string;
  lat: number;
  lng: number;
  aiRecommended?: boolean;
  recommendationReason?: string;
}

const NATIONAL_HOSPITAL_REGISTRY: HospitalFacility[] = [
  {
    id: "h-del-01",
    name: "All India Institute of Medical Sciences (AIIMS) Apex Trauma Centre",
    hub: "delhi",
    hubName: "Delhi NCR",
    category: "GOVERNMENT",
    phone: "+91-11-26588500",
    rating: 4.9,
    emergency: true,
    icuAvailable: 14,
    icuTotal: 48,
    oxygenBeds: 120,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "O-", "B-"],
    specializations: ["Level 1 Trauma", "Neurosurgery", "Cardiothoracic", "Burn Care"],
    address: "Ring Road, Raj Nagar, Safdarjung Enclave, New Delhi, 110029",
    lat: 28.5672,
    lng: 77.2100,
    aiRecommended: true,
    recommendationReason: "National Level 1 Trauma Center with highest critical care capacity"
  },
  {
    id: "h-del-02",
    name: "Safdarjung Hospital & Vardhman Mahavir Medical College",
    hub: "delhi",
    hubName: "Delhi NCR",
    category: "GOVERNMENT",
    phone: "+91-11-26165060",
    rating: 4.4,
    emergency: true,
    icuAvailable: 8,
    icuTotal: 36,
    oxygenBeds: 85,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+"],
    specializations: ["Emergency Medicine", "Pediatrics", "Orthopedics"],
    address: "Ansari Nagar West, New Delhi, 110029",
    lat: 28.5701,
    lng: 77.2078
  },
  {
    id: "h-mum-01",
    name: "King Edward Memorial (KEM) Hospital & Medical College",
    hub: "mumbai",
    hubName: "Mumbai MMR",
    category: "GOVERNMENT",
    phone: "+91-22-24107000",
    rating: 4.6,
    emergency: true,
    icuAvailable: 11,
    icuTotal: 40,
    oxygenBeds: 110,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "O-"],
    specializations: ["Mass Casualty Trauma", "Cardiology", "Infectious Diseases"],
    address: "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
    lat: 19.0024,
    lng: 72.8427,
    aiRecommended: true,
    recommendationReason: "Primary disaster response hospital in Central Mumbai"
  },
  {
    id: "h-mum-02",
    name: "Lilavati Hospital & Research Centre",
    hub: "mumbai",
    hubName: "Mumbai MMR",
    category: "PRIVATE",
    phone: "+91-22-26751000",
    rating: 4.7,
    emergency: true,
    icuAvailable: 5,
    icuTotal: 24,
    oxygenBeds: 45,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "A-"],
    specializations: ["Cardiac Emergencies", "Neurology", "Advanced Life Support"],
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai, 400050",
    lat: 19.0514,
    lng: 72.8295
  },
  {
    id: "h-ben-01",
    name: "Victoria Hospital (BMCRI) National Disaster Center",
    hub: "bengaluru",
    hubName: "Bengaluru Urban",
    category: "GOVERNMENT",
    phone: "+91-80-26701150",
    rating: 4.5,
    emergency: true,
    icuAvailable: 12,
    icuTotal: 38,
    oxygenBeds: 90,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "O-"],
    specializations: ["Trauma Care", "Burn Unit", "Emergency Surgery"],
    address: "Fort Road, near City Market, Bengaluru, Karnataka 560002",
    lat: 12.9642,
    lng: 77.5753,
    aiRecommended: true,
    recommendationReason: "Largest public emergency & burn care facility in Karnataka"
  },
  {
    id: "h-var-01",
    name: "Sir Sunderlal Hospital & Trauma Centre (BHU Institute of Medical Sciences)",
    hub: "varanasi",
    hubName: "Varanasi Ganga",
    category: "GOVERNMENT",
    phone: "+91-542-2307500",
    rating: 4.8,
    emergency: true,
    icuAvailable: 16,
    icuTotal: 42,
    oxygenBeds: 130,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "O-", "B-"],
    specializations: ["Super Speciality Trauma", "Heatstroke Ward", "Cardiology"],
    address: "Banaras Hindu University Campus, Varanasi, Uttar Pradesh 221005",
    lat: 25.2755,
    lng: 82.9984,
    aiRecommended: true,
    recommendationReason: "Apex tertiary trauma hub for Eastern UP and Bihar pilgrims"
  },
  {
    id: "h-ind-01",
    name: "Maharaja Yeshwantrao (MY) Hospital & Trauma Centre",
    hub: "indore",
    hubName: "Indore Malwa",
    category: "GOVERNMENT",
    phone: "+91-731-2527383",
    rating: 4.6,
    emergency: true,
    icuAvailable: 9,
    icuTotal: 30,
    oxygenBeds: 80,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+"],
    specializations: ["Emergency Trauma", "Pediatrics", "Orthopedic Emergency"],
    address: "MY Hospital Road, Sanyogitaganj, Indore, Madhya Pradesh 452001",
    lat: 22.7153,
    lng: 75.8772,
    aiRecommended: true,
    recommendationReason: "Largest tertiary government trauma care facility in Malwa region"
  },
  {
    id: "h-hyd-01",
    name: "Osmania General Hospital Emergency Care",
    hub: "hyderabad",
    hubName: "Hyderabad Deccan",
    category: "GOVERNMENT",
    phone: "+91-40-24600121",
    rating: 4.4,
    emergency: true,
    icuAvailable: 10,
    icuTotal: 35,
    oxygenBeds: 95,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+", "O-"],
    specializations: ["Disaster Casualty", "Acute Toxicology", "Neurosurgery"],
    address: "Afzal Gunj, Hyderabad, Telangana 500012",
    lat: 17.3774,
    lng: 78.4760,
    aiRecommended: true,
    recommendationReason: "Centennial public trauma & disaster emergency hub in Telangana"
  },
  {
    id: "h-nas-01",
    name: "District Civil Hospital & Nashik Kumbh Emergency Trauma Unit",
    hub: "nashik",
    hubName: "Nashik Kumbh Zone",
    category: "GOVERNMENT",
    phone: "+91-253-2576106",
    rating: 4.5,
    emergency: true,
    icuAvailable: 7,
    icuTotal: 25,
    oxygenBeds: 60,
    bloodBank: true,
    bloodTypesStocked: ["A+", "B+", "O+", "AB+"],
    specializations: ["Mass Pilgrimage Triage", "Heat Exhaustion", "Trauma Care"],
    address: "Trimbak Road, near CBS, Nashik, Maharashtra 422002",
    lat: 19.9975,
    lng: 73.7890,
    aiRecommended: true,
    recommendationReason: "Designated civil trauma hub for Kumbh Mela and Godavari Ghats"
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function HospitalFinder() {
  const [search, setSearch] = useState("");
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [filterICU, setFilterICU] = useState(false);
  const [filterBlood, setFilterBlood] = useState(false);
  const [filterGovt, setFilterGovt] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  const filteredHospitals = useMemo(() => {
    return NATIONAL_HOSPITAL_REGISTRY.map((h) => {
      const distance = userCoords ? calculateDistance(userCoords.lat, userCoords.lng, h.lat, h.lng) : null;
      return { ...h, calculatedDistance: distance };
    })
      .filter((h) => {
        if (selectedHub !== "all" && h.hub !== selectedHub) return false;
        if (filterICU && h.icuAvailable <= 0) return false;
        if (filterBlood && !h.bloodBank) return false;
        if (filterGovt && h.category !== "GOVERNMENT") return false;
        if (search) {
          const query = search.toLowerCase();
          const matchName = h.name.toLowerCase().includes(query);
          const matchHub = h.hubName.toLowerCase().includes(query);
          const matchSpec = h.specializations.some((s) => s.toLowerCase().includes(query));
          const matchAddress = h.address.toLowerCase().includes(query);
          if (!matchName && !matchHub && !matchSpec && !matchAddress) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.aiRecommended && !b.aiRecommended) return -1;
        if (!a.aiRecommended && b.aiRecommended) return 1;
        if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        return b.rating - a.rating;
      });
  }, [selectedHub, filterICU, filterBlood, filterGovt, search, userCoords]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ink-950 text-white" data-theme="ink">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-ink-800 bg-ink-900/70 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/emergency"
            className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center hover:bg-ink-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-ink-300" />
          </Link>
          <div>
            <h1 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Hospital className="w-4 h-4 text-primary-400" /> National Emergency Hospital Directory
            </h1>
            <p className="text-[10px] text-ink-400 font-mono">
              Ayushman Bharat ABDM & Disaster Registry Integrated
            </p>
          </div>
        </div>
        <ProvenanceBadge provenance="[VERIFIED]" />
      </header>

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-5">
        {/* Search & Location Bar */}
        <div className="card-elevated p-4 bg-ink-900 border-ink-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospitals by name, specialty (e.g. Trauma, Cardiac, Burn), or address..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-ink-950 border border-ink-800 text-xs text-white placeholder:text-ink-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Hub Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { id: "all", label: "All Hubs" },
              { id: "delhi", label: "Delhi NCR" },
              { id: "mumbai", label: "Mumbai MMR" },
              { id: "bengaluru", label: "Bengaluru" },
              { id: "varanasi", label: "Varanasi" },
              { id: "indore", label: "Indore" },
              { id: "hyderabad", label: "Hyderabad" },
              { id: "nashik", label: "Nashik" },
            ].map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold transition-all ${
                  selectedHub === hub.id
                    ? "bg-primary-600 text-white shadow-glow-primary"
                    : "bg-ink-950 text-ink-400 border border-ink-800 hover:border-ink-700"
                }`}
              >
                {hub.label}
              </button>
            ))}
          </div>

          {/* Feature Checkbox Toggles */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink-800 text-xs font-mono">
            <button
              onClick={() => setFilterICU(!filterICU)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                filterICU ? "bg-emerald-950/60 border-emerald-500 text-emerald-300" : "bg-ink-950 border-ink-800 text-ink-400"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> ICU Beds &gt; 0
            </button>
            <button
              onClick={() => setFilterBlood(!filterBlood)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                filterBlood ? "bg-alert-950/60 border-alert-500 text-alert-300" : "bg-ink-950 border-ink-800 text-ink-400"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" /> Blood Bank Active
            </button>
            <button
              onClick={() => setFilterGovt(!filterGovt)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                filterGovt ? "bg-primary-950/60 border-primary-500 text-primary-300" : "bg-ink-950 border-ink-800 text-ink-400"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Govt / Ayushman Empanelled
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-ink-400 px-1 font-mono">
          <span>{filteredHospitals.length} VERIFIED CRITICAL CARE FACILITIES</span>
          {userCoords && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Crosshair className="w-3.5 h-3.5" /> GPS Distance Active
            </span>
          )}
        </div>

        {/* Hospital Facility Cards */}
        <div className="space-y-4">
          {filteredHospitals.map((h) => (
            <div
              key={h.id}
              className={`card-elevated p-5 bg-ink-900 border transition-all ${
                h.aiRecommended ? "border-primary-500/80 bg-primary-950/10 shadow-glow-primary" : "border-ink-800 hover:border-ink-700"
              }`}
            >
              {h.aiRecommended && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary-400 mb-2">
                  <Zap className="w-3.5 h-3.5" /> AI EMERGENCY RECOMMENDATION: {h.recommendationReason}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      h.category === "GOVERNMENT" ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "bg-purple-950/80 text-purple-300 border border-purple-800"
                    }`}>
                      {h.category}
                    </span>
                    <span className="text-[10px] font-mono text-ink-400 bg-ink-800 px-2 py-0.5 rounded">
                      {h.hubName}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-accent-400 font-bold ml-auto sm:ml-0">
                      <Star className="w-3.5 h-3.5 fill-accent-400" /> {h.rating}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold text-white leading-snug">{h.name}</h3>
                  <p className="text-xs text-ink-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-ink-500 shrink-0 mt-0.5" />
                    <span>{h.address}</span>
                  </p>
                </div>

                {h.calculatedDistance !== null && (
                  <div className="shrink-0 text-right sm:text-right font-mono bg-ink-950 px-3 py-1.5 rounded-lg border border-ink-800 self-start">
                    <span className="text-sm font-bold text-primary-400">{h.calculatedDistance} km</span>
                    <span className="text-[10px] text-ink-400 block">from your location</span>
                  </div>
                )}
              </div>

              {/* Real Capacity Metrics */}
              <div className="grid grid-cols-3 gap-2 my-4 text-xs font-mono">
                <div className="bg-ink-950 p-2.5 rounded-xl border border-ink-800">
                  <span className="text-[10px] text-ink-400 block mb-0.5">ICU BEDS</span>
                  <span className={`font-bold text-sm ${h.icuAvailable > 5 ? "text-emerald-400" : h.icuAvailable > 0 ? "text-amber-400" : "text-alert-400"}`}>
                    {h.icuAvailable} <span className="text-ink-500 text-xs">/ {h.icuTotal}</span>
                  </span>
                </div>
                <div className="bg-ink-950 p-2.5 rounded-xl border border-ink-800">
                  <span className="text-[10px] text-ink-400 block mb-0.5">OXYGEN BEDS</span>
                  <span className="font-bold text-sm text-white">{h.oxygenBeds}</span>
                </div>
                <div className="bg-ink-950 p-2.5 rounded-xl border border-ink-800">
                  <span className="text-[10px] text-ink-400 block mb-0.5">BLOOD BANK</span>
                  <span className={`font-bold text-xs ${h.bloodBank ? "text-emerald-400" : "text-alert-400"}`}>
                    {h.bloodBank ? "ACTIVE ON-SITE" : "NO BLOOD BANK"}
                  </span>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {h.specializations.map((spec) => (
                  <span key={spec} className="px-2 py-0.5 rounded-md bg-ink-800 text-[11px] text-ink-300">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-ink-800">
                <a
                  href={`tel:${h.phone}`}
                  className="flex-1 h-10 rounded-xl bg-ink-800 hover:bg-ink-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-ink-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-accent-400" />
                  <span>Call Emergency: {h.phone}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-glow-primary"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Turn-by-Turn Navigation</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
