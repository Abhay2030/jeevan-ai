import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  MapPin,
  Bot,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About JEEVAN AI | National Public Health Platform",
  description: "Learn about the mission, multi-hazard architecture, and developers behind JEEVAN AI — India's Predictive Public Health & Emergency Response Platform.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper-50 text-ink-900" data-theme="paper">
      {/* ══════ TOP HEADER ══════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-paper-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-ink-900 text-base leading-tight">
                JEEVAN AI
              </span>
              <span className="text-[10px] font-mono text-primary-600 tracking-wider uppercase -mt-0.5">
                National Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-ink-600 hover:text-primary-700 transition-colors"
            >
              Platform Overview
            </Link>
            <Link
              href="/sos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-alert-600 text-white text-xs font-bold hover:bg-alert-700 transition-all shadow-sm"
            >
              <span>Emergency SOS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════ HERO SECTION ══════ */}
      <section className="bg-gradient-to-b from-white via-paper-50 to-paper-100 border-b border-paper-200 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Public Health &amp; Emergency Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink-900 tracking-tight">
            See the Risk. Predict the Need. Move the Help.
          </h1>

          <p className="text-lg sm:text-xl text-ink-600 max-w-2xl mx-auto leading-relaxed">
            JEEVAN AI is an AI-powered emergency intelligence platform designed to help Indian communities, hospitals, and emergency responders detect emerging hazards, anticipate critical medical demand, and coordinate rapid response.
          </p>
        </div>
      </section>

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Mission */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Our Mission</p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900">
              Transforming Emergency Care Across India
            </h2>
          </div>
          <p className="text-ink-700 leading-relaxed text-base sm:text-lg">
            During major public gatherings, natural hazards, or metropolitan health surges, emergency resources are often constrained not by lack of personnel, but by lack of timely situational intelligence. JEEVAN AI bridges this gap through a 9-stage operational intelligence lifecycle: <strong>Observe, Detect, Verify, Predict, Recommend, Authorize, Respond, Evaluate, and Learn.</strong>
          </p>
        </section>

        {/* Pillars Grid */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-paper-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-alert-50 flex items-center justify-center text-alert-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink-900">Immediate Citizen SOS</h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              Hold-to-activate 3-second emergency dispatch with offline queueing, landmark audio triage, and zero-registration barrier.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-paper-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink-900">Predictive Intelligence</h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              15-minute crowd density forecasting, hospital bed shortage alerts, and automated green corridor routing proposals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-paper-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-bold text-ink-900">Human-in-the-Loop</h3>
            <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
              Rigorous governance requiring authenticated command authority approval for all high-consequence interventions.
            </p>
          </div>
        </section>

        {/* Developer Attribution Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-ink-900 to-ink-950 text-white space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            Engineering &amp; Architectural Attribution
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane
            </h2>
            <p className="text-sm sm:text-base text-ink-300 leading-relaxed max-w-2xl">
              Designed and developed with a focus on AI-powered public health intelligence, emergency coordination, and responsible technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-ink-800 text-xs text-ink-400">
            <div>
              <span className="text-white font-semibold block mb-0.5">Technology Framework</span>
              <span>Next.js 16, React 19, Tailwind CSS v4, FastAPI, PostgreSQL / PostGIS, Google Gemini API, WebGL Digital Twin</span>
            </div>
            <div>
              <span className="text-white font-semibold block mb-0.5">Project Scope</span>
              <span>National administrative hierarchy covering 36 States/UTs, 740+ districts, and all-hazard emergency taxonomy</span>
            </div>
          </div>
        </section>

        {/* Non-Governmental Transparency Note */}
        <section className="p-6 rounded-2xl bg-paper-100 border border-paper-200 space-y-3 text-xs sm:text-sm text-ink-700">
          <h3 className="font-display font-bold text-ink-900 text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary-600" />
            Public Transparency &amp; Non-Affiliation Statement
          </h3>
          <p className="leading-relaxed">
            JEEVAN AI is an independent technological innovation. It is not an official government department, agency, or statutory body. Any reference to national emergency numbers (such as 112, 108, 101, or 1078) is provided solely for public safety reference and routing convenience.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/legal/privacy" className="text-primary-700 hover:underline font-medium">Privacy Policy &rarr;</Link>
            <Link href="/legal/terms" className="text-primary-700 hover:underline font-medium">Terms of Use &rarr;</Link>
            <Link href="/legal/disclaimer" className="text-primary-700 hover:underline font-medium">Medical Disclaimer &rarr;</Link>
            <Link href="/legal/ai-accuracy" className="text-primary-700 hover:underline font-medium">AI &amp; Data Accuracy &rarr;</Link>
          </div>
        </section>

      </main>

      {/* ══════ FOOTER ══════ */}
      <Footer />
    </div>
  );
}
