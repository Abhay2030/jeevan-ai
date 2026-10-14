import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { AlertTriangle, PhoneCall, Stethoscope, ShieldCheck, HeartPulse, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Medical & Emergency Disclaimer | JEEVAN AI",
  description: "Official medical, emergency services, and clinical decision support disclaimers for the JEEVAN AI National Platform.",
};

export default function MedicalDisclaimerPage() {
  return (
    <LegalLayout
      title="Medical & Emergency Disclaimer"
      subtitle="Critical boundaries regarding technological decision support, clinical diagnosis, and emergency response capabilities."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">

        {/* Primary Callout Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3">
          <div className="flex items-center gap-2.5 font-display font-bold text-base sm:text-lg text-amber-900">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            Essential Emergency Notice
          </div>
          <p className="font-medium text-amber-950 text-sm sm:text-base leading-relaxed">
            JEEVAN AI provides technology-assisted public-health intelligence, information, and emergency coordination support. It is not a substitute for qualified medical professionals, emergency services, or official instructions from authorized authorities. AI-generated assessments and recommendations may be incomplete, delayed, or inaccurate and must be evaluated appropriately.
          </p>
          <p className="font-bold text-amber-900 text-sm sm:text-base border-t border-amber-200/80 pt-2">
            Do not rely solely on JEEVAN AI during an emergency. Contact the appropriate local emergency services and follow instructions from authorized responders.
          </p>
        </div>

        {/* 1. Direct Emergency Helpline Advisory */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-alert-600" />
            1. Direct Contact with Emergency Services in India
          </h2>
          <p>
            Submitting a digital report or voice SOS on JEEVAN AI creates a prioritized dispatch ticket in connected control rooms. However, transmission speed depends on local telecommunications and active agency integrations.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-200">
              <span className="text-xs text-ink-500 font-medium block">All Emergencies (Police/Fire/Ambulance)</span>
              <span className="text-xl font-mono font-bold text-alert-600">112</span>
            </div>
            <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-200">
              <span className="text-xs text-ink-500 font-medium block">Medical Ambulance Services</span>
              <span className="text-xl font-mono font-bold text-alert-600">108 / 102</span>
            </div>
            <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-200">
              <span className="text-xs text-ink-500 font-medium block">Fire Services</span>
              <span className="text-xl font-mono font-bold text-amber-600">101</span>
            </div>
            <div className="p-3.5 rounded-xl bg-paper-100 border border-paper-200">
              <span className="text-xs text-ink-500 font-medium block">Disaster Management (NDRF)</span>
              <span className="text-xl font-mono font-bold text-primary-600">1078</span>
            </div>
          </div>
        </section>

        {/* 2. No Doctor-Patient Relationship */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary-600" />
            2. Absence of Doctor-Patient Relationship
          </h2>
          <p>
            Use of the JEEVAN AI website, mobile application, voice calling bot, or triage modules does <strong>not</strong> establish a doctor-patient, healthcare provider-patient, or clinical relationship of any kind.
          </p>
          <p>
            The platform does not engage in the practice of medicine. Content provided—including symptom triage ratings, suggested severity bands, first-aid steps, and hospital distance estimates—is for educational, preliminary sorting, and operational logistical assistance only.
          </p>
        </section>

        {/* 3. First Aid Guidance Limitations */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-alert-500" />
            3. First Aid Instructions Limitations
          </h2>
          <p>
            First-aid instructions provided through voice call agents or offline emergency guides (e.g. CPR chest compressions, bleeding direct pressure, heatstroke recovery positioning) are standardized basic protocols derived from international emergency medical consensus.
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>These instructions assume a layperson bystander providing immediate bridging support prior to the arrival of licensed paramedics.</li>
            <li>Individual patient factors (such as spinal trauma, underlying cardiovascular pathology, allergic sensitivities, or pregnancy) may require specialized medical interventions that cannot be evaluated by automated systems.</li>
            <li>If you are unsure of how to perform an action safely, wait for trained paramedics and follow verbal instructions provided over official emergency telephone lines.</li>
          </ul>
        </section>

        {/* 4. Verification of Hospital Data */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success-600" />
            4. Hospital Capacity &amp; Resource Availability Verification
          </h2>
          <p>
            Information displayed regarding hospital ICU bed availability, oxygen reserves, ventilator counts, blood inventory, and ambulance transit times is aggregated from connected hospital management systems, public health registry feeds, and field dispatcher inputs.
          </p>
          <p>
            Because facility load changes rapidly during mass casualty incidents, resource numbers must be verified with the receiving hospital before diverting critical patients, unless an authorized Command Center dispatcher has locked in an electronic bed transfer.
          </p>
        </section>

        {/* 5. Developer Attribution */}
        <section className="pt-4 border-t border-paper-200">
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
