"use client";

import { FormEvent, useState } from "react";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent("AI Readiness Self-Assessment Follow-Up");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:growth_CA@adaptovate.com?subject=${subject}&body=${body}`;
  };

  const canSend = name.trim() && email.trim() && message.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[980px] px-6 py-10">
          <section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--brand-ink)]">Contact Adaptovate</h1>
            <p className="mt-3 text-lg text-[var(--brand-muted)]">
              Send a message and we will follow up on your assessment results.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--brand-ink)]">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--brand-ink)]">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--brand-ink)]">Message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={7}
                  className="w-full rounded-lg border border-[#9ca3af] bg-white px-4 py-3 text-[var(--brand-ink)]"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={!canSend}
                className={`rounded-lg px-6 py-3 text-sm font-semibold ${
                  canSend ? "bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-strong)]" : "bg-[#9ca3af] text-white"
                }`}
              >
                Send Message
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
