import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { Eye, CheckCircle2, Monitor, Smartphone, Keyboard, Volume2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement | JEEVAN AI",
  description: "Accessibility standards, WCAG 2.2 AA alignment, and inclusive design principles of the JEEVAN AI Platform.",
};

export default function AccessibilityStatementPage() {
  return (
    <LegalLayout
      title="Accessibility Statement"
      subtitle="Our commitment to ensuring that critical emergency intelligence and life-saving tools are accessible to all individuals across India."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">

        {/* Commitment Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-paper-100 border border-paper-200 text-ink-900 space-y-2">
          <div className="flex items-center gap-2.5 font-display font-bold text-base sm:text-lg">
            <Eye className="w-6 h-6 text-primary-600 shrink-0" />
            Inclusive Design for Crisis Situations
          </div>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
            In an emergency, every second counts. Physical stress, sensory impairment, loud sirens, bright sunlight, or low-cost mobile screens should never prevent a citizen from requesting help. JEEVAN AI is built from the ground up to conform with the <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>.
          </p>
        </div>

        {/* 1. Core Technical Accessibility Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success-600" />
            1. Core Accessibility Standards Implemented
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-white border border-paper-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Monitor className="w-4 h-4 text-primary-600" />
                Color Contrast &amp; Typography
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                All citizen-facing text satisfies or exceeds the minimum 4.5:1 contrast ratio against background surfaces. High-priority alerts utilize a 7:1 ratio. Fonts are set in legible geometric sans-serifs (Space Grotesk and IBM Plex Sans) with relative rem units.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-paper-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Smartphone className="w-4 h-4 text-alert-600" />
                Touch Target Dimensions
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Emergency activation triggers (such as the Hold-to-Activate SOS button) provide a minimum touch target of 48×48 physical pixels, allowing rapid, error-free operation even when users are trembling or wearing protective gloves.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-paper-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Keyboard className="w-4 h-4 text-accent-600" />
                Keyboard Operability
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Every interactive element is fully navigable via standard Tab, Shift+Tab, and Enter keyboard inputs, supported by high-visibility outline focus rings that stand out in both light and dark operational themes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-paper-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Volume2 className="w-4 h-4 text-primary-600" />
                Screen Reader Compatibility
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                HTML5 semantic structural landmarks (&lt;header&gt;, &lt;main&gt;, &lt;nav&gt;, &lt;article&gt;, &lt;footer&gt;) and WAI-ARIA live regions (<code className="font-mono text-xs">aria-live=&quot;assertive&quot;</code>) ensure screen readers immediately announce emergency status changes.
              </p>
            </div>

          </div>
        </section>

        {/* 2. Low-Bandwidth & Multilingual Access */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            2. Low-Bandwidth, Offline &amp; Multilingual Accessibility
          </h2>
          <p>
            Accessibility in India requires accommodating diverse linguistic backgrounds and intermittent 2G/3G mobile connectivity:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Multilingual Natural Voice Assistance:</strong> Voice emergency intake modules support natural speech in Hindi, Marathi, and English, allowing non-literate citizens to report distress simply by speaking.
            </li>
            <li>
              <strong>Offline-First Emergency Fallback:</strong> The Progressive Web Application (PWA) caches emergency guides and local triage forms so citizens can view critical instructions without active cellular reception.
            </li>
            <li>
              <strong>Reduced Motion Support:</strong> The interface honors the user&apos;s operating system setting for <code className="font-mono text-xs">prefers-reduced-motion</code>, disabling rapid transitions that could trigger vestibular disorientation.
            </li>
          </ul>
        </section>

        {/* 3. Feedback & Continual Improvement */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            3. Feedback &amp; Contact
          </h2>
          <p>
            We continually evaluate the platform using automated axe-core accessibility auditing, manual screen-reader testing (NVDA, TalkBack), and keyboard navigation sweeps. If you encounter any accessibility barrier or have suggestions for improvement, please notify the development team:
          </p>
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-ink-900">JEEVAN AI Technology &amp; Architecture Group</p>
            <p className="text-ink-600">Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane.</p>
            <p className="text-ink-500">Designed and developed with a focus on AI-powered public health intelligence, emergency coordination, and responsible technology.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
