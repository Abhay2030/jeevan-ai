import * as React from "react";
import { AlertCircle, AlertTriangle, Shield, Info } from "lucide-react";
import type { Severity } from "@jeevan-ai/types";

export interface SeverityBadgeProps {
  severity: Severity | string;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function SeverityBadge({
  severity,
  size = "sm",
  showIcon = true,
  className = "",
}: SeverityBadgeProps) {
  const norm = (severity || "LOW").toUpperCase() as Severity;

  let label = "LOW";
  let icon = <Info className="w-3 h-3 shrink-0" />;
  let colorStyles = "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800";

  if (norm === "CRITICAL") {
    label = "CRITICAL";
    icon = <AlertCircle className="w-3 h-3 shrink-0 text-alert-600 dark:text-alert-400" />;
    colorStyles = "bg-alert-50 text-alert-700 border-alert-300 dark:bg-alert-950/60 dark:text-alert-300 dark:border-alert-800 shadow-sm";
  } else if (norm === "HIGH") {
    label = "HIGH";
    icon = <AlertTriangle className="w-3 h-3 shrink-0 text-orange-600 dark:text-orange-400" />;
    colorStyles = "bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800";
  } else if (norm === "MEDIUM") {
    label = "MEDIUM";
    icon = <Shield className="w-3 h-3 shrink-0 text-accent-600 dark:text-accent-400" />;
    colorStyles = "bg-accent-50 text-accent-800 border-accent-300 dark:bg-accent-950/60 dark:text-accent-300 dark:border-accent-800";
  }

  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5 gap-1 font-bold" : "text-xs px-2.5 py-1 gap-1.5 font-bold";

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-display ${sizeClasses} ${colorStyles} ${className}`}
      role="status"
      aria-label={`Severity priority: ${label}`}
    >
      {showIcon && icon}
      {label}
    </span>
  );
}
