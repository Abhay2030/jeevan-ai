"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, MapPin, Battery, Clock, Shield, CheckCircle2, AlertTriangle, Phone, Plus, Bell } from "lucide-react";

interface FamilyMember { name: string; status: "safe" | "emergency" | "offline"; location: string; battery: number; lastSeen: string; avatar: string; }

const family: FamilyMember[] = [
  { name: "Papa", status: "safe", location: "Home — Panchavati, Nashik", battery: 78, lastSeen: "2 min ago", avatar: "👨" },
  { name: "Mummy", status: "safe", location: "Ramkund Ghat Area", battery: 45, lastSeen: "5 min ago", avatar: "👩" },
  { name: "Dadi", status: "offline", location: "Last: Home — Panchavati", battery: 12, lastSeen: "35 min ago", avatar: "👵" },
  { name: "Bhai", status: "safe", location: "Trimbakeshwar Temple", battery: 92, lastSeen: "Just now", avatar: "👦" },
];

const timeline = [
  { time: "10:15 AM", text: "Mummy arrived at Ramkund Ghat Area", type: "info" },
  { time: "10:02 AM", text: "Dadi's phone went offline (low battery)", type: "warning" },
  { time: "09:45 AM", text: "Bhai checked in at Trimbakeshwar Temple", type: "info" },
  { time: "09:30 AM", text: "All family members marked safe", type: "success" },
];

export default function FamilySafety() {
  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
      <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
        <Link href="/emergency" className="w-9 h-9 rounded-xl bg-paper-200 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-ink-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-display font-bold text-ink-900">Family Safety</h1>
          <p className="text-xs text-ink-300">{family.filter(m => m.status === "safe").length}/{family.length} members safe</p>
        </div>
        <button className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Alert for offline member */}
        <div className="card-elevated p-4 mb-6 flex items-center gap-3 bg-accent-50 border-accent-200">
          <AlertTriangle className="w-5 h-5 text-accent-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-accent-800">Dadi is offline</p>
            <p className="text-xs text-accent-600">Last seen 35 min ago • Low battery</p>
          </div>
          <a href="tel:+919999999999" className="w-9 h-9 rounded-xl bg-accent-600 flex items-center justify-center text-white">
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Family Members */}
        <h2 className="text-xs font-semibold text-ink-300 uppercase tracking-wide mb-3">Family Circle</h2>
        <div className="space-y-3 mb-8">
          {family.map(m => (
            <div key={m.name} className={`card-elevated p-4 flex items-center gap-4 ${m.status === "emergency" ? "ring-2 ring-alert-300 bg-alert-50/30" : m.status === "offline" ? "opacity-70" : ""}`}>
              <div className="text-3xl">{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-ink-900 text-sm">{m.name}</h3>
                  {m.status === "safe" && <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />}
                  {m.status === "offline" && <span className="w-2 h-2 rounded-full bg-ink-300" />}
                  {m.status === "emergency" && <AlertTriangle className="w-3.5 h-3.5 text-alert-500" />}
                </div>
                <p className="text-xs text-ink-300 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {m.location}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-200">
                  <span className="flex items-center gap-1"><Battery className={`w-3 h-3 ${m.battery < 20 ? "text-alert-500" : "text-success-500"}`} /> {m.battery}%</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {m.lastSeen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <h2 className="text-xs font-semibold text-ink-300 uppercase tracking-wide mb-3">Activity Timeline</h2>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${t.type === "warning" ? "bg-accent-500" : t.type === "success" ? "bg-success-500" : "bg-primary-400"}`} />
                {i < timeline.length - 1 && <div className="w-px h-full bg-paper-300 min-h-[32px]" />}
              </div>
              <div className="pb-4">
                <p className="text-sm text-ink-600">{t.text}</p>
                <p className="text-xs text-ink-200 mt-0.5">{t.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
