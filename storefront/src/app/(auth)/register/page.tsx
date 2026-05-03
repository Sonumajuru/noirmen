"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      });
      router.push("/account");
    } catch {
      setError("Could not create account. This email may already be registered.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-3xl tracking-[0.3em] uppercase">
            NOIRMEN
          </Link>
          <p className="label mt-4">Create an account with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs px-4 py-3 tracking-wider">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">First Name</label>
              <input
                required
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
              />
            </div>
            <div>
              <label className="label block mb-2">Last Name</label>
              <input
                required
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="label block mb-2">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
            />
          </div>

          <div>
            <label className="label block mb-2">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
            />
          </div>

          <div>
            <label className="label block mb-2">Confirm Password</label>
            <input
              required
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-noir-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-noir-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
