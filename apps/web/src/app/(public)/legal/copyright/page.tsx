import React from "react";
import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { Shield, Sparkles, FileCode, CheckCircle, Info, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Intellectual Property & Copyright Notice | JEEVAN AI",
  description: "Intellectual property ownership, open-source software acknowledgments, and developer attribution for JEEVAN AI.",
};

export default function CopyrightNoticePage() {
  const currentYear = new Date().getFullYear();

  return (
    <LegalLayout
      title="Intellectual Property & Copyright Notice"
      subtitle="Authorship, copyright ownership, open-source software acknowledgments, and usage permissions for the JEEVAN AI project."
      lastUpdated="October 2026"
    >
      <div className="space-y-8 text-ink-700 leading-relaxed text-sm sm:text-base">

        {/* Primary Copyright Statement */}
        <div className="p-5 sm:p-6 rounded-2xl bg-paper-100 border border-paper-200 text-ink-900 space-y-3">
          <div className="flex items-center gap-2.5 font-display font-bold text-base sm:text-lg">
            <Shield className="w-6 h-6 text-primary-600 shrink-0" />
            Project Copyright Notice
          </div>
          <p className="font-mono text-sm text-primary-800 font-semibold">
            &copy; {currentYear} JEEVAN AI. All rights reserved.
          </p>
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-sm text-ink-700 leading-relaxed">
            &ldquo;Unless otherwise stated, original materials created specifically for the JEEVAN AI project are protected by applicable intellectual property laws. Reproduction, redistribution, or commercial use of protected project materials requires appropriate authorization, except where permitted by law or an applicable license.&rdquo;
          </blockquote>
        </div>

        {/* 1. Developer Attribution */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            1. Developer Attribution &amp; Authorship
          </h2>
          <div className="p-4 rounded-xl bg-white border border-paper-200 shadow-sm space-y-2">
            <p className="font-display font-bold text-ink-900 text-base">
              Developed by Abhay Sachin Donde &amp; Vedant Santosh Kokane
            </p>
            <p className="text-sm text-ink-600 leading-relaxed">
              Designed and developed with a focus on AI-powered public health intelligence, emergency coordination, and responsible technology.
            </p>
            <p className="text-xs text-ink-500 pt-1 leading-relaxed">
              The architecture, software system engineering, multimodal emergency interfaces, and machine learning integration workflows of JEEVAN AI represent the original collaborative work of the authors for public emergency decision support.
            </p>
          </div>
        </section>

        {/* 2. Scope of Protected Original Materials */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            2. Scope of Protected Project Materials
          </h2>
          <p>
            Original intellectual property created specifically for the JEEVAN AI platform encompasses:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm text-ink-700">
            <li>Original software source code developed within the frontend application, backend microservices, and edge voice engines.</li>
            <li>Original user experience layouts, responsive design tokens, and user interface workflows designed for field responders and command personnel.</li>
            <li>Project-specific documentation, technical specifications, and architectural diagrams.</li>
            <li>The &quot;JEEVAN AI&quot; project branding, visual logo styling, and product identity.</li>
          </ul>
          <p className="text-xs text-ink-500">
            Notice: No claim is made to a registered trademark, incorporation certificate, or official government registry number. All rights are asserted under applicable copyright and intellectual property statutes.
          </p>
        </section>

        {/* 3. Open-Source & Third-Party Acknowledgments */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary-600" />
            3. Open-Source Software &amp; Third-Party Attributions
          </h2>
          <p>
            JEEVAN AI is built upon the foundation of outstanding open-source software libraries, frameworks, and public datasets. The authors gratefully acknowledge and respect the licenses of these third-party works, which remain the property of their respective copyright holders:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">Next.js &amp; React</span>
              <span className="text-ink-600">Copyright &copy; Vercel, Inc. &amp; Meta Platforms, Inc. Licensed under the MIT License.</span>
            </div>
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">Tailwind CSS</span>
              <span className="text-ink-600">Copyright &copy; Tailwind Labs Inc. Licensed under the MIT License.</span>
            </div>
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">MapLibre GL &amp; Turf.js</span>
              <span className="text-ink-600">Licensed under BSD-3-Clause and MIT Licenses. Base map cartography &copy; OpenStreetMap contributors.</span>
            </div>
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">FastAPI, Pydantic &amp; SQLAlchemy</span>
              <span className="text-ink-600">Copyright &copy; Tiangolo and contributors. Licensed under the MIT License.</span>
            </div>
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">Lucide Icons</span>
              <span className="text-ink-600">Copyright &copy; Lucide Project. Licensed under the ISC License.</span>
            </div>
            <div className="p-3 rounded-lg bg-paper-100 border border-paper-200 space-y-1">
              <span className="font-semibold text-ink-900 block">IBM Plex Fonts &amp; Space Grotesk</span>
              <span className="text-ink-600">Licensed under the SIL Open Font License (OFL-1.1).</span>
            </div>
          </div>
        </section>

        {/* 4. Permissions & Commercial Inquiries */}
        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-ink-900 border-b border-paper-200 pb-2">
            4. Permissions &amp; Licensing Requests
          </h2>
          <p>
            For inquiries regarding academic research, technology partnerships, non-commercial emergency pilots, or licensing of JEEVAN AI modules:
          </p>
          <div className="p-4 rounded-xl bg-paper-100 border border-paper-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-ink-900">JEEVAN AI Technology &amp; Architecture Group</p>
            <p className="text-ink-600">Project Leads: Abhay Sachin Donde &amp; Vedant Santosh Kokane</p>
            <p className="text-ink-500">Notice: Prior to civic production deployment by governmental or institutional bodies, custom contributor and licensing agreements shall be established under applicable jurisdiction.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
