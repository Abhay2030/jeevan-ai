"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, HeartPulse, Droplets, Flame, Wind,
  Brain, Bone, Car, ChevronRight, AlertTriangle,
  CheckCircle2, ArrowRight, Shield
} from "lucide-react";

interface Guide {
  id: string; title: string; icon: React.ElementType; color: string;
  severity: string; steps: { title: string; desc: string; warning?: string }[];
}

const guides: Guide[] = [
  { id: "bleeding", title: "Severe Bleeding", icon: Droplets, color: "bg-alert-600", severity: "CRITICAL",
    steps: [
      { title: "Apply Direct Pressure", desc: "Use a clean cloth or bandage. Press firmly on the wound with both hands." },
      { title: "Don't Remove the Cloth", desc: "If blood soaks through, add more layers on top. Never remove the first cloth.", warning: "Do NOT apply a tourniquet unless trained" },
      { title: "Elevate If Possible", desc: "If the wound is on a limb, raise it above heart level while maintaining pressure." },
      { title: "Keep Patient Calm & Warm", desc: "Cover them with a blanket. Talk reassuringly. Monitor their breathing." },
      { title: "Wait for Help", desc: "Continue pressure until emergency responders arrive. Do not leave the patient alone." },
    ]},
  { id: "burns", title: "Burns", icon: Flame, color: "bg-accent-600", severity: "HIGH",
    steps: [
      { title: "Cool the Burn", desc: "Run cool (not cold) water over the burn for at least 20 minutes.", warning: "Do NOT use ice, butter, or toothpaste" },
      { title: "Remove Clothing Carefully", desc: "Remove clothing near the burn unless it's stuck to the skin." },
      { title: "Cover with Clean Cloth", desc: "Use a sterile non-stick bandage or clean cloth. Do not pop blisters." },
      { title: "Monitor for Shock", desc: "Watch for pale skin, rapid breathing, or confusion. Keep patient warm." },
    ]},
  { id: "choking", title: "Choking", icon: Wind, color: "bg-primary-700", severity: "CRITICAL",
    steps: [
      { title: "Ask 'Are You Choking?'", desc: "If they can cough forcefully, encourage them to keep coughing." },
      { title: "5 Back Blows", desc: "Stand behind them. Give 5 sharp blows between the shoulder blades with the heel of your hand." },
      { title: "5 Abdominal Thrusts", desc: "Make a fist above the navel. Grasp with the other hand and thrust inward and upward.", warning: "For pregnant women or obese patients, use chest thrusts instead" },
      { title: "Repeat Until Clear", desc: "Alternate between 5 back blows and 5 abdominal thrusts until the object is expelled." },
    ]},
  { id: "fainting", title: "Fainting", icon: Brain, color: "bg-purple-600", severity: "MEDIUM",
    steps: [
      { title: "Lay Them Down", desc: "Place the person on their back. Raise their legs about 12 inches." },
      { title: "Check Breathing", desc: "Ensure their airway is clear. Loosen any tight clothing." },
      { title: "Cool Them Down", desc: "Apply a cool, damp cloth to the forehead. Fan them gently." },
      { title: "Recovery Position", desc: "When they regain consciousness, have them sit up slowly. Give them water." },
    ]},
  { id: "fractures", title: "Fractures", icon: Bone, color: "bg-ink-600", severity: "HIGH",
    steps: [
      { title: "Don't Move the Limb", desc: "Immobilize the injured area. Do not attempt to straighten the bone.", warning: "Moving could cause further damage to nerves and blood vessels" },
      { title: "Apply Ice (Wrapped)", desc: "Apply ice wrapped in cloth for 20 minutes to reduce swelling." },
      { title: "Improvise a Splint", desc: "Use a rigid material (stick, rolled newspaper) to support the limb. Tie gently above and below." },
      { title: "Treat for Shock", desc: "Keep them warm and calm. Elevate legs if possible without disturbing the injury." },
    ]},
  { id: "road-accident", title: "Road Accidents", icon: Car, color: "bg-alert-700", severity: "CRITICAL",
    steps: [
      { title: "Ensure Your Safety First", desc: "Check for traffic. Turn on hazard lights. Place warning triangles if available.", warning: "Do NOT move the victim unless there is immediate danger (fire, traffic)" },
      { title: "Call 112 Immediately", desc: "Report exact location, number of injured, and visible injuries." },
      { title: "Control Bleeding", desc: "Apply pressure to any visible bleeding wounds. Do not remove objects embedded in wounds." },
      { title: "Keep Airway Open", desc: "Tilt head back gently to open airway. Check for breathing." },
      { title: "Keep Patient Still", desc: "Do not move their neck or spine. Talk to them reassuringly until help arrives." },
    ]},
];

export default function FirstAidGuide() {
  const [selected, setSelected] = useState<Guide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  if (selected) {
    return (
      <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
        <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
          <button onClick={() => { setSelected(null); setCompletedSteps(new Set()); }} className="w-9 h-9 rounded-xl bg-paper-200 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-ink-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-display font-bold text-ink-900">{selected.title}</h1>
            <p className="text-xs text-ink-300">{completedSteps.size}/{selected.steps.length} steps completed</p>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-bold text-white ${selected.severity === "CRITICAL" ? "bg-alert-600" : selected.severity === "HIGH" ? "bg-accent-600" : "bg-primary-600"}`}>
            {selected.severity}
          </div>
        </header>

        {/* Progress bar */}
        <div className="h-1 bg-paper-200">
          <div className="h-1 bg-primary-500 transition-all duration-500" style={{ width: `${(completedSteps.size / selected.steps.length) * 100}%` }} />
        </div>

        <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          <div className="space-y-4">
            {selected.steps.map((step, i) => (
              <button
                key={i}
                onClick={() => toggleStep(i)}
                className={`w-full text-left card-elevated p-5 flex gap-4 transition-all ${completedSteps.has(i) ? "ring-2 ring-success-300 bg-success-50/30" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-lg ${completedSteps.has(i) ? "bg-success-500 text-white" : "bg-primary-100 text-primary-600"}`}>
                  {completedSteps.has(i) ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-display font-bold text-sm ${completedSteps.has(i) ? "text-success-700 line-through" : "text-ink-900"}`}>{step.title}</h3>
                  <p className="text-sm text-ink-300 mt-1 leading-relaxed">{step.desc}</p>
                  {step.warning && (
                    <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-accent-50 border border-accent-200">
                      <AlertTriangle className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-accent-700 font-medium">{step.warning}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {completedSteps.size === selected.steps.length && (
            <div className="mt-8 card-elevated p-6 text-center bg-success-50 border-success-200 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-success-500 mx-auto mb-3" />
              <h3 className="font-display font-bold text-success-800 mb-1">All Steps Completed</h3>
              <p className="text-sm text-success-600">Continue monitoring until professional help arrives.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col" data-theme="paper">
      <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
        <Link href="/emergency" className="w-9 h-9 rounded-xl bg-paper-200 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-ink-500" />
        </Link>
        <div>
          <h1 className="text-lg font-display font-bold text-ink-900">First Aid Guide</h1>
          <p className="text-xs text-ink-300">Help Until Help Arrives</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="card-elevated p-4 mb-6 flex items-center gap-3 bg-accent-50 border-accent-200">
          <AlertTriangle className="w-5 h-5 text-accent-600 shrink-0" />
          <p className="text-xs text-accent-700 font-medium">These guides supplement — not replace — professional medical care. Always call 112 first.</p>
        </div>

        <div className="space-y-3">
          {guides.map(g => (
            <button
              key={g.id}
              onClick={() => setSelected(g)}
              className="w-full card-elevated p-4 flex items-center gap-4 group card-interactive text-left"
            >
              <div className={`w-11 h-11 rounded-xl ${g.color} flex items-center justify-center shadow-md`}>
                <g.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-ink-900 text-sm">{g.title}</h3>
                <p className="text-xs text-ink-300 mt-0.5">{g.steps.length} steps • {g.severity}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-200 group-hover:text-primary-500 transition-colors" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
