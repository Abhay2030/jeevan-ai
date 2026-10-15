import * as React from "react";
import type { DataProvenance } from "@jeevan-ai/types";

export interface ProvenanceBadgeProps {
  provenance: DataProvenance | string;
  size?: "sm" | "md";
  className?: string;
}

export function ProvenanceBadge({ provenance, size = "sm", className = "" }: ProvenanceBadgeProps) {
  const norm = provenance.toUpperCase().trim();

  let label = "DATA";
  let colorStyles = "bg-ink-100 text-ink-800 border-ink-300 dark:bg-ink-800 dark:text-ink-200 dark:border-ink-700";
  let pulseDot = null;

  if (norm.includes("LIVE")) {
    label = "LIVE TELEMETRY";
    colorStyles = "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
    pulseDot = <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />;
  } else if (norm.includes("REPORTED")) {
    label = "FIELD REPORTED";
    colorStyles = "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800";
    pulseDot = <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />;
  } else if (norm.includes("ESTIMATE")) {
    label = "AI PREDICTED";
    colorStyles = "bg-purple-500/10 text-purple-700 border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800";
    pulseDot = <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />;
  } else if (norm.includes("SIMULATION") || norm.includes("DEMO")) {
    label = "SIMULATION DRILL";
    colorStyles = "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
    pulseDot = <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />;
  }

  const sizeClasses = size === "sm" ? "text-[9px] px-1.5 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-wider rounded-md border uppercase whitespace-nowrap ${sizeClasses} ${colorStyles} ${className}`}
      title={`Data origin: ${label}`}
    >
      {pulseDot}
      {label}
    </span>
  );
}
