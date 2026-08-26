"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Send, Globe, Shield, Bot, User } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

interface Message { id: string; sender: "user" | "ai"; text: string; actions?: string[]; }

const initial: Message[] = [
  { id: "1", sender: "ai", text: "Namaste. I am JEEVAN AI Voice Assistant. How can I help you today? You can speak in Hindi, English, or Marathi.", actions: ["I need an ambulance", "Someone is injured", "I feel unwell"] },
];

export default function VoiceAssistant() {
  const [msgs, setMsgs] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [listening, setListening] = useState(false);

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    // eslint-disable-next-line react-hooks/purity
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: text.trim() };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: text.toLowerCase().includes("ambulance") || text.toLowerCase().includes("injured")
          ? "I understand this is urgent. I am preparing emergency assistance. Can you tell me — is the person conscious and breathing?"
          : text.toLowerCase().includes("unwell") || text.toLowerCase().includes("feel")
          ? "I understand you're not feeling well. Can you describe your main symptom? For example: chest pain, difficulty breathing, fever, or dizziness."
          : "I understand. Please tell me more about the situation so I can help you better.",
        actions: ["Yes, they are conscious", "No, they are not", "I'm not sure"],
      };
      setMsgs(prev => [...prev, aiReply]);
    }, 1200);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="medical">
      <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
        <Link href="/emergency" className="w-9 h-9 rounded-xl bg-paper-200 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-ink-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-display font-bold text-ink-900">Voice Assistant</h1>
          <p className="text-xs text-primary-600 font-medium">AI Medical Assistance</p>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)} className="h-8 px-2 rounded-lg border border-paper-300 text-xs font-medium bg-white">
          {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full space-y-4">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${m.sender === "user" ? "" : ""}`}>
              {/* Conversational Card (not chat bubble) */}
              <div className={`rounded-2xl p-5 shadow-sm ${m.sender === "user" ? "bg-primary-600 text-white" : "card-elevated"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {m.sender === "ai" ? (
                    <><div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-primary-600" /></div><span className="text-xs font-semibold text-primary-600">JEEVAN AI</span></>
                  ) : (
                    <><div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-white" /></div><span className="text-xs font-semibold text-white/80">You</span></>
                  )}
                </div>
                <p className="text-base leading-relaxed">{m.text}</p>
              </div>
              {/* Quick reply buttons */}
              {m.actions && m.sender === "ai" && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.actions.map(a => (
                    <button key={a} onClick={() => sendMsg(a)} className="px-4 py-2.5 rounded-xl bg-white border border-paper-300 text-sm font-medium text-ink-600 hover:border-primary-400 hover:text-primary-600 transition-all shadow-xs">
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <div className="sticky bottom-0 glass p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setListening(!listening)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${listening ? "bg-alert-600 text-white animate-sos-pulse" : "bg-paper-200 text-ink-500 hover:bg-paper-300"}`}
          >
            {listening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <form onSubmit={e => { e.preventDefault(); sendMsg(input); }} className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-paper-300 px-3">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type or speak..." className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-ink-200" />
            <button type="submit" disabled={!input.trim()} className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
