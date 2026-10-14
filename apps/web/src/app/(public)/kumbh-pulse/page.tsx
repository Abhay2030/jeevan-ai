"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PulseRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/situation-pulse");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-50" data-theme="paper">
      <div className="text-center">
        <p className="text-sm text-ink-400 font-mono">Redirecting to Situation Pulse...</p>
      </div>
    </div>
  );
}
