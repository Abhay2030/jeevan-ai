import * as React from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";

export interface AlertBannerProps {
  type?: "critical" | "warning" | "info" | "success";
  title: string;
  message?: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function AlertBanner({
  type = "info",
  title,
  message,
  onDismiss,
  action,
  className = "",
}: AlertBannerProps) {
  const styles = {
    critical: {
      wrap: "bg-alert-50 dark:bg-alert-950/80 border-alert-300 dark:border-alert-800 text-alert-900 dark:text-alert-100",
      icon: <AlertCircle className="w-5 h-5 text-alert-600 dark:text-alert-400 shrink-0" />,
      btn: "bg-alert-600 hover:bg-alert-700 text-white",
    },
    warning: {
      wrap: "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    info: {
      wrap: "bg-sky-50 dark:bg-sky-950/80 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-100",
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
      btn: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    success: {
      wrap: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  }[type];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 flex items-start justify-between gap-3 shadow-sm ${styles.wrap} ${className}`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div>
          <h4 className="font-display font-bold text-xs sm:text-sm">{title}</h4>
          {message && <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button
            onClick={action.onClick}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${styles.btn}`}
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
