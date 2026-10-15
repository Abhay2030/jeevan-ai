"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Shield,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Clock,
  User,
  Terminal,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  hubLocation: string;
  outcome: "SUCCESS" | "DENIED" | "ELEVATED_AUTH";
  hash: string;
  details: string;
}

const DEMO_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "aud-901",
    timestamp: "2026-10-15 18:42:10 IST",
    actorName: "Dr. Rajeshwar Sharma",
    actorRole: "COMMAND_OFFICER",
    action: "AMBULANCE_CORRIDOR_OVERRIDE",
    resource: "Zone-Central-Kumbh Corridor 3",
    ipAddress: "10.14.82.11 (NIC VPN)",
    hubLocation: "Varanasi Command Hub",
    outcome: "SUCCESS",
    hash: "sha256:8f49a21c9b...e7d0",
    details: "Authorized emergency green corridor signal preemption for ALS-04 carrying cardiac emergency.",
  },
  {
    id: "aud-902",
    timestamp: "2026-10-15 18:31:05 IST",
    actorName: "Unknown Session Token",
    actorRole: "ANONYMOUS",
    action: "RESTRICTED_TELEMETRY_ACCESS",
    resource: "GET /api/v1/hospitals/confidential-inventory",
    ipAddress: "185.220.101.5 (External Tor Exit)",
    hubLocation: "National Cloud Gateway",
    outcome: "DENIED",
    hash: "sha256:3a11b849de...90c4",
    details: "Automated firewall rule blocked unauthenticated request to reserve medical supply inventory.",
  },
  {
    id: "aud-903",
    timestamp: "2026-10-15 18:15:22 IST",
    actorName: "System Administrator (Root)",
    actorRole: "SUPER_ADMIN",
    action: "RBAC_ROLE_ELEVATION",
    resource: "User usr_77192 (Pooja Kulkarni)",
    ipAddress: "10.0.4.15 (HQ Intranet)",
    hubLocation: "New Delhi National HQ",
    outcome: "ELEVATED_AUTH",
    hash: "sha256:d982ec45bb...12f8",
    details: "Elevated Field Volunteer to TRIAGE_LEAD with dual-supervisor multi-factor approval.",
  },
  {
    id: "aud-904",
    timestamp: "2026-10-15 17:58:44 IST",
    actorName: "Inspector Vikram Patil",
    actorRole: "ZONE_COORDINATOR",
    action: "ZONE_CAPACITY_THRESHOLD_CHANGE",
    resource: "Operational Zone SEC-EST-05",
    ipAddress: "10.12.30.98 (Police WAN)",
    hubLocation: "Indore Regional Hub",
    outcome: "SUCCESS",
    hash: "sha256:77bc34101e...441a",
    details: "Adjusted crowd surge warning threshold from 2.0 to 2.5 persons/sq.m for evening prayer surge.",
  },
  {
    id: "aud-905",
    timestamp: "2026-10-15 17:40:19 IST",
    actorName: "Citizen Portal User (Verified OTP)",
    actorRole: "CITIZEN",
    action: "SOS_INCIDENT_TRANSMIT",
    resource: "Incident inc-8820 (Crush Hazard)",
    ipAddress: "103.21.124.9 (Jio Mobile 5G)",
    hubLocation: "Mumbai Disaster Centre",
    outcome: "SUCCESS",
    hash: "sha256:45df89e102...ab39",
    details: "Authenticated citizen incident submission via Aadhaar-linked OTP with spatial GPS consent.",
  },
  {
    id: "aud-906",
    timestamp: "2026-10-15 17:12:08 IST",
    actorName: "Automated ML Inference Worker",
    actorRole: "SYSTEM_SERVICE",
    action: "EPIDEMIC_SURGE_ALERT_TRIGGER",
    resource: "Predictive Model G-MEDIC-V3",
    ipAddress: "127.0.0.1 (Internal Mesh)",
    hubLocation: "National Compute Cluster",
    outcome: "SUCCESS",
    hash: "sha256:1a84f300c1...883e",
    details: "Synthesized syndromic fever cluster signals; issued priority alert to District Surveillance Unit.",
  },
];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>(DEMO_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("ALL");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(DEMO_AUDIT_LOGS[0]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOutcome = outcomeFilter === "ALL" || log.outcome === outcomeFilter;
      return matchesSearch && matchesOutcome;
    });
  }, [logs, searchQuery, outcomeFilter]);

  const handleExportCSV = () => {
    const headers = "ID,Timestamp,Actor,Role,Action,Resource,IP,Outcome,Hash\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.resource}","${l.ipAddress}","${l.outcome}","${l.hash}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jeevan-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" /> Security Audit & Governance Logs
          </h1>
          <p className="text-xs text-ink-400 mt-1">
            Immutable, cryptographically chained event log adhering to India’s DPDP Act 2023 & CERT-In cyber audit standards.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-ink-800 hover:bg-ink-700 text-white text-xs font-semibold rounded-lg border border-ink-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-ink-300" /> Export Compliance CSV
        </button>
      </div>

      {/* Security Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Total Logged Events</span>
            <Terminal className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{logs.length}</div>
          <p className="text-[10px] text-ink-500 mt-0.5">Rolling 90-day archive</p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Security Breaches / Blocks</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {logs.filter((l) => l.outcome === "DENIED").length}
          </div>
          <p className="text-[10px] text-emerald-400 mt-0.5">Automated containment active</p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Elevated Operations</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {logs.filter((l) => l.outcome === "ELEVATED_AUTH").length}
          </div>
          <p className="text-[10px] text-ink-400 mt-0.5">Multi-party signed</p>
        </div>

        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Chain Integrity</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">100%</div>
          <p className="text-[10px] text-ink-400 mt-0.5">Zero tamper signatures</p>
        </div>
      </div>

      {/* Main Filter & Table Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table / List: 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by actor, action, resource, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ink-900 border border-ink-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-ink-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="bg-ink-900 border border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-300 focus:outline-none focus:border-primary-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="SUCCESS">Success Only</option>
              <option value="DENIED">Denied / Blocked</option>
              <option value="ELEVATED_AUTH">Elevated Access</option>
            </select>
          </div>

          <div className="rounded-xl border border-ink-800 bg-ink-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ink-950/80 text-ink-400 font-mono text-[11px] border-b border-ink-800">
                  <tr>
                    <th className="p-3">Timestamp / Hub</th>
                    <th className="p-3">Actor & Role</th>
                    <th className="p-3">Action & Resource</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => {
                    const isSelected = selectedEntry?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedEntry(log)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary-950/30 text-white"
                            : "hover:bg-ink-800/40 text-ink-300"
                        }`}
                      >
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-white font-bold">{log.timestamp.slice(11, 19)}</div>
                          <div className="text-[10px] text-ink-500">{log.hubLocation}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-white font-bold">{log.actorName}</div>
                          <div className="text-[10px] text-primary-400">{log.actorRole}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-ink-200">{log.action}</div>
                          <div className="text-[10px] text-ink-500 truncate max-w-[180px]">{log.resource}</div>
                        </td>
                        <td className="p-3 text-ink-400 whitespace-nowrap">{log.ipAddress}</td>
                        <td className="p-3 whitespace-nowrap">
                          {log.outcome === "SUCCESS" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> ALLOWED
                            </span>
                          )}
                          {log.outcome === "DENIED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" /> BLOCKED
                            </span>
                          )}
                          {log.outcome === "ELEVATED_AUTH" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <Lock className="w-3 h-3" /> ELEVATED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Panel: 4 Cols */}
        <div className="lg:col-span-4">
          {selectedEntry ? (
            <div className="sticky top-6 rounded-2xl bg-ink-900 border border-ink-800 p-6 space-y-5">
              <div className="border-b border-ink-800 pb-3">
                <span className="text-[10px] font-mono text-ink-400 uppercase tracking-widest block">
                  Event Audit Signature
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedEntry.action}</h3>
                <p className="text-xs text-ink-400 mt-0.5 font-mono">{selectedEntry.timestamp}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">Actor</span>
                  <p className="text-white font-bold">{selectedEntry.actorName}</p>
                  <p className="text-primary-400 text-[11px]">{selectedEntry.actorRole}</p>
                </div>

                <div>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">Target Resource</span>
                  <p className="text-ink-200 font-mono text-[11px] bg-ink-950 p-2 rounded border border-ink-800 break-all">
                    {selectedEntry.resource}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">Network Origin</span>
                  <p className="text-ink-300 font-mono text-[11px]">{selectedEntry.ipAddress}</p>
                  <p className="text-ink-500 text-[10px]">{selectedEntry.hubLocation}</p>
                </div>

                <div>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">Cryptographic Checksum</span>
                  <p className="text-emerald-400 font-mono text-[11px] bg-ink-950 p-2 rounded border border-ink-800 break-all">
                    {selectedEntry.hash}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-ink-500 block uppercase font-mono">Operational Context</span>
                  <p className="text-ink-300 text-xs bg-ink-950/60 p-3 rounded-lg border border-ink-800">
                    {selectedEntry.details}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-ink-950 border border-ink-800 rounded-xl text-[11px] text-ink-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified with Central DPDP Audit Repository. Tamper proof.</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-ink-400 border border-ink-800 rounded-2xl bg-ink-900">
              Select an audit entry from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
