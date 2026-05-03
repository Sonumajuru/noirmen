"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-3xl tracking-[0.3em] uppercase">
            NOIRMEN
          </Link>
          <p className="label mt-4">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs px-4 py-3 tracking-wider">
              {error}
            </div>
          )}

          <div>
            <label className="label block mb-2">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
            />
          </div>

          <div>
            <label className="label block mb-2">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-noir-muted">
            Don't have an account?{" "}
            <Link href="/register" className="text-noir-white hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-xs text-noir-muted">
            Need help?{" "}
            <Link href="/help" className="text-noir-white hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
