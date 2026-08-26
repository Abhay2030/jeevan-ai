"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Droplets, MapPin, Clock, Phone, User, ChevronRight, Heart, AlertTriangle, CheckCircle2, Search } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface Donor { id: string; name: string; group: string; distance: string; lastDonated: string; verified: boolean; }
const mockDonors: Donor[] = [
  { id: "1", name: "Rajesh Sharma", group: "O+", distance: "1.2 km", lastDonated: "3 months ago", verified: true },
  { id: "2", name: "Priya Patel", group: "O+", distance: "2.8 km", lastDonated: "6 months ago", verified: true },
  { id: "3", name: "Arun Kumar", group: "O+", distance: "3.5 km", lastDonated: "4 months ago", verified: false },
  { id: "4", name: "Meena Singh", group: "O-", distance: "4.1 km", lastDonated: "5 months ago", verified: true },
];

interface BloodRequest { group: string; hospital: string; urgency: string; distance: string; timeLeft: string; }
const mockRequests: BloodRequest[] = [
  { group: "O+", hospital: "MYH Ujjain", urgency: "CRITICAL", distance: "2.4 km", timeLeft: "45 min" },
  { group: "AB-", hospital: "District Hospital", urgency: "URGENT", distance: "3.1 km", timeLeft: "2 hrs" },
  { group: "B+", hospital: "CHL Hospital", urgency: "NEEDED", distance: "4.8 km", timeLeft: "6 hrs" },
];

export default function BloodNetwork() {
  const [tab, setTab] = useState<"request" | "donate">("request");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0=select group, 1=results

  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
      <header className="glass sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/emergency" className="w-9 h-9 rounded-xl bg-paper-200 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-ink-500" />
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold text-ink-900">Blood Network</h1>
            <p className="text-xs text-ink-300">Find donors & urgent requests</p>
          </div>
        </div>
        <div className="flex bg-paper-200 rounded-xl p-1 gap-1">
          <button onClick={() => setTab("request")} className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${tab === "request" ? "bg-white shadow-sm text-alert-600" : "text-ink-400"}`}>
            <Droplets className="w-4 h-4 inline mr-1" /> Urgent Requests
          </button>
          <button onClick={() => setTab("donate")} className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all ${tab === "donate" ? "bg-white shadow-sm text-primary-600" : "text-ink-400"}`}>
            <Heart className="w-4 h-4 inline mr-1" /> Find Donors
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {tab === "request" ? (
          <div className="space-y-4">
            {mockRequests.map((r, i) => (
              <div key={i} className={`card-elevated p-5 ${r.urgency === "CRITICAL" ? "ring-2 ring-alert-300 bg-alert-50/30" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-11 h-11 rounded-xl bg-alert-600 text-white flex items-center justify-center font-display font-bold text-sm shadow-md">{r.group}</span>
                    <div>
                      <h3 className="font-display font-bold text-ink-900 text-sm">{r.hospital}</h3>
                      <p className="text-xs text-ink-300 flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.distance}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${r.urgency === "CRITICAL" ? "bg-alert-100 text-alert-700" : r.urgency === "URGENT" ? "bg-accent-100 text-accent-700" : "bg-primary-100 text-primary-700"}`}>
                    {r.urgency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-ink-300"><Clock className="w-3.5 h-3.5 text-alert-500" /> Needed in {r.timeLeft}</span>
                  <button className="h-9 px-5 rounded-xl bg-alert-600 text-white text-sm font-semibold hover:bg-alert-700 transition-colors flex items-center gap-1">
                    <Heart className="w-4 h-4" /> Donate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : step === 0 ? (
          <div>
            <p className="text-sm text-ink-300 mb-4">Select the blood group you need:</p>
            <div className="grid grid-cols-4 gap-3">
              {bloodGroups.map(g => (
                <button
                  key={g}
                  onClick={() => { setSelectedGroup(g); setStep(1); }}
                  className={`h-16 rounded-xl font-display font-bold text-lg flex items-center justify-center transition-all card-elevated hover:ring-2 hover:ring-primary-400 ${selectedGroup === g ? "bg-primary-600 text-white ring-2 ring-primary-400" : "text-ink-900"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-primary-600 font-semibold mb-4">
              <ArrowLeft className="w-4 h-4" /> Change Blood Group
            </button>
            <p className="text-xs text-ink-300 mb-4">{mockDonors.length} donors found for <span className="font-bold text-alert-600">{selectedGroup}</span></p>
            <div className="space-y-3">
              {mockDonors.map(d => (
                <div key={d.id} className="card-elevated p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-ink-900 text-sm">{d.name}</h3>
                      {d.verified && <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />}
                    </div>
                    <p className="text-xs text-ink-300">{d.distance} • Last donated {d.lastDonated}</p>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
