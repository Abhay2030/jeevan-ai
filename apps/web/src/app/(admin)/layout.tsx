"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { AppHeader } from "../../components/AppHeader";
import { 
  Users, 
  ShieldCheck, 
  Layers, 
  Building2, 
  FileText, 
  Settings, 
  ShieldAlert,
  Radio,
  Lock
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const adminNav = [
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Roles & RBAC", href: "/admin/roles", icon: ShieldCheck },
    { name: "Operational Zones", href: "/admin/zones", icon: Layers },
    { name: "Healthcare Facilities", href: "/admin/facilities", icon: Building2 },
    { name: "Security Audit Logs", href: "/admin/audit", icon: FileText },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div data-theme="ink" className="flex flex-col h-[100dvh] bg-surface-bg text-surface-text overflow-hidden font-body">
      {/* Top Universal App Header */}
      <AppHeader portalTitle="ADMINISTRATION & COMPLIANCE" theme="ink" />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Admin Sidebar */}
        <aside className="w-64 flex flex-col bg-ink-950 border-r border-ink-800 shrink-0 z-20 shadow-xl">
          <div className="p-4 border-b border-ink-800 bg-ink-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.full_name || "System Administrator"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                    ELEVATED ACCESS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-600/20 text-red-300 border border-red-500/40 font-bold"
                      : "text-ink-400 hover:bg-ink-900 hover:text-ink-200"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Compliance & Security Notice */}
          <div className="p-3 m-3 rounded-xl bg-ink-900 border border-ink-800 text-[10px] font-mono text-ink-400">
            <p className="text-red-400 font-bold mb-1">AUDIT MANDATE (DPDP 2023)</p>
            <p className="leading-tight">All administrator actions, role promotions, and record deletions are recorded immutably.</p>
          </div>
        </aside>

        {/* Dynamic Admin Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
