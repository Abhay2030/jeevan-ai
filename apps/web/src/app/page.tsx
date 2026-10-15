"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Activity,
  Brain,
  MapPin,
  Clock,
  Heart,
  Phone,
  Users,
  Zap,
  ChevronRight,
  ArrowRight,
  Siren,
  Hospital,
  Ambulance,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Star,
  Globe,
  Layers,
  Navigation,
  Lock,
  Building2,
  FileText,
  Sliders,
  Check,
  ExternalLink
} from "lucide-react";
import { HeroVideoModal } from "../components/HeroVideoModal";
import { Footer } from "../components/Footer";
import { ProvenanceBadge } from "@jeevan-ai/ui";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink-100 shadow-sm" role="navigation" aria-label="Main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & National Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-600/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="JEEVAN AI" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-display font-bold tracking-tight text-ink-900">
                  JEEVAN <span className="text-primary-600">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-200">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] text-ink-400 font-medium hidden sm:block">National Emergency Intelligence</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-ink-600">
            <Link href="/live-map" className="hover:text-primary-600 flex items-center gap-1.5 transition-colors">
              <Navigation className="w-3.5 h-3.5 text-primary-500" /> Live 3D Map
            </Link>
            <Link href="/command/dashboard" className="hover:text-primary-600 flex items-center gap-1.5 transition-colors">
              <Radio className="w-3.5 h-3.5 text-primary-500" /> Command Center
            </Link>
            <Link href="/responder/incidents" className="hover:text-primary-600 flex items-center gap-1.5 transition-colors">
              <Ambulance className="w-3.5 h-3.5 text-primary-500" /> Responder Portal
            </Link>
            <Link href="/admin/facilities" className="hover:text-primary-600 flex items-center gap-1.5 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-primary-500" /> Healthcare Registry
            </Link>
            <Link href="/admin/roles" className="hover:text-primary-600 flex items-center gap-1.5 transition-colors">
              <Lock className="w-3.5 h-3.5 text-primary-500" /> RBAC & Audit
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center h-9 px-4 text-xs font-bold text-ink-700 hover:text-primary-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
            >
              Portal Login
            </Link>
            <Link
              href="/sos"
              className="inline-flex items-center h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all gap-1.5 animate-pulse"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>SOS Emergency</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100"
              aria-label="Toggle navigation"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-ink-100 space-y-2 text-xs font-medium text-ink-700">
            <Link href="/live-map" className="block px-3 py-2 rounded-lg hover:bg-ink-50">Live 3D Map</Link>
            <Link href="/command/dashboard" className="block px-3 py-2 rounded-lg hover:bg-ink-50">Command Center</Link>
            <Link href="/responder/incidents" className="block px-3 py-2 rounded-lg hover:bg-ink-50">Responder Portal</Link>
            <Link href="/admin/facilities" className="block px-3 py-2 rounded-lg hover:bg-ink-50">Healthcare Registry</Link>
            <Link href="/admin/audit" className="block px-3 py-2 rounded-lg hover:bg-ink-50">Security & Audit Logs</Link>
            <Link href="/login" className="block px-3 py-2 rounded-lg hover:bg-ink-50 font-bold text-primary-600">Portal Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <div data-theme="paper" className="min-h-screen bg-paper-50 text-ink-900 font-body selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-ink-100">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* National Badge Strip */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>National Public Health & Emergency Intelligence Platform</span>
              <span className="text-emerald-400">•</span>
              <span className="font-mono text-[11px]">740+ Districts Architecture Scope</span>
            </div>

            {/* Main National Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-ink-900 leading-[1.1]">
              See the Risk. Predict the Need.{" "}
              <span className="bg-gradient-to-r from-teal-600 via-primary-600 to-cyan-600 bg-clip-text text-transparent block sm:inline">
                Move the Help.
              </span>
            </h1>

            {/* Core Supporting Value Proposition */}
            <p className="text-lg sm:text-xl text-ink-500 max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-ink-800">Every Life Matters.</span> India’s unified emergency coordination backbone connecting citizens, authorized paramedics, apex hospitals, and national command hubs before crises escalate.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/sos"
                className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm shadow-lg shadow-red-600/25 transition-all gap-2 hover:scale-[1.02]"
              >
                <Siren className="w-4 h-4" />
                Launch Citizen SOS
              </Link>

              <Link
                href="/command/dashboard"
                className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-ink-900 hover:bg-ink-800 text-white font-display font-bold text-sm shadow-md transition-all gap-2 hover:scale-[1.02]"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                Open Mission Control
              </Link>

              <Link
                href="/live-map"
                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white hover:bg-ink-50 text-ink-800 border border-ink-200 font-display font-bold text-sm shadow-sm transition-all gap-2"
              >
                <Navigation className="w-4 h-4 text-primary-600" />
                Interactive 3D Map
              </Link>
            </div>

            {/* Engineering Authors & National Credentials */}
            <div className="pt-8 border-t border-ink-100 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-ink-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-ink-600 font-bold">Principal Architects & Developers:</span>
                <span className="text-primary-700 font-semibold">Abhay Sachin Donde</span> & <span className="text-primary-700 font-semibold">Vedant Santosh Kokane</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> DPDP Act 2023 Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary-600" /> 10 Indic Languages
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ THE 4 CONNECTED EXPERIENCES LAUNCHPAD ══════ */}
      <section className="py-16 bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2 font-mono">
              ROLE-BASED OPERATIONAL MATRIX
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900">
              Four Connected Portals, One Life-Saving Mission
            </h2>
            <p className="text-xs text-ink-400 mt-2">
              Every interface is tailor-built for its operator with verifiable data provenance and zero simulated dispatch promises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Citizen Portal Card */}
            <div className="p-6 rounded-2xl bg-paper-50 border border-ink-100 hover:border-red-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Siren className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    CITIZEN
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink-900 group-hover:text-red-600 transition-colors">
                  Citizen Emergency Portal
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  1-tap SOS assistance, GPS consent-based transmission, bystander incident reporting, family circles, and verified blood donor matching.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-ink-100 flex flex-col gap-2">
                <Link
                  href="/sos"
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Open SOS Interface
                </Link>
                <div className="flex justify-between text-[11px] text-ink-400 pt-1 font-mono">
                  <Link href="/blood" className="hover:text-primary-600">Blood Network →</Link>
                  <Link href="/family" className="hover:text-primary-600">Family Circles →</Link>
                </div>
              </div>
            </div>

            {/* 2. Responder Portal Card */}
            <div className="p-6 rounded-2xl bg-paper-50 border border-ink-100 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    RESPONDER
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink-900 group-hover:text-amber-700 transition-colors">
                  Authorized Responder Terminal
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Real-time assigned incident queue, emergency vitals recording (BP/SpO2/GCS), 3D tactical GPS navigation, and offline sync drafts.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-ink-100 flex flex-col gap-2">
                <Link
                  href="/responder/incidents"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Open Incident Queue
                </Link>
                <div className="flex justify-between text-[11px] text-ink-400 pt-1 font-mono">
                  <Link href="/responder/map" className="hover:text-primary-600">GPS Navigation →</Link>
                  <Link href="/responder/profile" className="hover:text-primary-600">Unit Telemetry →</Link>
                </div>
              </div>
            </div>

            {/* 3. Command Center Card */}
            <div className="p-6 rounded-2xl bg-paper-50 border border-ink-100 hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                    COMMAND
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink-900 group-hover:text-cyan-700 transition-colors">
                  National Mission Control
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Regional situation overview, crowd surge AI predictions, dynamic green corridors, CPCB AQI/IMD weather streams, and digital twin monitoring.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-ink-100 flex flex-col gap-2">
                <Link
                  href="/command/dashboard"
                  className="w-full py-2 bg-ink-900 hover:bg-ink-800 text-white rounded-lg text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Enter Mission Control
                </Link>
                <div className="flex justify-between text-[11px] text-ink-400 pt-1 font-mono">
                  <Link href="/command/digital-twin" className="hover:text-primary-600">Digital Twin →</Link>
                  <Link href="/command/alerts" className="hover:text-primary-600">Disaster Alerts →</Link>
                </div>
              </div>
            </div>

            {/* 4. Admin Portal Card */}
            <div className="p-6 rounded-2xl bg-paper-50 border border-ink-100 hover:border-primary-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-800 border border-primary-200">
                    GOVERNANCE
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink-900 group-hover:text-primary-700 transition-colors">
                  Admin & Compliance Console
                </h3>
                <p className="text-xs text-ink-400 leading-relaxed">
                  Verified hospital bed registry, RBAC role elevation, operational zones, SHA-256 security audit logs, and platform mode threshold overrides.
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-ink-100 flex flex-col gap-2">
                <Link
                  href="/admin/facilities"
                  className="w-full py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Manage Facilities
                </Link>
                <div className="flex justify-between text-[11px] text-ink-400 pt-1 font-mono">
                  <Link href="/admin/roles" className="hover:text-primary-600">RBAC Matrix →</Link>
                  <Link href="/admin/audit" className="hover:text-primary-600">Audit Logs →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ NATIONAL HUB NETWORK ══════ */}
      <section className="py-16 bg-paper-100/60 border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest font-mono">
                INDIAN OPERATIONAL HUBS
              </p>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-900 mt-1">
                Active National Emergency Response Infrastructure
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>6 / 6 Operational Hubs Connected</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { code: "DEL-HQ", name: "New Delhi National HQ", status: "Active Lead", ping: "8ms" },
              { code: "MUM-OPS", name: "Mumbai Disaster Hub", status: "Active Lead", ping: "14ms" },
              { code: "BLR-MED", name: "Bengaluru Tech Hub", status: "Active Lead", ping: "12ms" },
              { code: "VNS-MAS", name: "Varanasi Pilgrim Ops", status: "Surge Watch", ping: "18ms" },
              { code: "IDR-REG", name: "Indore Regional Hub", status: "Normal", ping: "16ms" },
              { code: "HYD-RSP", name: "Hyderabad Grid", status: "Normal", ping: "15ms" },
            ].map((hub) => (
              <div key={hub.code} className="p-3.5 rounded-xl bg-white border border-ink-100 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-primary-700">{hub.code}</span>
                  <span className="text-[9px] font-mono text-ink-400">{hub.ping}</span>
                </div>
                <div className="text-xs font-bold text-ink-900 leading-snug truncate">{hub.name}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{hub.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ AI & DATA PROVENANCE METHODOLOGY ══════ */}
      <section className="py-20 bg-ink-950 text-white" data-theme="ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                PREDICTIVE PUBLIC HEALTH INTELLIGENCE
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                Honest AI With Human Verification & Strict Data Lineage
              </h2>

              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                JEEVAN AI enforces strict data provenance on every single data point. Responders and commanders always know whether an indicator represents real telemetry, field bystander reports, AI predictions, or synthetic simulation drills.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-ink-900 border border-ink-800 space-y-1">
                  <ProvenanceBadge provenance="[LIVE]" />
                  <p className="text-[11px] text-ink-400 mt-1">Direct GPS, IoT air quality, & 108 vehicle telemetry.</p>
                </div>
                <div className="p-3 rounded-xl bg-ink-900 border border-ink-800 space-y-1">
                  <ProvenanceBadge provenance="[REPORTED]" />
                  <p className="text-[11px] text-ink-400 mt-1">Citizen & bystander reports awaiting triage confirmation.</p>
                </div>
                <div className="p-3 rounded-xl bg-ink-900 border border-ink-800 space-y-1">
                  <ProvenanceBadge provenance="[ESTIMATE]" />
                  <p className="text-[11px] text-ink-400 mt-1">XGBoost & Gemini spatio-temporal surge forecasts.</p>
                </div>
                <div className="p-3 rounded-xl bg-ink-900 border border-ink-800 space-y-1">
                  <ProvenanceBadge provenance="[SIMULATION]" />
                  <p className="text-[11px] text-ink-400 mt-1">Mock training scenarios for multi-agency disaster drills.</p>
                </div>
              </div>
            </div>

            {/* AI Intelligence Card Preview */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-ink-900 border border-ink-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-ink-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold font-mono text-red-400 uppercase tracking-widest">
                      Live AI Surge Prediction
                    </span>
                  </div>
                  <ProvenanceBadge provenance="[ESTIMATE]" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Pilgrim Ghat Concourse Sector 4</h3>
                    <span className="text-xs font-bold text-amber-400 font-mono">92.4% Confidence</span>
                  </div>
                  <p className="text-xs text-ink-300 font-mono leading-relaxed">
                    Forecast: Inflow velocity suggests crowd density will cross 3.2 persons/sq.m in next 18 minutes. Elevated heat exhaustion risk.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] text-ink-400 font-mono">
                    <span>CROWD CAPACITY THRESHOLD</span>
                    <span className="text-red-400 font-bold">88% (Danger Threshold: 85%)</span>
                  </div>
                  <div className="w-full bg-ink-950 h-2 rounded-full overflow-hidden border border-ink-800">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <Link
                    href="/command/smart-corridors"
                    className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg text-center transition-colors"
                  >
                    Authorize Green Corridor
                  </Link>
                  <Link
                    href="/live-map"
                    className="px-4 py-2 bg-ink-800 hover:bg-ink-700 text-ink-200 font-bold rounded-lg transition-colors"
                  >
                    Inspect in 3D Map
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════ COMPREHENSIVE CAPABILITIES GRID ══════ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2 font-mono">
              NATIONAL EMERGENCY CAPABILITIES
            </p>
            <h2 className="text-3xl font-display font-bold text-ink-900">
              Engineered For High-Stakes Public Health Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Siren,
                title: "One-Tap SOS With Honest Verification",
                desc: "Captures precise coordinates, checks for duplicate cluster reports, and provides real-time transmission tracking without fake promises.",
                href: "/sos"
              },
              {
                icon: Navigation,
                title: "Tactical 3D Geospatial Map",
                desc: "MapLibre 3D building extrusions, live responder coordinates, crowd density heatmaps, and hospital bed capacity filters.",
                href: "/live-map"
              },
              {
                icon: Radio,
                title: "Predictive Command Center",
                desc: "Regional situation monitoring, automated ambulance green corridors, and AI risk alerts with human operator approval gates.",
                href: "/command/dashboard"
              },
              {
                icon: Ambulance,
                title: "Paramedic Dispatch & Triage Vitals",
                desc: "Mobile-first responder interface recording patient vitals (BP, SpO2, GCS), hospital bed sync, and offline sync drafts.",
                href: "/responder/incidents"
              },
              {
                icon: Hospital,
                title: "National Healthcare Master Registry",
                desc: "Real-time bed availability (ICU, Oxygen, General) across AIIMS, District, and Field Hospitals with direct capacity overrides.",
                href: "/admin/facilities"
              },
              {
                icon: Lock,
                title: "Security Audit & DPDP Act 2023 Logs",
                desc: "Cryptographically verified SHA-256 audit trail for all elevated access, role modifications, and corridor preemption actions.",
                href: "/admin/audit"
              },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="p-6 rounded-2xl bg-white border border-ink-100 hover:border-primary-500 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-ink-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-ink-400 leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-ink-100 text-xs font-bold text-primary-600 flex items-center gap-1">
                  Launch Capability <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
