"use client";

import React, { useState } from "react";
import { Loader2, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export interface SOSButtonProps {
  onTrigger: (latitude: number, longitude: number) => Promise<void>;
  className?: string;
}

export function SOSButton({ onTrigger, className = "" }: SOSButtonProps) {
  const [status, setStatus] = useState<"IDLE" | "LOCATING" | "SENDING" | "TRANSMITTED" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePress = () => {
    if (status === "LOCATING" || status === "SENDING") return;

    setStatus("LOCATING");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setStatus("ERROR");
      setErrorMessage("Geolocation is not supported by your browser. Please dial 112 directly.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setStatus("SENDING");
          await onTrigger(position.coords.latitude, position.coords.longitude);
          setStatus("TRANSMITTED");
          setTimeout(() => setStatus("IDLE"), 8000);
        } catch {
          setStatus("ERROR");
          setErrorMessage("Failed to transmit SOS to dispatch server. Please call 112 immediately.");
          setTimeout(() => setStatus("IDLE"), 6000);
        }
      },
      () => {
        setStatus("ERROR");
        setErrorMessage("Unable to retrieve high-accuracy GPS coordinates. Please enable device location or call 112.");
        setTimeout(() => setStatus("IDLE"), 6000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <button
        onClick={handlePress}
        disabled={status === "LOCATING" || status === "SENDING" || status === "TRANSMITTED"}
        aria-label="Trigger Emergency SOS. Press to transmit coordinates to dispatch command."
        className={`
          relative flex items-center justify-center
          min-h-[88px] min-w-[220px] w-full
          rounded-2xl font-display font-bold text-xl uppercase tracking-wider
          transition-all duration-200 transform active:scale-95 shadow-xl
          ${status === "IDLE" ? "bg-alert-600 hover:bg-alert-700 text-white animate-sos-pulse" : ""}
          ${(status === "LOCATING" || status === "SENDING") ? "bg-alert-500 text-white cursor-wait" : ""}
          ${status === "TRANSMITTED" ? "bg-primary-700 text-white" : ""}
          ${status === "ERROR" ? "bg-red-800 text-white" : ""}
        `}
      >
        <span className="flex items-center gap-3">
          {status === "IDLE" && (
            <>
              <ShieldAlert className="w-8 h-8 animate-bounce" />
              TRIGGER SOS
            </>
          )}
          {status === "LOCATING" && (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              ACQUIRING GPS...
            </>
          )}
          {status === "SENDING" && (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              TRANSMITTING...
            </>
          )}
          {status === "TRANSMITTED" && (
            <>
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              SOS TRANSMITTED
            </>
          )}
          {status === "ERROR" && (
            <>
              <AlertTriangle className="w-7 h-7 text-amber-300" />
              RETRY SOS
            </>
          )}
        </span>
      </button>

      {status === "TRANSMITTED" && (
        <span className="text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center mt-1 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          Report received by Command Gateway. Telemetry queued for verified dispatch evaluation.
        </span>
      )}

      {status === "ERROR" && (
        <span className="text-alert-600 dark:text-alert-400 text-xs font-semibold text-center mt-1">
          {errorMessage}
        </span>
      )}

      {status === "IDLE" && (
        <span className="text-ink-400 text-[11px] text-center">
          Transmits exact GPS coordinates to nearest authorized emergency responder network.
        </span>
      )}
    </div>
  );
}
