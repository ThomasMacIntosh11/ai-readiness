"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";

type Profile = {
  fullName: string;
  organization: string;
  role: string;
  email: string;
};

export default function UserInfoPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window === "undefined") {
      return { fullName: "", organization: "", role: "", email: "" };
    }

    try {
      const saved = JSON.parse(localStorage.getItem("profile") ?? "{}");
      return {
        fullName: saved.fullName ?? "",
        organization: saved.organization ?? "",
        role: saved.role ?? "",
        email: saved.email ?? "",
      };
    } catch {
      return { fullName: "", organization: "", role: "", email: "" };
    }
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem("profile", JSON.stringify(profile));
    router.push("/results");
  };

  const isValid = profile.fullName.trim() && profile.organization.trim() && profile.role.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[980px] px-6 py-10">
          <section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--brand-ink)]">User Information</h1>
            <p className="mt-3 text-lg text-[var(--brand-muted)]">Please provide your details before viewing the results.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Full name</span>
                <input
                  value={profile.fullName}
                  onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Organization</span>
                <input
                  value={profile.organization}
                  onChange={(event) => setProfile((prev) => ({ ...prev, organization: event.target.value }))}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Role</span>
                <input
                  value={profile.role}
                  onChange={(event) => setProfile((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Email (optional)</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                />
              </label>

              <button
                type="submit"
                disabled={!isValid}
                className={`rounded-lg px-6 py-3 text-sm font-semibold ${
                  isValid ? "bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-strong)]" : "bg-[#9ca3af] text-white"
                }`}
              >
                View results
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
