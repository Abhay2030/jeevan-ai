"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Siren, MapPin, Phone, Users, Hospital, Clock,
  CheckCircle2, ArrowLeft, Navigation, Shield,
  Loader2, ChevronRight
} from "lucide-react";

type Phase = "ready" | "locating" | "sending" | "dispatched" | "tracking";

interface TimelineItem {
  time: string;
  label: string;
  icon: React.ElementType;
  done: boolean;
}

export default function SOSPage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [eta, setEta] = useState(4);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const triggerSOS = useCallback(() => {
    setPhase("locating");
    setTimeline([{ time: now(), label: "SOS Triggered", icon: Siren, done: true }]);

    setTimeout(() => {
      setPhase("sending");
      setTimeline(prev => [...prev, { time: now(), label: "Location Captured — 20.0059°N, 73.7903°E", icon: MapPin, done: true }]);
    }, 1200);

    setTimeout(() => {
      setTimeline(prev => [...prev, { time: now(), label: "Family Contacts Alerted", icon: Users, done: true }]);
    }, 2200);

    setTimeout(() => {
      setPhase("dispatched");
      setTimeline(prev => [...prev, { time: now(), label: "Responder Dispatched — Unit R-17", icon: Navigation, done: true }]);
    }, 3200);

    setTimeout(() => {
      setPhase("tracking");
      setTimeline(prev => [...prev, { time: now(), label: "Hospital Pre-Notified — Civil Hospital Nashik", icon: Hospital, done: true }]);
    }, 4500);
  }, []);

  useEffect(() => {
    if (phase === "tracking" && eta > 0) {
      const t = setInterval(() => setEta(prev => Math.max(0, prev - 1)), 15000);
      return () => clearInterval(t);
    }
  }, [phase, eta]);

  /* ── Ready / Trigger state ── */
  if (phase === "ready") {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gradient-sos px-4" data-theme="paper">
        <Link href="/emergency" className="absolute top-4 left-4 flex items-center gap-1 text-sm text-ink-300 hover:text-ink-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-ink-900 mb-2">Emergency SOS</h1>
          <p className="text-sm text-ink-300">Press and hold to send an emergency alert</p>
        </div>

        <button
          onClick={triggerSOS}
          className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-alert-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-alert-600/40 hover:bg-alert-700 active:scale-95 transition-all animate-sos-pulse focus-visible:outline-4 focus-visible:outline-alert-300"
          aria-label="Trigger Emergency SOS"
        >
          {/* Pulse rings */}
          <span className="absolute inset-0 rounded-full border-2 border-alert-400 opacity-0" style={{ animation: "sos-ring 2s ease-out infinite" }} />
          <span className="absolute inset-0 rounded-full border-2 border-alert-400 opacity-0" style={{ animation: "sos-ring 2s ease-out infinite 0.6s" }} />
          <span className="absolute inset-0 rounded-full border-2 border-alert-400 opacity-0" style={{ animation: "sos-ring 2s ease-out infinite 1.2s" }} />

          <Siren className="w-14 h-14 mb-2" />
          <span className="text-3xl font-display font-bold tracking-wide">SOS</span>
          <span className="text-xs opacity-80 mt-1">Tap to Alert</span>
        </button>

        <p className="mt-10 text-xs text-ink-200 text-center max-w-xs">
          This will share your location, alert emergency services, and notify your trusted contacts.
        </p>

        <a href="tel:112" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-alert-600 hover:text-alert-700 transition-colors">
          <Phone className="w-4 h-4" /> Call 112 Directly
        </a>
      </div>
    );
  }

  /* ── Active SOS state ── */
  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
      {/* Status bar */}
      <header className={`px-4 py-3 flex items-center justify-between text-white ${phase === "tracking" ? "bg-primary-600" : "bg-alert-600"} transition-colors duration-700`}>
        <div className="flex items-center gap-2">
          {phase === "tracking" ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
          <span className="font-display font-bold text-sm">
            {phase === "locating" && "Capturing Location..."}
            {phase === "sending" && "Alerting Services..."}
            {phase === "dispatched" && "Responder Dispatched"}
            {phase === "tracking" && "Help is On The Way"}
          </span>
        </div>
        <Shield className="w-5 h-5 opacity-60" />
      </header>

      <main className="flex-1 px-4 max-w-lg mx-auto w-full py-6">
        {/* ETA Card */}
        {(phase === "dispatched" || phase === "tracking") && (
          <div className="card-elevated p-6 mb-6 text-center animate-scale-in">
            <p className="text-xs text-ink-300 font-medium uppercase tracking-wide mb-1">Estimated Arrival</p>
            <div className="text-5xl font-display font-bold text-primary-600">{eta} <span className="text-xl">min</span></div>
            <div className="mt-4 w-full bg-paper-200 rounded-full h-2 overflow-hidden">
              <div className="bg-primary-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${((4 - eta) / 4) * 100}%` }} />
            </div>
            <p className="text-xs text-ink-200 mt-3">Responder Unit R-17 en route</p>
          </div>
        )}

        {/* Hospital Card */}
        {phase === "tracking" && (
          <div className="card-elevated p-5 mb-6 flex items-center gap-4 animate-fade-in-up">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <Hospital className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-ink-900 text-sm">Maharaja Yeshwantrao Hospital</h3>
              <p className="text-xs text-ink-300 mt-0.5">2.4 km • ICU Available • Blood Bank Active</p>
            </div>
            <ChevronRight className="w-5 h-5 text-ink-200 shrink-0" />
          </div>
        )}

        {/* Live Timeline */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-ink-300 uppercase tracking-wide mb-4">Live Timeline</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.done ? "bg-primary-100 text-primary-600" : "bg-paper-200 text-ink-300"}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-8 bg-primary-200" />}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-medium text-ink-900">{item.label}</p>
                  <p className="text-xs text-ink-200 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
            {phase !== "tracking" && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-paper-200 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-ink-300 animate-spin" />
                </div>
                <p className="text-sm text-ink-200">Processing...</p>
              </div>
            )}
          </div>
        </div>

        {/* Family Alert Card */}
        {timeline.length >= 3 && (
          <div className="card-elevated p-4 flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">Family Notified</p>
              <p className="text-xs text-ink-300">2 contacts received your live location</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success-500" />
          </div>
        )}
      </main>

      {/* Bottom action */}
      <div className="sticky bottom-0 glass p-4">
        <a href="tel:112" className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-ink-900 text-white font-display font-semibold w-full shadow-lg hover:bg-ink-800 transition-colors">
          <Phone className="w-5 h-5" /> Call 112 Emergency
        </a>
      </div>
    </div>
  );
}
