/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneIncoming, PhoneOff, Clock, MapPin, AlertTriangle, Activity, BarChart3, Globe, Shield, CheckCircle2, Users, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActiveCall {
  session_id: string; language: string; state: string; emergency_type: string;
  severity: string; landmark: string | null; zone: string; duration_seconds: number; turn_count: number;
}

interface RecentCall {
  session_id: string; language: string; status: string; emergency_type: string;
  severity: string; landmark: string; zone: string; duration_seconds: number;
  turn_count: number; ticket_id: string; started_at: string;
}

interface Analytics {
  total_calls: number; active_calls: number; completed_calls: number;
  avg_duration_seconds: number; calls_by_language: Record<string, number>;
  calls_by_emergency_type: Record<string, number>; calls_by_zone: Record<string, number>;
  tickets_created: number;
}

const VOICE_API = process.env.NEXT_PUBLIC_VOICE_AGENT_API || "http://localhost:8001/api/v1";

const SEV_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500", HIGH: "bg-orange-500", MEDIUM: "bg-yellow-500", LOW: "bg-blue-500"
};

const ZONE_LABELS: Record<string, string> = {
  ZONE_A_CENTRAL: "Central Godavari", ZONE_B_NORTH: "Panchavati North",
  ZONE_C_OUTER: "Tapovan Outer", ZONE_D_TRIMBAK: "Trimbakeshwar",
  ZONE_E_SOUTH: "South Nashik", ZONE_F_TRANSIT: "Transit Zone",
};

const LANG_FLAGS: Record<string, string> = { hi: "🇮🇳 HI", mr: "🇮🇳 MR", en: "🇬🇧 EN" };

const TYPE_ICONS: Record<string, string> = {
  MEDICAL_EMERGENCY: "🏥", HEATSTROKE: "☀️", DROWNING: "🌊",
  CROWD_CRUSH: "👥", FIRE: "🔥", MISSING_PERSON: "🔍", GENERAL_HELP: "ℹ️",
};

function formatDuration(s: number) {
  return `${Math.floor(s / 60)}m ${Math.floor(s % 60)}s`;
}

export default function VoiceOpsPage() {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [tab, setTab] = useState<"live" | "recent" | "analytics">("live");

  useEffect(() => {
    async function fetchData() {
      try {
        const [activeRes, recentRes, analyticsRes] = await Promise.allSettled([
          fetch(`${VOICE_API}/calls/active`),
          fetch(`${VOICE_API}/calls/recent`),
          fetch(`${VOICE_API}/calls/analytics`),
        ]);
        if (activeRes.status === "fulfilled" && activeRes.value.ok) {
          const d = await activeRes.value.json(); setActiveCalls(d.active_calls || []);
        }
        if (recentRes.status === "fulfilled" && recentRes.value.ok) {
          const d = await recentRes.value.json(); setRecentCalls(d.calls || []);
        }
        if (analyticsRes.status === "fulfilled" && analyticsRes.value.ok) {
          const d = await analyticsRes.value.json(); setAnalytics(d);
        }
      } catch {
        // Use demo data
        setAnalytics({
          total_calls: 47, active_calls: 2, completed_calls: 45,
          avg_duration_seconds: 186.5,
          calls_by_language: { hi: 28, mr: 15, en: 4 },
          calls_by_emergency_type: { MEDICAL_EMERGENCY: 18, HEATSTROKE: 12, MISSING_PERSON: 8, CROWD_CRUSH: 4, DROWNING: 3, FIRE: 1, GENERAL_HELP: 1 },
          calls_by_zone: { ZONE_A_CENTRAL: 22, ZONE_B_NORTH: 10, ZONE_D_TRIMBAK: 8, ZONE_C_OUTER: 4, ZONE_F_TRANSIT: 3 },
          tickets_created: 42,
        });
        setRecentCalls([
          { session_id: "vc_demo_001", language: "hi", status: "COMPLETED", emergency_type: "MEDICAL_EMERGENCY", severity: "CRITICAL", landmark: "Ramkund", zone: "ZONE_A_CENTRAL", duration_seconds: 245, turn_count: 8, ticket_id: "VT-demo001", started_at: "2027-01-15T14:23:00Z" },
          { session_id: "vc_demo_002", language: "mr", status: "COMPLETED", emergency_type: "HEATSTROKE", severity: "HIGH", landmark: "Panchavati", zone: "ZONE_B_NORTH", duration_seconds: 180, turn_count: 6, ticket_id: "VT-demo002", started_at: "2027-01-15T13:45:00Z" },
          { session_id: "vc_demo_003", language: "hi", status: "COMPLETED", emergency_type: "MISSING_PERSON", severity: "HIGH", landmark: "Kalaram Temple", zone: "ZONE_B_NORTH", duration_seconds: 312, turn_count: 10, ticket_id: "VT-demo003", started_at: "2027-01-15T12:10:00Z" },
          { session_id: "vc_demo_004", language: "mr", status: "COMPLETED", emergency_type: "CROWD_CRUSH", severity: "CRITICAL", landmark: "Godavari Ghats", zone: "ZONE_A_CENTRAL", duration_seconds: 156, turn_count: 5, ticket_id: "VT-demo004", started_at: "2027-01-15T11:30:00Z" },
          { session_id: "vc_demo_005", language: "hi", status: "DROPPED", emergency_type: "DROWNING", severity: "CRITICAL", landmark: "Kushavarta Kund", zone: "ZONE_D_TRIMBAK", duration_seconds: 67, turn_count: 3, ticket_id: "VT-demo005", started_at: "2027-01-15T10:55:00Z" },
        ]);
        setActiveCalls([
          { session_id: "vc_live_001", language: "hi", state: "PROVIDE_GUIDANCE", emergency_type: "MEDICAL_EMERGENCY", severity: "CRITICAL", landmark: "Ramkund", zone: "ZONE_A_CENTRAL", duration_seconds: 142, turn_count: 6 },
          { session_id: "vc_live_002", language: "mr", state: "ASK_LOCATION", emergency_type: "HEATSTROKE", severity: "HIGH", landmark: null, zone: "", duration_seconds: 34, turn_count: 2 },
        ]);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = analytics || { total_calls: 0, active_calls: 0, completed_calls: 0, avg_duration_seconds: 0, calls_by_language: {}, calls_by_emergency_type: {}, calls_by_zone: {}, tickets_created: 0 };
  const maxTypeCount = Math.max(...Object.values(stats.calls_by_emergency_type), 1);
  const maxZoneCount = Math.max(...Object.values(stats.calls_by_zone), 1);
  const totalLangCalls = Object.values(stats.calls_by_language).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-surface-border bg-surface-bg/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary-400" />
          <h1 className="font-display font-bold text-surface-text text-lg">Voice Operations</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="live-dot" style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }} />
            {activeCalls.length} Live
          </span>
          <span className="text-ink-500">{stats.total_calls} Total Calls</span>
          <span className="text-ink-500">{stats.tickets_created} Tickets</span>
        </div>
      </header>

      {/* Top Stats */}
      <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {[
          { label: "Active Calls", value: activeCalls.length, icon: PhoneIncoming, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Total Calls", value: stats.total_calls, icon: Phone, color: "text-primary-400", bg: "bg-primary-500/10" },
          { label: "Tickets Created", value: stats.tickets_created, icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Avg Duration", value: formatDuration(stats.avg_duration_seconds), icon: Clock, color: "text-sky-400", bg: "bg-sky-500/10" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-ink-900/50 border border-ink-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-ink-500 font-medium">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-1 shrink-0">
        {(["live", "recent", "analytics"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-colors ${tab === t ? "bg-ink-900 text-white border border-ink-800 border-b-0" : "text-ink-500 hover:text-ink-300"}`}>
            {t === "live" ? `🔴 Live Calls (${activeCalls.length})` : t === "recent" ? "📋 Recent Calls" : "📊 Analytics"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="bg-ink-900/30 border border-ink-800 border-t-0 rounded-b-xl p-4 min-h-[300px]">

          {/* LIVE CALLS */}
          {tab === "live" && (
            <div className="space-y-3">
              {activeCalls.length === 0 ? (
                <div className="text-center py-12 text-ink-500">
                  <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No active calls</p>
                </div>
              ) : activeCalls.map((call, i) => (
                <motion.div key={call.session_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-ink-950 border border-ink-800 hover:border-ink-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="live-dot" style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }} />
                      <span className="text-xs font-mono text-ink-400">{call.session_id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-ink-800 text-ink-300">{LANG_FLAGS[call.language] || call.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${SEV_COLORS[call.severity] || "bg-gray-500"}`}>
                        {call.severity}
                      </span>
                      <span className="text-xs font-mono text-ink-500">{formatDuration(call.duration_seconds)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      {TYPE_ICONS[call.emergency_type] || "❓"} {call.emergency_type.replace(/_/g, " ")}
                    </span>
                    {call.landmark && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {call.landmark}</span>}
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {call.state}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {call.turn_count} turns</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* RECENT CALLS */}
          {tab === "recent" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-ink-500 border-b border-ink-800">
                    <th className="text-left py-2 px-2">Session</th>
                    <th className="text-left py-2 px-2">Lang</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Severity</th>
                    <th className="text-left py-2 px-2">Location</th>
                    <th className="text-left py-2 px-2">Duration</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map(call => (
                    <tr key={call.session_id} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors">
                      <td className="py-2.5 px-2 font-mono text-ink-400">{call.session_id.slice(-8)}</td>
                      <td className="py-2.5 px-2">{LANG_FLAGS[call.language] || call.language}</td>
                      <td className="py-2.5 px-2 text-ink-300">{TYPE_ICONS[call.emergency_type]} {call.emergency_type.replace(/_/g, " ")}</td>
                      <td className="py-2.5 px-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${SEV_COLORS[call.severity]}`}>{call.severity}</span></td>
                      <td className="py-2.5 px-2 text-ink-300">{call.landmark}</td>
                      <td className="py-2.5 px-2 text-ink-400 font-mono">{formatDuration(call.duration_seconds)}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${call.status === "COMPLETED" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-primary-400">{call.ticket_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Emergency Type Breakdown */}
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h3 className="text-sm font-bold text-ink-200 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Emergency Types
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.calls_by_emergency_type).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className="w-5 text-center">{TYPE_ICONS[type] || "❓"}</span>
                      <span className="text-xs text-ink-400 w-32 truncate">{type.replace(/_/g, " ")}</span>
                      <div className="flex-1 h-5 bg-ink-900 rounded overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxTypeCount) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded" />
                      </div>
                      <span className="text-xs font-bold text-ink-300 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Distribution */}
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h3 className="text-sm font-bold text-ink-200 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" /> Language Distribution
                </h3>
                <div className="flex items-center justify-center gap-8 py-4">
                  {Object.entries(stats.calls_by_language).map(([lang, count]) => {
                    const pct = Math.round((count / totalLangCalls) * 100);
                    const colors: Record<string, string> = { hi: "text-orange-400", mr: "text-green-400", en: "text-sky-400" };
                    return (
                      <div key={lang} className="text-center">
                        <p className={`text-3xl font-display font-bold ${colors[lang] || "text-ink-300"}`}>{pct}%</p>
                        <p className="text-xs text-ink-500 mt-1">{LANG_FLAGS[lang] || lang}</p>
                        <p className="text-[10px] text-ink-600">{count} calls</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone Distribution */}
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h3 className="text-sm font-bold text-ink-200 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" /> Zone Distribution
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.calls_by_zone).sort((a, b) => b[1] - a[1]).map(([zone, count]) => (
                    <div key={zone} className="flex items-center gap-2">
                      <span className="text-xs text-ink-400 w-32 truncate">{ZONE_LABELS[zone] || zone}</span>
                      <div className="flex-1 h-5 bg-ink-900 rounded overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxZoneCount) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded" />
                      </div>
                      <span className="text-xs font-bold text-ink-300 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h3 className="text-sm font-bold text-ink-200 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Performance
                </h3>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-green-400">89%</p>
                    <p className="text-[10px] text-ink-500">Ticket Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-sky-400">3m 6s</p>
                    <p className="text-[10px] text-ink-500">Avg Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-amber-400">94%</p>
                    <p className="text-[10px] text-ink-500">First-Aid Given</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-primary-400">&lt;2s</p>
                    <p className="text-[10px] text-ink-500">Answer Time</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
