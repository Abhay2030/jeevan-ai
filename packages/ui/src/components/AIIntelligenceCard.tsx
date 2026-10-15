"use client";

import * as React from "react";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  Ambulance,
  HelpCircle,
  FileText,
  UserCheck,
  ChevronRight
} from "lucide-react";
import type { AIIncidentCardData } from "@jeevan-ai/types";
import { SeverityBadge } from "./SeverityBadge";

export interface AIIntelligenceCardProps {
  data: AIIncidentCardData;
  onApproveAction?: (actionText: string) => void;
  onVerifyAssessment?: () => void;
  className?: string;
}

export function AIIntelligenceCard({
  data,
  onApproveAction,
  onVerifyAssessment,
  className = "",
}: AIIntelligenceCardProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "breakdown" | "actions">("overview");

  return (
    <div className={`card-elevated rounded-xl border border-primary-500/30 bg-surface-card p-5 shadow-lg relative overflow-hidden ${className}`}>
      {/* Top Banner: Intelligence Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-surface-text flex items-center gap-2">
              AI Emergency Intelligence
              <span className="text-[10px] font-mono text-ink-400 font-normal">
                v{data.meta.model_version}
              </span>
            </h3>
            <p className="text-[11px] text-ink-400">
              Confidence: <strong className="text-primary-600 dark:text-primary-400">{Math.round(data.meta.confidence * 100)}%</strong> • Evaluated: {new Date(data.meta.timestamp).toLocaleTimeString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SeverityBadge severity={data.severity_rating} size="sm" />
          {data.operator_verified ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300">
              <UserCheck className="w-3 h-3" /> VERIFIED BY OPERATOR
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300">
              <AlertTriangle className="w-3 h-3" /> PENDING OPERATOR SIGN-OFF
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-border mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2 px-3 border-b-2 transition-colors ${activeTab === "overview" ? "border-primary-600 text-primary-600 dark:text-primary-400 font-bold" : "border-transparent text-ink-400 hover:text-surface-text"}`}
        >
          Synthesis & Actions
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`pb-2 px-3 border-b-2 transition-colors ${activeTab === "breakdown" ? "border-primary-600 text-primary-600 dark:text-primary-400 font-bold" : "border-transparent text-ink-400 hover:text-surface-text"}`}
        >
          Facts vs Inferences ({data.observed_facts.length + data.model_inferences.length})
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`pb-2 px-3 border-b-2 transition-colors ${activeTab === "actions" ? "border-primary-600 text-primary-600 dark:text-primary-400 font-bold" : "border-transparent text-ink-400 hover:text-surface-text"}`}
        >
          Resource Recommendations ({data.recommended_hospitals.length + data.recommended_response_units.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYNTHESIS */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Contributing Factors */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 block mb-1.5">
              Contributing Factors to Priority Rating
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.contributing_factors.map((f, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-paper-200 dark:bg-ink-800 text-ink-700 dark:text-ink-200 border border-surface-border">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 block mb-1.5">
              Recommended Next Actions (Human-in-the-Loop)
            </span>
            <div className="space-y-2">
              {data.recommended_actions.map((act, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-surface-card-hover border border-surface-border text-xs">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${act.priority === "IMMEDIATE" ? "bg-alert-100 text-alert-700 dark:bg-alert-950 dark:text-alert-300" : "bg-primary-100 text-primary-700"}`}>
                        {act.priority}
                      </span>
                      <strong className="text-surface-text">{act.action}</strong>
                    </div>
                    <p className="text-[11px] text-ink-400">{act.rationale}</p>
                  </div>
                  {onApproveAction && (
                    <button
                      onClick={() => onApproveAction(act.action)}
                      className="px-2.5 py-1 rounded bg-primary-600 hover:bg-primary-700 text-white font-semibold text-[11px] shrink-0"
                    >
                      Authorize
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACTS VS INFERENCES */}
      {activeTab === "breakdown" && (
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {/* Observed Facts */}
          <div className="p-3 rounded-lg bg-paper-100 dark:bg-ink-900 border border-surface-border">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Observed Facts (Telemetry / Sensors)</span>
            </div>
            <ul className="space-y-1 text-ink-600 dark:text-ink-300 text-[11px]">
              {data.observed_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span> {fact}
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-2 border-t border-surface-border">
              <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-400 mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>User-Reported Details</span>
              </div>
              <ul className="space-y-1 text-ink-600 dark:text-ink-300 text-[11px]">
                {data.user_reported_details.map((rep, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-500 font-bold">•</span> {rep}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Inferences */}
          <div className="p-3 rounded-lg bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-400 mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Model Inferences & Risk Projection</span>
            </div>
            <ul className="space-y-1 text-ink-600 dark:text-ink-300 text-[11px]">
              {data.model_inferences.map((inf, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-500 font-bold">~</span> {inf}
                </li>
              ))}
            </ul>

            {data.information_gaps.length > 0 && (
              <div className="mt-3 pt-2 border-t border-purple-500/20">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Information Gaps & Uncertainty</span>
                </div>
                <ul className="space-y-1 text-ink-600 dark:text-ink-300 text-[11px]">
                  {data.information_gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">?</span> {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE RECOMMENDATIONS */}
      {activeTab === "actions" && (
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 block mb-1.5">
              Nearest Suitable Hospitals (Equipped for Incident Needs)
            </span>
            <div className="grid sm:grid-cols-2 gap-2">
              {data.recommended_hospitals.map((hosp) => (
                <div key={hosp.hospital_id} className="p-2.5 rounded-lg border border-surface-border bg-surface-card-hover flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-surface-text flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5 text-primary-600" />
                      {hosp.name}
                    </h4>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      {hosp.distance_km} km away • ~{hosp.eta_min} min ETA • {hosp.trauma_level}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-300" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 block mb-1.5">
              Available Response Fleet
            </span>
            <div className="grid sm:grid-cols-2 gap-2">
              {data.recommended_response_units.map((unit) => (
                <div key={unit.unit_id} className="p-2.5 rounded-lg border border-surface-border bg-surface-card-hover flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-surface-text flex items-center gap-1">
                      <Ambulance className="w-3.5 h-3.5 text-sky-600" />
                      {unit.callsign} ({unit.type})
                    </h4>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      ETA to Scene: ~{unit.eta_min} minutes
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Legal/Clinical Disclaimer Required by Prompt */}
      <div className="mt-4 pt-3 border-t border-surface-border flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-400">
        <p className="italic">
          {data.meta.disclaimer || "Disclaimer: This assessment is an automated operational decision-support inference, not a clinical medical diagnosis."}
        </p>
        {!data.operator_verified && onVerifyAssessment && (
          <button
            onClick={onVerifyAssessment}
            className="px-3 py-1 rounded bg-ink-800 hover:bg-ink-700 text-white font-semibold text-[10px] transition-colors"
          >
            Confirm & Log Decision
          </button>
        )}
      </div>
    </div>
  );
}
