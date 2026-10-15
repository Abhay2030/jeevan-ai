"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { AppHeader } from "../../components/AppHeader";
import { 
  Activity, 
  Map, 
  ClipboardList, 
  User, 
  ShieldCheck, 
  Radio,
  Ambulance,
  Phone
} from "lucide-react";

export default function ResponderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: "My Dashboard", href: "/responder/dashboard", icon: Activity },
    { name: "Incident Queue", href: "/responder/incidents", icon: ClipboardList, badge: "2 Active" },
    { name: "Tactical Navigation", href: "/responder/map", icon: Map },
    { name: "Unit Profile", href: "/responder/profile", icon: User },
  ];

  return (
    <div data-theme="paper" className="flex flex-col h-[100dvh] bg-surface-bg text-surface-text overflow-hidden">
      {/* Top Universal App Header */}
      <AppHeader portalTitle="TACTICAL RESPONDER" theme="paper" />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile, visible md+) */}
        <aside className="hidden md:flex w-64 flex-col bg-white border-r border-paper-200 shrink-0 z-20">
          <div className="p-4 border-b border-paper-200 bg-paper-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-900 truncate">
                  {user?.full_name || "Emergency Responder"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                    UNIT ON-DUTY
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-600/20 font-bold"
                      : "text-ink-600 hover:bg-paper-100 hover:text-ink-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white text-primary-700 font-bold" : "bg-alert-100 text-alert-700 font-bold"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Dispatch Status Box */}
          <div className="p-4 m-3 rounded-xl bg-paper-100 border border-paper-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-ink-800 mb-1">
              <span>Assigned Unit:</span>
              <span className="font-mono text-primary-700">ALS-01</span>
            </div>
            <p className="text-[10px] text-ink-400">Station: Sector 4 Trauma Post</p>
            <div className="mt-2 pt-2 border-t border-paper-200 flex items-center justify-between text-[10px] text-ink-500 font-mono">
              <span>Telemetry:</span>
              <span className="text-emerald-600 font-bold">ONLINE (4G/GPS)</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (visible below md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-paper-200 flex items-center justify-around px-2 z-40 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? "text-primary-600 font-bold" : "text-ink-400 hover:text-ink-700"
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.name.replace("My ", "").replace("Tactical ", "")}</span>
              {item.badge && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-alert-600" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
