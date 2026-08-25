"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@jeevan-ai/ui";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // If already logged in, redirect based on role
  React.useEffect(() => {
    if (user) {
      if (user.role === "RESPONDER") router.push("/responder/dashboard");
      else if (user.role === "COMMAND") router.push("/command/dashboard");
      else if (user.role === "ADMIN") router.push("/admin/users");
      else router.push("/emergency"); // PUBLIC fallback
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      // The useEffect will handle the redirect once user state updates
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid login credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-surface-bg min-h-screen" data-theme="paper">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-ink-900 mb-2">
            JEEVAN <span className="text-primary-600">AI</span>
          </h1>
          <p className="text-ink-500 font-body">Secure Access Gateway</p>
        </div>

        <Card className="border-0 shadow-xl shadow-ink-900/5 ring-1 ring-ink-900/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-ink-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-alert-700 bg-alert-50 rounded-md border border-alert-200" role="alert">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-ink-900" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-paper-300 bg-transparent px-3 py-2 text-sm placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-ink-900" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-paper-300 bg-transparent px-3 py-2 text-sm placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-sm text-ink-500">
          Need emergency assistance? <a href="/emergency" className="text-primary-600 font-semibold hover:underline">Get Help Now</a>
        </p>
      </div>
    </div>
  );
}
