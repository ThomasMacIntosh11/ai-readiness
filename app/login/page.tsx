"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--brand-bg)] px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-white/70 bg-[var(--brand-surface)] p-10 shadow-[0_24px_80px_rgba(17,24,39,0.10)]">
        <div className="flex justify-center mb-8">
          <Image src="/adv-logo.png" alt="Adaptovate logo" width={72} height={72} priority className="h-auto" />
        </div>

        <h1 className="text-center text-2xl font-semibold tracking-tight text-[var(--brand-ink)] mb-2">
          Demo Access
        </h1>
        <p className="text-center text-sm text-[var(--brand-muted)] mb-8">
          Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[var(--brand-ink)] placeholder-[var(--brand-muted)] outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 transition"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--brand-accent)] px-6 py-3 text-base font-semibold text-white shadow-[0_16px_30px_rgba(29,154,204,0.25)] transition hover:bg-[var(--brand-accent-strong)] disabled:opacity-60"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
