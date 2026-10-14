"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, ArrowRight, Lock, User, Mail, Phone,
  Loader2, CheckCircle2, KeyRound, AlertTriangle,
  Building2, Users, ArrowLeft
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import type { UserRole } from "@jeevan-ai/types";

type AuthMode = "login" | "register" | "forgot_password";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, resetPassword, user, isLoading: authLoading } = useAuth();

  const [mode, setMode] = React.useState<AuthMode>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("PUBLIC");

  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Automatic redirect once user profile is loaded
  React.useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/users");
      } else if (user.role === "COMMAND") {
        router.push("/command/dashboard");
      } else if (user.role === "RESPONDER") {
        router.push("/responder/dashboard");
      } else {
        router.push("/emergency");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match. Please re-enter.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        await register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role,
          phoneNumber: phoneNumber.trim() || undefined
        });
        setSuccessMessage("Account created successfully! Verification email dispatched.");
      } else if (mode === "forgot_password") {
        await resetPassword(email.trim());
        setSuccessMessage(`Password recovery link sent to ${email.trim()}. Please inspect your inbox.`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An authentication error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick filler for testing preset demo roles
  const handleSelectDemoCredential = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword("Jeevan@2027!");
    setRole(demoRole);
    setError("");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-surface-bg" data-theme="paper">

      {/* ══════════ LEFT FORM SIDE ══════════ */}
      <div className="w-full md:w-1/2 lg:w-[520px] flex flex-col justify-between p-6 sm:p-10 md:p-12 z-10 bg-surface-bg shadow-2xl relative overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 group w-max">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden group-hover:shadow-glow-primary transition-shadow">
            <img src="/logo.png" alt="JEEVAN AI" className="w-full h-full object-contain p-1" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-ink-900">
            JEEVAN <span className="text-primary-600">AI</span>
          </span>
        </Link>

        <div className="w-full max-w-md mx-auto my-8 animate-fade-in-up">
          {/* Header Title & Subtitle */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mb-2">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Create Platform Account"}
              {mode === "forgot_password" && "Reset Password"}
            </h1>
            <p className="text-xs sm:text-sm text-ink-500">
              {mode === "login" && "Secure Access Gateway for official personnel and citizens."}
              {mode === "register" && "Join India's Public Health & Emergency Intelligence Network."}
              {mode === "forgot_password" && "Enter your registered email address to receive password instructions."}
            </p>
          </div>

          {/* Quick Tabs: Sign In vs Register */}
          {mode !== "forgot_password" && (
            <div className="flex p-1 bg-paper-100 rounded-xl border border-paper-300 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === "login"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === "register"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Feedback Banners */}
          {error && (
            <div className="p-3 mb-5 text-xs text-alert-700 bg-alert-50 border border-alert-200 rounded-xl animate-scale-in flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-alert-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl animate-scale-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME (Registration Only) */}
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide ml-1" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Inspector / Officer / Dr. Rajesh Verma"
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide ml-1" htmlFor="email">
                Email / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="name@jeevan.gov.in"
                />
              </div>
            </div>

            {/* PHONE NUMBER (Registration Only) */}
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide ml-1" htmlFor="phoneNumber">
                  Contact Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            {/* ROLE SELECTION (Registration Only) */}
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide ml-1" htmlFor="role">
                  Platform Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-11 px-3 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="PUBLIC">Citizen / Healthcare Contributor (Public Access)</option>
                  <option value="RESPONDER">Field Responder (Ambulance, EMT, Paramedic)</option>
                  <option value="COMMAND">Command Centre Operator (Digital Twin & Routing)</option>
                  <option value="ADMIN">System Administrator (Full Oversight)</option>
                </select>
              </div>
            )}

            {/* PASSWORD (Sign In & Register) */}
            {mode !== "forgot_password" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide" htmlFor="password">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot_password");
                        setError("");
                        setSuccessMessage("");
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* CONFIRM PASSWORD (Registration Only) */}
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-ink-600 uppercase tracking-wide ml-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-paper-300 bg-paper-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading || authLoading || !email || (mode !== "forgot_password" && !password)}
              className="w-full h-11 rounded-xl bg-primary-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-glow-primary transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                <>
                  <Lock className="w-4 h-4" /> Secure Sign In
                </>
              ) : mode === "register" ? (
                <>
                  <Users className="w-4 h-4" /> Create Account
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Dispatch Recovery Link
                </>
              )}
            </button>

            {/* Back to Sign In button for Forgot Password mode */}
            {mode === "forgot_password" && (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMessage("");
                }}
                className="w-full py-2 text-xs font-semibold text-ink-600 hover:text-ink-900 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            )}

          </form>

          {/* Quick Demo Credentials Picker (Sign In Mode Only) */}
          {mode === "login" && (
            <div className="mt-8 pt-6 border-t border-paper-200">
              <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider block text-center mb-3">
                Pre-Configured Personnel Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoCredential("admin@jeevan.ai", "ADMIN")}
                  className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold text-ink-900 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-red-600" /> Admin
                  </div>
                  <div className="text-[9px] text-ink-500 font-mono truncate">admin@jeevan.ai</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoCredential("operator@jeevan.ai", "COMMAND")}
                  className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold text-ink-900 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-cyan-600" /> Command
                  </div>
                  <div className="text-[9px] text-ink-500 font-mono truncate">operator@jeevan.ai</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoCredential("responder@jeevan.ai", "RESPONDER")}
                  className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold text-ink-900 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" /> Responder
                  </div>
                  <div className="text-[9px] text-ink-500 font-mono truncate">responder@jeevan.ai</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoCredential("citizen@jeevan.ai", "PUBLIC")}
                  className="p-2 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold text-ink-900 flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-600" /> Citizen
                  </div>
                  <div className="text-[9px] text-ink-500 font-mono truncate">citizen@jeevan.ai</div>
                </button>
              </div>
            </div>
          )}

          {/* Citizen Emergency Bypass */}
          <div className="mt-8 pt-6 border-t border-paper-200">
            <p className="text-xs text-ink-400 text-center mb-3">Are you facing an immediate emergency?</p>
            <Link
              href="/emergency"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-alert-50 text-alert-700 font-semibold text-xs sm:text-sm hover:bg-alert-100 transition-colors border border-alert-200"
            >
              Get Emergency Help <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-xs text-ink-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} JEEVAN AI Platform. Firebase Enterprise Authentication.
        </p>
      </div>

      {/* ══════════ RIGHT ILLUSTRATION SIDE ══════════ */}
      <div className="hidden md:flex flex-1 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-lg text-center relative z-10 animate-fade-in-up delay-200">
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-float overflow-hidden p-2">
            <img src="/logo.png" alt="JEEVAN AI" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 mb-4">
            Unified Security Gateway
          </h2>
          <p className="text-sm sm:text-base text-ink-600 leading-relaxed">
            Encrypted Firebase Authentication and Firestore Access Control. Authenticated operators and responders coordinate life-saving interventions across India.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 text-left shadow-sm">
              <h3 className="font-bold text-xs text-ink-900 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-600" /> Command Operations
              </h3>
              <p className="text-[11px] text-ink-500">Digital Twin, Smart Corridors & Surveillance</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 text-left shadow-sm">
              <h3 className="font-bold text-xs text-ink-900 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Tactical Responders
              </h3>
              <p className="text-[11px] text-ink-500">Live Incident Feeds, Ambulance Dispatch & Triage</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
