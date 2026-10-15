"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Bell,
  Globe,
  MapPin,
  Clock,
  Phone,
  LogOut,
  ChevronDown,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  Radio
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { INDIAN_COMMAND_HUBS } from "../lib/geoIntelligenceData";
import type { SupportedLanguage } from "@jeevan-ai/types";

export interface AppHeaderProps {
  portalTitle?: string;
  theme?: "ink" | "paper" | "medical";
  selectedHubId?: string;
  onHubChange?: (hubId: string) => void;
}

export function AppHeader({
  portalTitle = "OPERATIONS",
  theme = "ink",
  selectedHubId = "national-hq",
  onHubChange,
}: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [currentLang, setCurrentLang] = React.useState<SupportedLanguage>("en");
  const [showHubDropdown, setShowHubDropdown] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: false
        }) + " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeHub = INDIAN_COMMAND_HUBS.find((h) => h.id === selectedHubId) || INDIAN_COMMAND_HUBS[0];

  const isDark = theme === "ink";

  return (
    <header className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b shrink-0 z-30 transition-colors ${
      isDark
        ? "bg-ink-950 border-ink-800 text-white"
        : "bg-white border-paper-200 text-ink-900 shadow-xs"
    }`}>
      {/* LEFT: Branding & Hub Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1 border border-paper-200">
            <img src="/logo.png" alt="JEEVAN AI" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-sm tracking-tight block leading-none">
              JEEVAN <span className="text-primary-600">AI</span>
            </span>
            <span className="text-[9px] font-mono text-ink-400 uppercase tracking-widest block mt-0.5">
              {portalTitle}
            </span>
          </div>
        </Link>

        <div className="h-6 w-px bg-surface-border hidden md:block" />

        {/* National Geographic Hub Selector */}
        <div className="relative">
          <button
            onClick={() => setShowHubDropdown(!showHubDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isDark
                ? "bg-ink-900/90 border-ink-700 text-ink-200 hover:border-primary-500"
                : "bg-paper-100 border-paper-300 text-ink-800 hover:border-primary-400"
            }`}
            aria-label="Select command hub or state"
          >
            <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            <span className="max-w-[130px] sm:max-w-[200px] truncate font-medium">
              {activeHub.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </button>

          {showHubDropdown && (
            <div className={`absolute top-full left-0 mt-1.5 w-72 rounded-xl border p-2 shadow-2xl z-50 animate-scale-in ${
              isDark
                ? "bg-ink-950 border-ink-800 text-white"
                : "bg-white border-paper-300 text-ink-900"
            }`}>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-400 px-2 py-1">
                National Command Centers
              </div>
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto no-scrollbar">
                {INDIAN_COMMAND_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      if (onHubChange) onHubChange(hub.id);
                      setShowHubDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col ${
                      hub.id === selectedHubId
                        ? isDark ? "bg-primary-950/60 text-primary-300 border border-primary-800" : "bg-primary-50 text-primary-900 border border-primary-200"
                        : isDark ? "hover:bg-ink-900 text-ink-300" : "hover:bg-paper-100 text-ink-700"
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      {hub.name}
                      <span className="text-[10px] font-mono opacity-60">{hub.state}</span>
                    </span>
                    <span className="text-[10px] text-ink-400 mt-0.5 line-clamp-1">{hub.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Telemetry & Live Link Status */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NATIONAL GRID ACTIVE</span>
        </div>

        <div className="flex items-center gap-1.5 text-ink-400">
          <Clock className="w-3.5 h-3.5 text-primary-500" />
          <span>{currentTime || "18:30:00 IST"}</span>
        </div>
      </div>

      {/* RIGHT: Actions, Language & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Emergency Call Shortcut */}
        <a
          href="tel:112"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-alert-600 hover:bg-alert-700 text-white font-bold text-xs shadow-sm transition-all"
          title="Direct Dial Indian National Emergency Number 112"
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">112 SOS</span>
        </a>

        {/* Language Selector */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-surface-border text-xs">
          <Globe className="w-3.5 h-3.5 text-primary-500" />
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value as SupportedLanguage)}
            className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            aria-label="Platform Language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
              isDark
                ? "bg-ink-900 border-ink-800 hover:border-ink-700"
                : "bg-paper-100 border-paper-200 hover:border-paper-300"
            }`}
            aria-label="User account menu"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-600 text-white font-bold text-xs flex items-center justify-center font-mono">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="hidden sm:block text-xs font-semibold max-w-[100px] truncate">
              {user?.full_name || "Official User"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {showUserDropdown && (
            <div className={`absolute top-full right-0 mt-1.5 w-60 rounded-xl border p-3 shadow-2xl z-50 animate-scale-in ${
              isDark
                ? "bg-ink-950 border-ink-800 text-white"
                : "bg-white border-paper-300 text-ink-900"
            }`}>
              <div className="border-b border-surface-border pb-2.5 mb-2">
                <p className="font-bold text-xs truncate">{user?.full_name || "User"}</p>
                <p className="text-[10px] text-ink-400 font-mono truncate">{user?.email || "user@jeevan.ai"}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/30">
                  {user?.role || "PUBLIC ACCESS"}
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-surface-card-hover transition-colors"
                >
                  <Shield className="w-4 h-4 text-primary-500" /> Public Portal
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-surface-card-hover transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-amber-500" /> Admin Oversight
                  </Link>
                )}
                {(user?.role === "COMMAND" || user?.role === "ADMIN") && (
                  <Link
                    href="/command/dashboard"
                    className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-surface-card-hover transition-colors"
                  >
                    <Radio className="w-4 h-4 text-sky-500" /> Mission Control
                  </Link>
                )}
                {(user?.role === "RESPONDER" || user?.role === "ADMIN") && (
                  <Link
                    href="/responder/dashboard"
                    className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-surface-card-hover transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Responder Hub
                  </Link>
                )}

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-alert-600 hover:bg-alert-50 dark:hover:bg-alert-950/40 transition-colors mt-2 border-t border-surface-border pt-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
