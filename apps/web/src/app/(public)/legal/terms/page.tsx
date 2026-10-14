import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { Scale, AlertTriangle, ShieldAlert, CheckCircle, Ban, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use | JEEVAN AI",
  description: "Terms of Use and conditions governing access to the JEEVAN AI National Public Health & Emergency Intelligence Platform.",
};

export default function TermsOfUsePage() {
  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Operational rules, legal responsibilities, and conditions governing the use of the JEEVAN AI platform."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">

        {/* Legal Warning Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-alert-50 border border-alert-200 text-alert-950 space-y-2">
          <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-base text-alert-900">
            <ShieldAlert className="w-5 h-5 text-alert-700" />
            Statutory Notice: Strict Prohibition on False or Hoax Alarms
          </div>
          <p className="text-xs sm:text-sm text-alert-900 leading-relaxed">
            Submitting false, fabricated, or malicious emergency reports is a severe offense. Under <strong>Section 54 of the Disaster Management Act, 2005</strong> and applicable provisions of the <strong>Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code</strong>, circulating false alarms or warnings regarding disasters or public emergencies carries severe penal consequences, including imprisonment and fines.
          </p>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the <strong>JEEVAN AI — National Public Health &amp; Emergency Intelligence Platform</strong> (the &quot;Platform&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must not access or use the platform.
          </p>
          <p>
            These terms apply to all visitors, registered responders, medical dispatchers, command officers, and volunteers across India.
          </p>
        </section>

        {/* 2. Permitted Uses */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            2. Permitted Uses
          </h2>
          <p>The Platform is provided exclusively for the following lawful purposes:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>Requesting genuine emergency assistance for medical crises, accidents, fires, or natural hazards.</li>
            <li>Reporting real-world hazards as a civic bystander in good faith.</li>
            <li>Coordinating emergency fleet dispatches, hospital transfers, and triage operations.</li>
            <li>Volunteering for authorized community emergency assistance and emergency blood donation networks.</li>
            <li>Analyzing aggregate public health trends and participating in authorized disaster simulation drills.</li>
          </ul>
        </section>

        {/* 3. Prohibited Activities */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2 text-alert-700">
            <Ban className="w-5 h-5" />
            3. Prohibited Conduct
          </h2>
          <p>Users must not engage in any of the following activities:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Fabricated or Hoax Submissions:</strong> Generating simulated or false SOS signals, fake flood/fire reports, or misleading bystander claims.
            </li>
            <li>
              <strong>Platform Sabotage &amp; Denial of Service:</strong> Flooding API endpoints, launching DDoS attacks, or overloading emergency telephony lines.
            </li>
            <li>
              <strong>Reverse Engineering &amp; Scraping:</strong> Automated scraping of personal responder data, hospital capacity records, or unauthorized penetration testing of live production systems.
            </li>
            <li>
              <strong>Impersonation:</strong> Falsely claiming to be a police officer, paramedic, district magistrate, or government emergency official.
            </li>
          </ul>
        </section>

        {/* 4. Nature of AI Decision Support */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" />
            4. Nature of AI Decision Support &amp; Human Authorization
          </h2>
          <p>
            JEEVAN AI utilizes artificial intelligence algorithms (including natural language understanding, spatial clustering, and time-series forecasting) to provide <strong>assistive decision support only</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>AI outputs are probabilistic estimations, not infallible operational directives.</li>
            <li>
              <strong>Mandatory Human Authorization:</strong> Consequential actions—such as hospital bed reallocations, major traffic corridor closures, or mass civic evacuation warnings—must be independently reviewed and authorized by designated human command personnel.
            </li>
            <li>The platform does not diagnose medical diseases or replace clinical triage by licensed physicians.</li>
          </ul>
        </section>

        {/* 5. Service Availability & Connectivity */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            5. Service Availability &amp; Edge Network Dependencies
          </h2>
          <p>
            Emergency operations depend on physical telecommunications infrastructure, cellular connectivity, GPS satellite signals, and regional power grids.
          </p>
          <p>
            While JEEVAN AI incorporates offline-first caching, local SMS failover, and lightweight edge queueing, the platform cannot guarantee 100% uninterrupted uptime or zero-latency transmission during extreme natural disasters or network backhaul severed events.
          </p>
          <p className="font-semibold text-ink-900">
            During any life-threatening emergency, always attempt primary communication with local emergency phone lines (112 / 108 / 101) directly.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable Indian law, the creators, contributors, developers, and operators of JEEVAN AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of life, injury, property damage, or operational delays arising out of:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-ink-700">
            <li>The use or inability to use the platform.</li>
            <li>Any inaccuracies or delays in third-party map data, GPS satellite multipath errors, or simulated crowd projections.</li>
            <li>Failure of telecommunications carriers or edge device hardware.</li>
            <li>Actions taken or omitted by emergency responders, healthcare facilities, or public authorities.</li>
          </ul>
        </section>

        {/* 7. Modifications & Legal Review */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            7. Amendments &amp; Legal Review
          </h2>
          <p>
            These Terms of Use may be revised periodically to incorporate updates in technological architecture or changes in statutory disaster management frameworks. Continued use of the platform after updates constitutes acceptance of the amended terms.
          </p>
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-ink-900">Developer &amp; Architectural Attribution</p>
            <p className="text-ink-600">Architected &amp; Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane.</p>
            <p className="text-ink-500">Notice: Prior to full-scale civic or governmental deployment, these terms should be customized and ratified under a formal service-level agreement with competent legal authorities.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
