"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import ThreadBackground from "@/app/components-thread-background";
import { heroStaggerContainer, heroStaggerItem, heroStaggerItemStatic } from "@/lib/motion";

export default function Home() {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? heroStaggerItemStatic : heroStaggerItem;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <main className="mx-auto w-full max-w-[1180px] px-6 py-8 md:py-12">
          <motion.section
            className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[var(--brand-surface)] px-8 py-10 shadow-[0_24px_80px_rgba(17,24,39,0.10)] md:px-12 md:py-14"
            initial="hidden"
            animate="visible"
            variants={heroStaggerContainer}
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(29,154,204,0.10),rgba(29,154,204,0))]" />
            <motion.div
              aria-hidden="true"
              className="absolute -right-12 top-8 h-48 w-48 rounded-full bg-[var(--brand-accent)]/10 blur-3xl"
              animate={reducedMotion ? undefined : { y: [-10, 10, -10], scale: [1, 1.05, 1] }}
              transition={reducedMotion ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
              <div>
                <motion.div className="flex items-center gap-4" variants={item}>
                  <Image src="/adv-logo.png" alt="Adaptovate logo" width={86} height={86} priority className="h-auto w-[72px] md:w-[86px]" />
                </motion.div>
                <motion.div
                  className="mt-6 inline-flex items-center rounded-full border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/8 px-4 py-2 text-sm font-semibold text-[var(--brand-accent-strong)]"
                  variants={item}
                >
                  &lt;5 minutes
                </motion.div>
                <motion.h1
                  className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[var(--brand-ink)] md:text-6xl"
                  variants={item}
                >
                  How ready is your organization for AI, really?
                </motion.h1>
                <motion.p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-muted)] md:text-xl" variants={item}>
                  A quick diagnostic based on <span className="font-semibold text-[var(--brand-accent-strong)]">seven capabilities</span> that determine whether AI is creating real value for your organization. Most organizations are experimenting with AI. Few are turning that into meaningful impact.
                </motion.p>
                <motion.p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--brand-muted)] md:text-xl" variants={item}>
                  This <span className="font-semibold text-[var(--brand-accent-strong)]">5 minute assessment</span> will reveal your organization&apos;s AI maturity, where momentum is building, and
                  where AI work is stuck. You&apos;ll also get concrete next steps to help you get started.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--brand-muted)]"
                  variants={item}
                >
                  <span className="inline-flex items-center rounded-full bg-[var(--brand-accent)]/10 px-4 py-2 ring-1 ring-[var(--brand-accent)]/15">35 questions</span>
                  <span className="inline-flex items-center rounded-full bg-[var(--brand-accent)]/10 px-4 py-2 ring-1 ring-[var(--brand-accent)]/15">
                    Personalized maturity profile
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[var(--brand-accent)]/10 px-4 py-2 ring-1 ring-[var(--brand-accent)]/15">
                    Downloadable PDF
                  </span>
                </motion.div>

                <motion.div className="mt-8 flex flex-wrap items-center gap-3" variants={item}>
                  <motion.div
                    whileHover={reducedMotion ? undefined : { y: -2 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  >
                    <Link
                      href="/assessment"
                      className="inline-flex items-center rounded-xl bg-[var(--brand-accent)] px-6 py-4 text-base font-semibold text-white shadow-[0_16px_30px_rgba(29,154,204,0.25)] transition hover:bg-[var(--brand-accent-strong)]"
                    >
                      Start the assessment
                    </Link>
                  </motion.div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-xl border border-[#d1d5db] bg-white px-6 py-4 text-base font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-accent)]/40 hover:text-[var(--brand-accent-strong)]"
                  >
                    Talk to an expert
                  </Link>
                </motion.div>

              </div>

              <motion.div
                animate={reducedMotion ? undefined : { y: [0, -16, 0] }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 5.8,
                        repeat: Infinity,
                        ease: [0.42, 0, 0.58, 1],
                      }
                }
              >
                <motion.aside
                  className="relative rounded-[28px] border border-[var(--brand-accent)]/15 bg-[linear-gradient(180deg,rgba(29,154,204,0.12),rgba(255,255,255,0.96)_38%)] p-6 shadow-[0_18px_45px_rgba(17,24,39,0.08)]"
                  variants={item}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,rgba(29,154,204,0),rgba(29,154,204,0.45),rgba(29,154,204,0))]" />
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">
                    What you&apos;ll uncover...
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4 rounded-2xl bg-white/90 p-4 ring-1 ring-black/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-2xl bg-[var(--brand-accent)]/12 text-[var(--brand-accent-strong)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 18h16" />
                        <path d="M7 15l3-3 3 2 4-5" />
                        <circle cx="7" cy="15" r="1" fill="currentColor" stroke="none" />
                        <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none" />
                        <circle cx="13" cy="14" r="1" fill="currentColor" stroke="none" />
                        <circle cx="17" cy="9" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold leading-tight text-[var(--brand-ink)]">Where your organization is ready to scale</p>
                      <p className="mt-1 text-[0.95rem] leading-5 text-[var(--brand-muted)]">
                        See which capabilities already have momentum and where AI is closest to creating real operational value.
                      </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-white/90 p-4 ring-1 ring-black/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-2xl bg-[var(--brand-accent)]/12 text-[var(--brand-accent-strong)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v7" />
                        <path d="M12 16v5" />
                        <path d="M5.64 5.64l4.95 4.95" />
                        <path d="M13.41 13.41l4.95 4.95" />
                        <path d="M3 12h7" />
                        <path d="M14 12h7" />
                        <path d="M5.64 18.36l4.95-4.95" />
                        <path d="M13.41 10.59l4.95-4.95" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold leading-tight text-[var(--brand-ink)]">What capability gaps are slowing adoption</p>
                      <p className="mt-1 text-[0.95rem] leading-5 text-[var(--brand-muted)]">
                        Identify the blockers that are preventing experimentation from turning into aligned, repeatable progress.
                      </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-white/90 p-4 ring-1 ring-black/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-2xl bg-[var(--brand-accent)]/12 text-[var(--brand-accent-strong)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 19h14" />
                        <path d="M7 16l4-4 3 2 4-6" />
                        <path d="M15 8h3v3" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-semibold leading-tight text-[var(--brand-ink)]">Which changes will create momentum fastest</p>
                      <p className="mt-1 text-[0.95rem] leading-5 text-[var(--brand-muted)]">
                        Get a clearer sense of the one or two practical shifts most likely to move your organization forward.
                      </p>
                    </div>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
