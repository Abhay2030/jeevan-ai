"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Stethoscope } from "lucide-react";
import { Button, SOSButton } from "@jeevan-ai/ui";
import { apiFetch } from "../../lib/api";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: string;
}

export default function PublicTriageHome() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello. I am the JEEVAN AI Medical Assistant. Please describe your symptoms or emergency. If this is life-threatening, press the SOS button below immediately.",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // POST to the unauthenticated Triage endpoint
      const res = await apiFetch<{ response: string; action?: string }>("/triage/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg.text }),
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.response,
        action: res.action,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "bot", text: "I'm having trouble connecting to the network. Please try again or locate a medical tent." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = async (lat: number, lng: number) => {
    // Post an anonymous critical incident
    // Because we are public, we use a generic title and description
    await apiFetch("/incidents", {
      method: "POST",
      body: JSON.stringify({
        title: "PUBLIC SOS",
        description: "User triggered SOS from Triage App.",
        severity: "CRITICAL",
        status: "NEW",
        location: { latitude: lat, longitude: lng }
      }),
    });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface-bg font-sans" data-theme="medical">
      {/* Header */}
      <header className="bg-primary-600 text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Stethoscope size={28} />
          <div>
            <h1 className="text-xl font-display font-bold">JEEVAN Triage</h1>
            <p className="text-xs text-primary-100">Medical Assistance</p>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col p-4 gap-4 max-w-2xl mx-auto w-full relative z-10 overflow-hidden">
        
        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pb-4 px-2 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`
                  flex gap-3 max-w-[85%] 
                  ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}
                `}
              >
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1
                  ${msg.sender === "user" ? "bg-primary-500 text-white" : "bg-surface-card border border-surface-border text-primary-600"}
                `}>
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`
                  p-3 rounded-2xl text-base shadow-sm
                  ${msg.sender === "user" 
                    ? "bg-primary-500 text-white rounded-tr-sm" 
                    : "bg-surface-card text-surface-text border border-surface-border rounded-tl-sm"}
                `}>
                  <p>{msg.text}</p>
                  
                  {/* Action Highlights */}
                  {msg.action === "TRIGGER_SOS" && (
                    <div className="mt-2 p-2 bg-alert-50 border border-alert-200 rounded text-alert-700 text-sm font-semibold">
                      ACTION REQUIRED: Trigger SOS immediately.
                    </div>
                  )}
                  {msg.action === "SEEK_MEDICAL_TENT" && (
                    <div className="mt-2 p-2 bg-primary-50 border border-primary-200 rounded text-primary-700 text-sm font-semibold">
                      ACTION REQUIRED: Proceed to Medical Tent.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex w-full justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-card border border-surface-border text-primary-600 flex items-center justify-center mt-1">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl bg-surface-card border border-surface-border rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="bg-surface-card p-2 rounded-full border border-surface-border shadow-sm flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-surface-text placeholder-ink-400"
            disabled={loading}
          />
          <Button type="submit" variant="primary" size="sm" disabled={!input.trim() || loading} className="rounded-full w-10 h-10 p-0 flex items-center justify-center flex-shrink-0">
            <Send size={18} className="ml-0.5" />
          </Button>
        </form>
      </main>

      {/* Floating SOS Button Container */}
      <div className="p-4 bg-surface-bg border-t border-surface-border sticky bottom-0 z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto">
          <SOSButton onTrigger={handleSOS} />
        </div>
      </div>
    </div>
  );
}
