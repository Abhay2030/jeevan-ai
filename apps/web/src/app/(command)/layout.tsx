"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, Radio, Layers, AlertTriangle, BarChart3, LogOut, History, Zap, Phone } from "lucide-react";

import { AppHeader } from "../../components/AppHeader";

export default function CommandLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const nav = [
    { name: "Live Operations", href: "/command/dashboard", icon: Radio },
    { name: "Digital Twin", href: "/command/digital-twin", icon: Layers },
    { name: "Smart Corridors", href: "/command/smart-corridors", icon: Zap },
    { name: "Voice Ops", href: "/command/voice-ops", icon: Phone },
    { name: "Incident Replay", href: "/command/incident-replay", icon: History },
    { name: "Disaster Alerts", href: "/command/alerts", icon: AlertTriangle },
    { name: "Intelligence", href: "/command/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-surface-bg text-surface-text overflow-hidden font-body" data-theme="ink">
      {/* Top Universal App Header */}
      <AppHeader portalTitle="NATIONAL EMERGENCY COMMAND CENTER" theme="ink" />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar Navigation */}
        <aside className="w-16 lg:w-60 flex flex-col bg-ink-950 border-r border-ink-800 z-20 shrink-0">
          <nav className="flex-1 py-4 flex flex-col gap-1.5 px-2">
            {nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-xs font-semibold ${
                    isActive
                      ? "bg-primary-600/20 text-primary-400 font-bold border border-primary-500/30"
                      : "hover:bg-ink-900 text-ink-400 hover:text-ink-200"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-ink-800 flex items-center justify-center lg:justify-between bg-ink-900/40">
            <div className="hidden lg:flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-400 font-mono">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "OP"}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-200 font-medium truncate">{user?.full_name || "Command Operator"}</p>
                <p className="text-[10px] text-primary-400 font-mono font-bold">{user?.role || "OPERATOR"}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="text-ink-500 hover:text-alert-400 transition-colors p-1.5 rounded hover:bg-ink-800"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-ink-950">
          {children}
        </div>
      </div>
    </div>
  );
}
