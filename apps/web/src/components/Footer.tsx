"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  HeartPulse,
  Scale,
  FileText,
  Bot,
  Eye,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-ink-950 text-ink-200 border-t border-ink-800 transition-colors"
      data-theme="ink"
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* ══════ MAIN FOOTER NAVIGATION ══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Brand & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
              aria-label="JEEVAN AI Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-900/40">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  JEEVAN AI
                </span>
                <span className="text-[11px] font-mono tracking-wider text-primary-400 uppercase -mt-1">
                  National Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-ink-300 leading-relaxed max-w-sm">
              AI-powered public health and emergency intelligence for a safer, better-prepared India. Detecting emerging risks, predicting medical demand, and coordinating emergency interventions across communities.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-900 border border-ink-800 text-xs text-ink-300">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span>See the Risk. Predict the Need. Move the Help.</span>
              </div>
            </div>

            <p className="text-xs text-ink-500 leading-relaxed pt-1">
              Independent technology initiative for public health intelligence and emergency support. Not an official government department and not affiliated with any single entity unless formally authorized.
            </p>
          </div>

          {/* Platform Routes (Col 5-7) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display font-semibold text-white text-sm tracking-wide flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-primary-400" />
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Overview</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sos"
                  className="text-alert-400 hover:text-alert-300 font-semibold transition-colors flex items-center justify-between group"
                >
                  <span>Emergency Reporting (SOS)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-alert-950/80 border border-alert-800 text-alert-400">Instant</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency"
                  className="hover:text-white transition-colors"
                >
                  Emergency Helplines &amp; Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/situation-pulse"
                  className="hover:text-white transition-colors"
                >
                  Health Intelligence Pulse
                </Link>
              </li>
              <li>
                <Link
                  href="/hospitals"
                  className="hover:text-white transition-colors"
                >
                  Resource Coordination (Hospitals)
                </Link>
              </li>
              <li>
                <Link
                  href="/blood"
                  className="hover:text-white transition-colors"
                >
                  Emergency Blood Donor Network
                </Link>
              </li>
              <li>
                <Link
                  href="/command/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Operations Analytics &amp; Command
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About JEEVAN AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance (Col 8-10) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display font-semibold text-white text-sm tracking-wide flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary-400" />
              Legal &amp; Compliance
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-ink-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Scale className="w-3.5 h-3.5 text-ink-400" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/disclaimer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Medical &amp; Emergency Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/ai-accuracy"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Bot className="w-3.5 h-3.5 text-primary-400" />
                  <span>AI &amp; Data Accuracy Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/copyright"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-ink-400" />
                  <span>IP &amp; Copyright Notice</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/accessibility"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-ink-400" />
                  <span>Accessibility Statement</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Direct Hotlines (Col 11-12) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display font-semibold text-white text-sm tracking-wide flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-alert-400" />
              India Helplines
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                <div className="text-ink-400 font-medium">National Emergency</div>
                <div className="text-base font-mono font-bold text-alert-400">112</div>
              </div>
              <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                <div className="text-ink-400 font-medium">Ambulance Services</div>
                <div className="text-base font-mono font-bold text-alert-400">108</div>
              </div>
              <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                <div className="text-ink-400 font-medium">Fire &amp; Rescue</div>
                <div className="text-base font-mono font-bold text-amber-400">101</div>
              </div>
              <div className="p-2.5 rounded-lg bg-ink-900 border border-ink-800">
                <div className="text-ink-400 font-medium">NDRF Disaster Helpline</div>
                <div className="text-base font-mono font-bold text-primary-400">1078</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ MANDATORY MEDICAL & EMERGENCY DISCLAIMER ══════ */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-800/50 mb-12">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <p>
                <strong className="text-amber-100 font-semibold">Medical &amp; Emergency Disclaimer:</strong>{" "}
                JEEVAN AI provides technology-assisted public-health intelligence, information, and emergency coordination support. It is not a substitute for qualified medical professionals, emergency services, or official instructions from authorized authorities. AI-generated assessments and recommendations may be incomplete, delayed, or inaccurate and must be evaluated appropriately.
              </p>
              <p className="font-semibold text-amber-100">
                Do not rely solely on JEEVAN AI during an emergency. Contact the appropriate local emergency services and follow instructions from authorized responders.
              </p>
            </div>
          </div>
        </div>

        {/* ══════ DEVELOPER ATTRIBUTION & INTELLECTUAL PROPERTY BAR ══════ */}
        <div className="border-t border-ink-800/80 pt-8 mt-4 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Developer Credits */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-400 shrink-0" />
                <h4 className="font-display font-semibold text-white text-sm sm:text-base">
                  Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane
                </h4>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed max-w-2xl">
                Designed and developed with a focus on AI-powered public health intelligence, emergency coordination, and responsible technology.
              </p>
            </div>

            {/* Compliance Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-ink-900 border border-ink-800 text-[11px] font-mono text-ink-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                WCAG 2.2 AA Aligned
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-ink-900 border border-ink-800 text-[11px] font-mono text-ink-300">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                India DPDPA Compliant Design
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-500 pt-2 border-t border-ink-900">
            <p>
              &copy; {currentYear} JEEVAN AI. All rights reserved.
            </p>
            <p className="text-ink-500 text-[11px] max-w-xl text-left sm:text-right">
              Unless otherwise stated, original materials created specifically for the JEEVAN AI project are protected by applicable intellectual property laws. Third-party software libraries, datasets, and trademarks remain the property of their respective holders.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
