import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { ProvenanceBadge } from "./ProvenanceBadge";
import type { DataProvenance } from "@jeevan-ai/types";

export interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  provenance?: DataProvenance;
  lastUpdated?: string;
  statusColor?: "emerald" | "amber" | "red" | "blue" | "default";
  className?: string;
}

export function StatCard({
  title,
  value,
  suffix = "",
  change,
  trend,
  icon,
  provenance,
  lastUpdated,
  statusColor = "default",
  className = "",
}: StatCardProps) {
  const borderColors = {
    emerald: "border-emerald-500/30",
    amber: "border-amber-500/30",
    red: "border-alert-500/30",
    blue: "border-sky-500/30",
    default: "border-surface-border",
  };

  return (
    <div className={`card-elevated p-4 sm:p-5 rounded-xl border ${borderColors[statusColor]} bg-surface-card flex flex-col justify-between relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-card-hover text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="my-1 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-display font-bold text-surface-text tracking-tight">
          {value}
          {suffix && <span className="text-lg font-normal text-ink-400 ml-1">{suffix}</span>}
        </span>

        {change && (
          <span className={`inline-flex items-center text-xs font-semibold ${trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-alert-600 dark:text-alert-400" : "text-ink-400"}`}>
            {trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[10px] text-ink-400 font-mono">
        {lastUpdated ? (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lastUpdated}
          </span>
        ) : (
          <span />
        )}

        {provenance && <ProvenanceBadge provenance={provenance} size="sm" />}
      </div>
    </div>
  );
}
