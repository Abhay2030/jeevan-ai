import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { Bot, Cpu, CheckCircle2, AlertTriangle, Layers, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "AI & Data Accuracy Disclaimer | JEEVAN AI",
  description: "Transparency guidelines, AI confidence metrics, simulation boundaries, and algorithmic decision-support limitations on JEEVAN AI.",
};

export default function AIAccuracyDisclaimerPage() {
  return (
    <LegalLayout
      title="AI & Data Accuracy Disclaimer"
      subtitle="Comprehensive transparency on model predictions, telemetry freshness, simulation boundaries, and human-in-the-loop safeguards."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">

        {/* Executive Transparency Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-primary-50 border border-primary-200 text-primary-950 space-y-3">
          <div className="flex items-center gap-2.5 font-display font-bold text-base sm:text-lg text-primary-900">
            <Bot className="w-6 h-6 text-primary-700 shrink-0" />
            Core AI Transparency Principles
          </div>
          <p className="text-xs sm:text-sm text-primary-900 leading-relaxed">
            JEEVAN AI utilizes state-of-the-art machine learning, statistical clustering, and natural language processing to assist emergency responders and public health planners. However, all artificial intelligence models generate probabilistic estimations rather than deterministic facts. AI recommendations must be interpreted within their confidence parameters and verified by human operators.
          </p>
        </div>

        {/* 1. Categorization of Data States */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-600" />
            1. Explicit Data State Categorization
          </h2>
          <p>
            To prevent ambiguity between real-world operational facts and synthetic or estimated scenarios, JEEVAN AI strictly labels telemetry into five distinct states throughout its user interfaces and APIs:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900 text-sm">Live Verified Data</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success-100 text-success-800 border border-success-300">LIVE</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Direct sensory or official dispatch data corroborated by connected telemetry (e.g. GPS pings from an active responder unit, authenticated hospital admission feeds).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900 text-sm">Manually Reported Data</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">REPORTED</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Incident reports submitted by civic callers, volunteers, or bystanders. Kept in an unverified state until cross-referenced or verified on-scene by first responders.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900 text-sm">AI-Predicted / Estimated</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-100 text-accent-800 border border-accent-300">ESTIMATE</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Algorithmic forecasts including 15-minute crowd density projections, surge probabilities, and estimated ambulance travel times through traffic congestion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900 text-sm">Simulated &amp; Demo Telemetry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">SIMULATION</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Synthetic scenarios used in training drills, testing, and system demonstrations (such as the Digital Twin and Incident Replay). Simulated telemetry does not reflect real-time live events.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Model Limitations & Sources of Error */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            2. Inherent Algorithmic Limitations &amp; Error Potential
          </h2>
          <p>
            Users and operational decision-makers must recognize that AI models are subject to specific technical limitations:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Source Data Freshness &amp; Coverage Gaps:</strong> If an emergency occurs in an area with sparse reporting or delayed hospital log ingestion, predictive forecasts may under-report or delay surge detection.
            </li>
            <li>
              <strong>Natural Language Understanding (NLU) Inaccuracies:</strong> Spoken voice transcriptions in loud background environments (sirens, storms, shouting crowds) or heavy regional dialects may result in misrecognized landmark names or misclassified emergency categories.
            </li>
            <li>
              <strong>Rapidly Changing Field Realities:</strong> Sudden flash floods, road blockages, structural collapses, or severe traffic bottlenecks may alter travel times faster than satellite or algorithmic updates can register.
            </li>
          </ul>
        </section>

        {/* 3. Mandatory Human-in-the-Loop Governance */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success-600" />
            3. Mandatory Human-in-the-Loop Authorization
          </h2>
          <p>
            JEEVAN AI enforces strict algorithmic governance: <strong>No autonomous critical decisions.</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>AI recommendations (such as activating a smart traffic corridor, evacuating an urban sector, or reallocating hospital trauma beds) require explicit approval by an authorized Command Center official.</li>
            <li>Every recommendation is accompanied by an explainability rationale detailing the statistical factors that triggered the alert.</li>
            <li>Human officers retain full authority to override, reject, or modify any algorithmic proposal.</li>
          </ul>
        </section>

        {/* 4. No Guarantee of Third-Party Data */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-ink-600" />
            4. Third-Party Telemetry &amp; Independent Verification
          </h2>
          <p>
            The platform integrates data feeds from third-party services (such as map tiles, traffic sensors, weather radars, and telephony networks). JEEVAN AI does not warrant the uninterrupted accuracy or completeness of external sources and disclaims liability for decisions made solely in reliance on unverified external feeds.
          </p>
          <p className="font-semibold text-ink-900">
            Field incident commanders must confirm critical resource coordinates and hospital acceptance through direct dispatch radio or telephone prior to executing high-risk transfers.
          </p>
        </section>

        {/* 5. Attribution & Architecture */}
        <section className="pt-4 border-t border-paper-200">
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-ink-900">JEEVAN AI Technology &amp; Architecture Group</p>
            <p className="text-ink-600">Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane.</p>
            <p className="text-ink-500">Designed and developed with a focus on AI-powered public health intelligence, emergency coordination, and responsible technology.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
