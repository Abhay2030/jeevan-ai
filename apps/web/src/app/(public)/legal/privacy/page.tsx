import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { Shield, Lock, MapPin, Database, UserCheck, AlertCircle, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | JEEVAN AI",
  description: "Privacy policy and data protection framework for the JEEVAN AI National Public Health & Emergency Intelligence Platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy & Data Protection Policy"
      subtitle="How JEEVAN AI collects, processes, and protects information in accordance with Indian data protection laws and emergency public safety necessities."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">
        
        {/* Important Notice Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-primary-50 border border-primary-200 text-primary-950 space-y-2">
          <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-base text-primary-900">
            <Shield className="w-5 h-5 text-primary-700" />
            Commitment to Responsible Data Processing
          </div>
          <p className="text-xs sm:text-sm text-primary-900 leading-relaxed">
            JEEVAN AI is an intelligence and coordination platform designed to protect human life during emergencies. We adhere to the fundamental principles of data minimization, purpose limitation, and storage limitation under the Digital Personal Data Protection Act, 2023 (DPDPA) of India.
          </p>
        </div>

        {/* 1. Scope & Applicability */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            1. Scope &amp; Applicability
          </h2>
          <p>
            This Privacy Policy applies to all users of the <strong>JEEVAN AI — National Public Health &amp; Emergency Intelligence Platform</strong>, including members of the public seeking emergency assistance, bystanders reporting incidents, field responders, healthcare operators, and authorized command center personnel.
          </p>
          <p>
            This policy governs digital interactions across the JEEVAN AI progressive web application (PWA), mobile client builds (Android/iOS via Capacitor), voice hotline interfaces, and administrative dashboards.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            2. Categories of Information Collected
          </h2>
          <p>
            To provide life-saving emergency dispatch and public health surveillance, JEEVAN AI collects the following categories of information:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <MapPin className="w-4 h-4 text-alert-600" />
                Geospatial &amp; Location Data
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Precise GPS coordinates (latitude/longitude), nearest civic landmarks, or manually submitted addresses when a user triggers an Emergency SOS or incident report. Precise GPS is only retrieved with explicit browser/device permission.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <AlertCircle className="w-4 h-4 text-accent-600" />
                Emergency Incident Reports
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Type of hazard (medical, road collision, fire, flood, etc.), descriptive triage details, caller contact numbers (where supplied), victim counts, and severity indications.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Server className="w-4 h-4 text-primary-600" />
                Technical &amp; Device Telemetry
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                Network connection state (online/offline), device client type, preferred interface language, and anonymized diagnostic logs required to maintain edge queue reliability.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-ink-900 text-sm">
                <Lock className="w-4 h-4 text-ink-700" />
                Authorized Personnel Credentials
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">
                For registered responders, doctors, and command officers: official work email, full name, phone number, designated district/state jurisdiction, agency role, and cryptographically hashed passwords.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Legal Basis for Processing */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            3. Legal Basis under Indian Law (DPDPA 2023)
          </h2>
          <p>
            Under the <strong>Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)</strong> of India, personal data is processed under the following legitimate grounds:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Consent (Section 6):</strong> When users voluntarily register an account, offer blood donation assistance, join the volunteer guardian network, or activate browser location sharing.
            </li>
            <li>
              <strong>Medical Emergencies &amp; Threat to Life (Section 7(d)):</strong> For responding to medical emergencies involving a breakdown or immediate threat to the life or health of the data principal or another individual.
            </li>
            <li>
              <strong>Disaster &amp; Public Safety Interventions (Section 7(e)):</strong> For taking measures to provide medical care, relief, or public safety services during epidemics, natural disasters, or major public emergencies.
            </li>
          </ul>
        </section>

        {/* 4. Purpose of Processing */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            4. Purpose of Data Processing
          </h2>
          <p>Information collected by JEEVAN AI is utilized exclusively for:</p>
          <ol className="list-decimal pl-6 space-y-1.5 text-sm text-ink-700">
            <li>Routing emergency dispatches to the nearest qualified field responders and ambulances.</li>
            <li>Predictive public health modeling (e.g. projecting hospital bed demand and heatwave casualties).</li>
            <li>Triaging mass casualty situations and dynamically clearing traffic smart corridors.</li>
            <li>Verifying the accuracy and truthfulness of reported incidents to prevent hoax alarms.</li>
            <li>Auditing response times and post-incident resolution metrics for accountability.</li>
          </ol>
        </section>

        {/* 5. Third-Party Integrations */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            5. Third-Party Infrastructure &amp; Data Transfers
          </h2>
          <p>
            JEEVAN AI utilizes select specialized third-party services to deliver real-time capabilities. Data is transferred strictly on a need-to-know basis:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-ink-700">
            <li>
              <strong>Telephony Providers (e.g. Twilio):</strong> For routing emergency voice calls and delivering SMS dispatch notices.
            </li>
            <li>
              <strong>AI &amp; Speech Models (e.g. Google Gemini API / FastWhisper):</strong> For transcribing multilingual voice emergency calls (Hindi, Marathi, English) and extracting triage parameters. Spoken voice audio is processed ephemerally and not used for public model training.
            </li>
            <li>
              <strong>Cartographic Services (OpenStreetMap / MapLibre):</strong> Base map vector tiles are fetched directly to render operational maps without transmitting personal user identities to tile servers.
            </li>
          </ul>
        </section>

        {/* 6. Data Retention & Deletion */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            6. Retention, Storage &amp; Deletion
          </h2>
          <p>
            Emergency incident records and geospatial coordinates are stored in secure PostgreSQL/PostGIS databases located in certified data centers within India to respect data localization standards.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>
              <strong>Live Incident Logs:</strong> Maintained during active response and archived after case resolution for legal auditing and public health retrospective reviews.
            </li>
            <li>
              <strong>Audio Transcriptions:</strong> Call audio streams are transiently buffered and converted to structured tickets; raw audio is deleted per configured agency retention cycles.
            </li>
            <li>
              <strong>User Data Deletion:</strong> Registered volunteers and non-command users may request deletion of their account profiles by contacting authorized system administrators.
            </li>
          </ul>
        </section>

        {/* 7. Security Safeguards */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            7. Information Security Safeguards
          </h2>
          <p>
            We implement technical and organizational controls aligned with industry standards:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-paper-100 border border-paper-200 text-xs space-y-1">
              <span className="font-semibold text-ink-900 block">Encryption in Transit</span>
              <span className="text-ink-600">Enforced TLS 1.3 / HTTPS across all API endpoints and WebSocket channels.</span>
            </div>
            <div className="p-3 rounded-xl bg-paper-100 border border-paper-200 text-xs space-y-1">
              <span className="font-semibold text-ink-900 block">RBAC &amp; Tenant Boundaries</span>
              <span className="text-ink-600">Granular role-based token validation preventing cross-district data leakage.</span>
            </div>
            <div className="p-3 rounded-xl bg-paper-100 border border-paper-200 text-xs space-y-1">
              <span className="font-semibold text-ink-900 block">No Wildcard CORS</span>
              <span className="text-ink-600">Restricted origins preventing unauthorized third-party cross-origin scraping.</span>
            </div>
          </div>
        </section>

        {/* 8. Cookies & Local Storage */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            8. Cookies, IndexedDB &amp; Local Storage
          </h2>
          <p>
            JEEVAN AI does <strong>not</strong> use advertising cookies or third-party behavioral trackers. Local storage and IndexedDB are utilized strictly for functional operations:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>Offline queueing of emergency reports when internet connectivity is interrupted.</li>
            <li>Caching offline map bounding boxes and first-aid instructions.</li>
            <li>Persisting secure JWT session tokens for authenticated responders.</li>
          </ul>
        </section>

        {/* 9. Contact & Grievance Redressal */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            9. Grievance Redressal &amp; Inquiries
          </h2>
          <p>
            In compliance with Section 10 of the Digital Personal Data Protection Act, 2023, data principals seeking clarification on privacy practices or reporting data concerns may submit formal communications to the designated platform administrator.
          </p>
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-ink-900">JEEVAN AI Technology &amp; Architecture Group</p>
            <p className="text-ink-600">Project Leads: Abhay Sachin Donde &amp; Vedant Santosh Kokane</p>
            <p className="text-ink-500">Notice: For production state/district deployments, primary data controllers are the respective deploying authorities.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
