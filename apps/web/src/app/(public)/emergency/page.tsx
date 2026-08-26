"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Siren, Hospital, Mic, HeartPulse, Droplets, Users,
  ShieldAlert, Accessibility, Phone, ChevronRight,
  MapPin, Clock, Shield
} from "lucide-react";

const services = [
  { href: "/sos", icon: Siren, title: "One-Tap SOS", desc: "Instant emergency alert with GPS", color: "bg-alert-600", glow: "shadow-glow-alert", urgent: true },
  { href: "/hospitals", icon: Hospital, title: "Find Hospital", desc: "AI-recommended nearest hospital", color: "bg-primary-600", glow: "shadow-glow-primary" },
  { href: "/voice", icon: Mic, title: "Voice Assistant", desc: "Talk in Hindi, English, Marathi", color: "bg-accent-600", glow: "shadow-glow-accent" },
  { href: "/first-aid", icon: HeartPulse, title: "First Aid Guide", desc: "Help until help arrives", color: "bg-success-600", glow: "" },
  { href: "/blood", icon: Droplets, title: "Blood Network", desc: "Find donors near you", color: "bg-alert-700", glow: "" },
  { href: "/family", icon: Users, title: "Family Safety", desc: "Track & protect loved ones", color: "bg-primary-700", glow: "" },
  { href: "/safety-detect", icon: ShieldAlert, title: "Safety Detection", desc: "Fall & crash detection", color: "bg-ink-600", glow: "" },
  { href: "/women-safety", icon: Shield, title: "Women Safety", desc: "Silent SOS & safe routes", color: "bg-purple-600", glow: "" },
];

export default function EmergencyHub() {
  const [locationName, setLocationName] = useState("Locating...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown City";
            const state = data.address.state || "";
            // Some states might be long, so we try to get a clean string
            let locString = `${city}${state ? `, ${state}` : ""}`;
            // If the string is too long for mobile, we could format it, but this is fine.
            setLocationName(locString);
          } catch (error) {
            setLocationName("Location found");
          }
        },
        (error) => {
          setLocationName("Ujjain, MP"); // fallback if denied
        }
      );
    } else {
      setLocationName("Ujjain, MP");
    }
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
      {/* Top bar */}
      <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-ink-900 text-sm">JEEVAN <span className="text-primary-600">AI</span></span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-ink-300">
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
          <span className="truncate max-w-[120px]">{locationName}</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-6 max-w-2xl mx-auto w-full">
        {/* Giant SOS button */}
        <div className="flex flex-col items-center pt-8 pb-10">
          <Link
            href="/sos"
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-alert-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-alert-600/30 hover:bg-alert-700 transition-all active:scale-95 animate-sos-pulse"
            aria-label="Trigger Emergency SOS"
          >
            <Siren className="w-10 h-10 sm:w-12 sm:h-12 mb-1" />
            <span className="text-xl sm:text-2xl font-display font-bold">SOS</span>
            <span className="text-xs opacity-80 mt-0.5">Tap for Help</span>
          </Link>
          <div className="flex items-center gap-4 mt-6 text-xs text-ink-300">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-500" /> Avg 3.5 min response</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-alert-500" /> 112 Emergency</span>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`card-elevated p-4 sm:p-5 flex flex-col gap-3 group card-interactive ${s.urgent ? "ring-2 ring-alert-200 bg-alert-50/30" : ""}`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${s.color} flex items-center justify-center shadow-md`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-ink-900 text-sm sm:text-base">{s.title}</h3>
                <p className="text-xs text-ink-300 mt-0.5 line-clamp-1">{s.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-200 group-hover:text-primary-500 transition-colors self-end mt-auto" />
            </Link>
          ))}
        </div>

        {/* Emergency numbers */}
        <div className="mt-8 card-elevated p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-300 font-medium mb-1">National Emergency</p>
            <a href="tel:112" className="text-2xl font-display font-bold text-alert-600">112</a>
          </div>
          <div className="h-10 w-px bg-paper-300" />
          <div>
            <p className="text-xs text-ink-300 font-medium mb-1">Ambulance</p>
            <a href="tel:108" className="text-2xl font-display font-bold text-primary-600">108</a>
          </div>
          <div className="h-10 w-px bg-paper-300" />
          <div>
            <p className="text-xs text-ink-300 font-medium mb-1">Women Helpline</p>
            <a href="tel:181" className="text-2xl font-display font-bold text-purple-600">181</a>
          </div>
        </div>
      </main>
    </div>
  );
}
