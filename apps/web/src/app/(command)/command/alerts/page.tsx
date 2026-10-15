"use client";

import React, { useState } from "react";
import {
  AlertTriangle, Radio, Globe, ShieldAlert, CloudLightning,
  ThermometerSun, MapPin, Send, CheckCircle2, Megaphone,
  Layers, Users, Shield, Clock, Plus, Eye, RefreshCw, Volume2
} from "lucide-react";
import { ProvenanceBadge, SeverityBadge } from "@jeevan-ai/ui";

interface NationalDisasterAlert {
  id: string;
  type: "WEATHER" | "CROWD" | "FLOOD" | "AIR_QUALITY" | "STAMPEDE_RISK";
  title: string;
  agency: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "ACTIVE" | "DRAFT" | "RESOLVED";
  timestamp: string;
  hub: string;
  affectedArea: string;
  targetPopulation: string;
  messageEn: string;
  messageHi: string;
  messageMr: string;
  safeShelters: string[];
  channels: string[];
  icon: React.ElementType;
}

const INITIAL_ALERTS: NationalDisasterAlert[] = [
  {
    id: "NDMA-CAP-2026-001",
    type: "WEATHER",
    title: "IMD Red Alert: Extreme Heatwave & Dehydration Advisory",
    agency: "India Meteorological Department (IMD) / NDMA",
    severity: "CRITICAL",
    status: "ACTIVE",
    timestamp: "14:30 IST • Updated 12m ago",
    hub: "Delhi NCR & Northern Plains",
    affectedArea: "Central Delhi, Najafgarh, Ghaziabad, Noida Sectors",
    targetPopulation: "~3.8M Citizens in affected sectors",
    messageEn: "CRITICAL HEATWAVE: Ambient temperatures forecasted above 44°C with dry Loo winds. Avoid direct sunlight from 11:00 AM to 4:00 PM. Drink ORS/electrolytes. ORS misting tents active at all metro stations.",
    messageHi: "गंभीर लू चेतावनी: तापमान 44°C से अधिक रहने का अनुमान है। सुबह 11 से शाम 4 बजे तक सीधी धूप से बचें। ओआरएस/पानी पीते रहें। सभी प्रमुख स्थानों पर निःशुल्क सहायता शिविर चालू हैं।",
    messageMr: "उष्णतेची तीव्र लाट: तापमान 44°C च्या वर राहण्याची शक्यता आहे. सकाळी 11 ते दुपारी 4 दरम्यान उन्हात जाणे टाळा. मुबलक पाणी व ओआरएस घ्या.",
    safeShelters: ["Metro Station Air-Cooled Transit Halls", "Civil Hospital Heat Relief Centers", "Community Air-Conditioned Pavilions"],
    channels: ["Cell Broadcast Service (CBS)", "JEEVAN AI App Push", "Smart City Digital Signage", "All India Radio Emergency Band"],
    icon: ThermometerSun,
  },
  {
    id: "NDMA-CAP-2026-002",
    type: "CROWD",
    title: "Congestion & Stampede Risk: Dynamic Corridor Diversion",
    agency: "State Police Command & Disaster Response Force",
    severity: "HIGH",
    status: "DRAFT",
    timestamp: "Pending Authorization",
    hub: "Varanasi Ganga Ghats",
    affectedArea: "Dashashwamedh Ghat & Kashi Corridor Entry Gates 1-3",
    targetPopulation: "~450,000 Pilgrims",
    messageEn: "CROWD CONGESTION: Entry to Dashashwamedh Ghat reached peak holding capacity. All approaching foot traffic redirected via Godowlia Outer Bypass. Follow marshal instructions.",
    messageHi: "भीड़ नियंत्रण सूचना: दशाश्वमेध घाट पर अत्यधिक भीड़ है। कृपया गोदौलिया आउटर बाईपास मार्ग का उपयोग करें। पुलिस व सुरक्षा कर्मियों के निर्देशों का पालन करें।",
    messageMr: "गर्दी नियंत्रण सूचना: घाटावर प्रवेश क्षमता पूर्ण झाली आहे. पर्यायी मार्गाचा वापर करा.",
    safeShelters: ["Godowlia Holding Enclosure", "Kashi Vishwanath Helpdesk 4", "Town Hall Open Relief Ground"],
    channels: ["Localized Cell Broadcast", "Public Address Horns", "JEEVAN AI Mobile App"],
    icon: ShieldAlert,
  },
  {
    id: "NDMA-CAP-2026-003",
    type: "FLOOD",
    title: "Central Water Commission Flash Flood Advisory",
    agency: "Central Water Commission (CWC) / State SDRF",
    severity: "MEDIUM",
    status: "RESOLVED",
    timestamp: "Yesterday, 18:00 IST",
    hub: "Mumbai MMR Coastline",
    affectedArea: "Mithi River Catchment, Kurla & Sion Low-Lying Sectors",
    targetPopulation: "~800,000 Residents",
    messageEn: "Water level receding below warning mark. High tide risk averted. Pumping stations operating at full capacity. Transport services resumed normal operations.",
    messageHi: "जलस्तर चेतावनी सीमा से नीचे आ गया है। जलजमाव निकासी जारी है और सामान्य यातायात बहाल कर दिया गया है।",
    messageMr: "पाण्याची पातळी इशारा रेषेखाली आली आहे. वाहतूक पूर्ववत सुरू झाली आहे.",
    safeShelters: ["Municipal School Relief Camps", "Kurla Sports Complex Ground"],
    channels: ["SDRF SMS Service", "Municipal Alert System"],
    icon: CloudLightning,
  },
];

export default function DisasterAlertsPage() {
  const [alerts, setAlerts] = useState<NationalDisasterAlert[]>(INITIAL_ALERTS);
  const [selected, setSelected] = useState<NationalDisasterAlert>(INITIAL_ALERTS[0]);
  const [langTab, setLangTab] = useState<"en" | "hi" | "mr">("en");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "DRAFT" | "RESOLVED">("ALL");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setBroadcastSuccess(true);
      setAlerts((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, status: "ACTIVE", timestamp: `Just now • Broadcasted` } : a))
      );
      setSelected((prev) => ({ ...prev, status: "ACTIVE", timestamp: `Just now • Broadcasted` }));
      setTimeout(() => setBroadcastSuccess(false), 3000);
    }, 1800);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus === "ALL") return true;
    return a.status === filterStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-ink-950 overflow-hidden text-white" data-theme="ink">
      {/* Top Header Bar */}
      <header className="h-14 bg-ink-900 border-b border-ink-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-alert-600/20 border border-alert-500/40 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-alert-400" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-white flex items-center gap-2">
              National Emergency & Disaster Broadcast Portal
            </h1>
            <p className="text-[10px] text-ink-400 font-mono">
              NDMA CAP (Common Alerting Protocol) • Cell Broadcast Service (CBS) & Multi-Channel Feed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge provenance="[LIVE]" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-950 border border-ink-800 text-xs font-mono text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> CBS NATIONAL LINK ACTIVE
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
        {/* Left Column: Alerts Feed */}
        <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
          {/* Filter Bar */}
          <div className="flex gap-1.5 p-1 bg-ink-900 rounded-xl border border-ink-800 text-xs">
            {(["ALL", "ACTIVE", "DRAFT", "RESOLVED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-primary-600 text-white shadow-glow-primary"
                    : "text-ink-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* List of Alerts */}
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
            {filteredAlerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => setSelected(alert)}
                className={`w-full text-left card-elevated p-4 transition-all border ${
                  selected.id === alert.id
                    ? "bg-ink-900 border-primary-500 shadow-glow-primary"
                    : "bg-ink-900/60 border-ink-800 hover:border-ink-700"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      alert.severity === "CRITICAL"
                        ? "bg-alert-600/30 text-alert-400 border border-alert-500/40"
                        : alert.severity === "HIGH"
                        ? "bg-accent-600/30 text-accent-400 border border-accent-500/40"
                        : "bg-primary-600/30 text-primary-400 border border-primary-500/40"
                    }`}
                  >
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                        alert.status === "ACTIVE"
                          ? "bg-alert-950 text-alert-400 border border-alert-800 animate-pulse"
                          : alert.status === "DRAFT"
                          ? "bg-ink-800 text-ink-300 border border-ink-700"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      }`}
                    >
                      {alert.status}
                    </span>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                </div>

                <h3 className="font-display font-bold text-white text-sm line-clamp-1">{alert.title}</h3>
                <p className="text-xs text-ink-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-ink-500" /> {alert.hub}
                </p>
                <p className="text-[10px] text-ink-500 font-mono mt-1">{alert.timestamp}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Alert Broadcast Control Panel */}
        <div className="flex-1 card-elevated bg-ink-900 border-ink-800 flex flex-col overflow-hidden">
          {/* Alert Header */}
          <div className="p-6 border-b border-ink-800 bg-ink-950/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    selected.severity === "CRITICAL"
                      ? "bg-alert-600/20 text-alert-400 border-alert-500/40"
                      : selected.severity === "HIGH"
                      ? "bg-accent-600/20 text-accent-400 border-accent-500/40"
                      : "bg-primary-600/20 text-primary-400 border-primary-500/40"
                  }`}
                >
                  <selected.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-ink-400 bg-ink-800 px-2 py-0.5 rounded">
                      {selected.id}
                    </span>
                    <span className="text-[10px] font-mono text-primary-400 bg-primary-950/60 border border-primary-800 px-2 py-0.5 rounded">
                      {selected.agency}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">{selected.title}</h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-500" /> {selected.affectedArea}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Users className="w-3.5 h-3.5" /> Reach: {selected.targetPopulation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-1">
                <SeverityBadge severity={selected.severity} />
                <span className="text-[10px] font-mono text-ink-400">{selected.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Alert Body & Multilingual Preview */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary-400" /> Public Broadcast Feed (Multi-Lingual)
                </h3>

                {/* Language Switcher Tabs */}
                <div className="flex gap-1 bg-ink-950 p-1 rounded-lg border border-ink-800 text-xs">
                  <button
                    onClick={() => setLangTab("en")}
                    className={`px-2.5 py-1 rounded font-mono ${
                      langTab === "en" ? "bg-primary-600 text-white" : "text-ink-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLangTab("hi")}
                    className={`px-2.5 py-1 rounded font-mono ${
                      langTab === "hi" ? "bg-primary-600 text-white" : "text-ink-400 hover:text-white"
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => setLangTab("mr")}
                    className={`px-2.5 py-1 rounded font-mono ${
                      langTab === "mr" ? "bg-primary-600 text-white" : "text-ink-400 hover:text-white"
                    }`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800 text-white text-sm leading-relaxed font-sans shadow-inner">
                {langTab === "en" && selected.messageEn}
                {langTab === "hi" && selected.messageHi}
                {langTab === "mr" && selected.messageMr}
              </div>
            </div>

            {/* Designated Safe Shelters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Designated Safe Shelters & Relief Points
                </h4>
                <ul className="space-y-1.5 text-xs text-ink-200">
                  {selected.safeShelters.map((shelter, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{shelter}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Channels */}
              <div className="p-4 rounded-xl bg-ink-950 border border-ink-800">
                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-primary-400" /> Authorized Transmission Channels
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.channels.map((chan, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-ink-900 border border-ink-700 text-[11px] font-mono text-ink-300"
                    >
                      {chan}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-ink-950/80 border-t border-ink-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-400 font-mono">
              <Globe className="w-4 h-4 text-primary-400" />
              <span>Target: {selected.affectedArea} ({selected.targetPopulation})</span>
            </div>

            <div className="flex items-center gap-3">
              {broadcastSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Broadcast Successfully Dispatched!
                </span>
              )}

              {selected.status === "DRAFT" ? (
                <button
                  onClick={handleBroadcast}
                  disabled={broadcasting}
                  className="h-11 px-6 rounded-xl bg-alert-600 hover:bg-alert-500 text-white font-display font-bold text-xs flex items-center gap-2 transition-all shadow-glow-alert disabled:opacity-50"
                >
                  {broadcasting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Transmission...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> TRANSMIT CAP CELL BROADCAST
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAlerts((prev) =>
                      prev.map((a) => (a.id === selected.id ? { ...a, status: "RESOLVED" } : a))
                    );
                    setSelected((prev) => ({ ...prev, status: "RESOLVED" }));
                  }}
                  className="h-11 px-6 rounded-xl bg-ink-800 hover:bg-ink-700 text-ink-300 text-xs font-semibold flex items-center gap-2 border border-ink-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
