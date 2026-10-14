"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  ArrowLeft,
  FileText,
  Scale,
  AlertTriangle,
  Bot,
  Eye,
  CheckCircle2,
  Printer,
  Calendar,
  Globe2,
} from "lucide-react";
import { Footer } from "./Footer";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const LEGAL_NAV_ITEMS = [
  { href: "/legal/privacy", label: "Privacy Policy", icon: FileText },
  { href: "/legal/terms", label: "Terms of Use", icon: Scale },
  { href: "/legal/disclaimer", label: "Medical Disclaimer", icon: AlertTriangle },
  { href: "/legal/ai-accuracy", label: "AI & Data Accuracy", icon: Bot },
  { href: "/legal/copyright", label: "IP & Copyright", icon: FileText },
  { href: "/legal/accessibility", label: "Accessibility", icon: Eye },
];

export function LegalLayout({
  title,
  subtitle,
  lastUpdated = "October 2026",
  children,
}: LegalLayoutProps) {
  const pathname = usePathname();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper-50 text-ink-900" data-theme="paper">
      {/* ══════ TOP HEADER & BREADCRUMBS ══════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-paper-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-600 hover:text-primary-700 transition-colors p-1.5 rounded-lg hover:bg-paper-100"
              aria-label="Return to platform overview"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Overview</span>
            </Link>

            <div className="h-4 w-px bg-paper-300" />

            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-ink-900 text-sm">
                JEEVAN AI
              </span>
              <span className="text-[11px] font-mono text-ink-400 bg-paper-200/80 px-2 py-0.5 rounded">
                Legal &amp; Policy
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 px-3 py-1.5 rounded-md border border-paper-300 hover:bg-paper-100 transition-colors"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/sos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-alert-600 text-white text-xs font-bold hover:bg-alert-700 shadow-sm transition-all"
            >
              <span>Emergency SOS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════ HERO SECTION ══════ */}
      <section className="bg-gradient-to-b from-white to-paper-100 border-b border-paper-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 font-mono">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200 font-medium">
              <Globe2 className="w-3 h-3" />
              Jurisdiction: Republic of India
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paper-200 text-ink-700 border border-paper-300">
              <Calendar className="w-3 h-3" />
              Last Updated: {lastUpdated}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-50 text-success-700 border border-success-200">
              <CheckCircle2 className="w-3 h-3" />
              Operational Reference
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
            {title}
          </h1>
          <p className="text-base text-ink-500 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ══════ LEGAL SUB-NAVIGATION TABS ══════ */}
      <nav
        aria-label="Legal Documents Navigation"
        className="bg-paper-100/80 border-b border-paper-200 sticky top-16 z-30 backdrop-blur-md overflow-x-auto"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {LEGAL_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-ink-600 hover:text-ink-900 hover:bg-paper-200/60"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-ink-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ══════ DOCUMENT CONTENT BODY ══════ */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-paper-200 shadow-sm space-y-8">
          {children}
        </article>
      </main>

      {/* ══════ SHARED FOOTER ══════ */}
      <Footer />
    </div>
  );
}

export default LegalLayout;
