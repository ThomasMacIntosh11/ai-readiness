"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { ENABLERS } from "@/lib/enablers";
import { cardStagger, heroStaggerContainer, heroStaggerItem, panelReveal } from "@/lib/motion";

export default function AssessmentIntroPage() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <motion.main
          className="mx-auto w-full max-w-[980px] px-6 py-10"
          initial="hidden"
          animate="visible"
          variants={cardStagger(0.05, 0.08)}
        >
          <motion.section
            className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] md:p-10"
            variants={panelReveal}
          >
            <motion.div className="text-center" variants={heroStaggerContainer} initial="hidden" animate="visible">
              <motion.div
                className="inline-flex rounded-full border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/8 px-4 py-2 text-sm font-semibold text-[var(--brand-accent-strong)]"
                variants={heroStaggerItem}
              >
                How this works
              </motion.div>
              <motion.h1 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--brand-ink)] md:text-5xl" variants={heroStaggerItem}>
                Ready to start?
              </motion.h1>
              <motion.p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]" variants={heroStaggerItem}>
                You&apos;ll answer statements about your organization to reveal your AI maturity, where momentum is building,
                and where AI work is stuck.
              </motion.p>
              <motion.p className="mx-auto mt-3 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]" variants={heroStaggerItem}>
                If you don&apos;t know the answer or don&apos;t have the information, choose{" "}
                <span className="font-semibold text-[var(--brand-ink)]">Not sure</span>. It won&apos;t count against your score.
              </motion.p>
            </motion.div>

            <motion.div className="mx-auto mt-10 max-w-[760px]" variants={heroStaggerItem}>
              <p className="text-center text-2xl font-semibold tracking-tight text-[var(--brand-ink)]">
                The seven sections you&apos;ll move through
              </p>
              <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {ENABLERS.map((enabler) => (
                  <div key={enabler.id}>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                      {enabler.order}. {enabler.shortName}
                    </p>
                    <p className="mt-1 text-base leading-7 text-[var(--brand-muted)]">{enabler.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="mx-auto mt-10 max-w-[760px] text-center" variants={heroStaggerItem}>
              <p className="text-lg leading-8 text-[var(--brand-muted)]">
                Your responses are used to prepare your results and are not shared more broadly. By continuing, you agree to our{" "}
                <Link href="/terms-and-conditions" className="text-sm font-semibold text-[var(--brand-accent-strong)] hover:underline">
                  Terms and Conditions
                </Link>
                , including that ADAPTOVATE may contact you using the details you provide.
              </p>
            </motion.div>

            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-3" variants={heroStaggerItem}>
              <motion.div whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  href="/assessment/questions"
                  className="inline-flex items-center rounded-xl bg-[var(--brand-accent)] px-6 py-4 text-base font-semibold text-white shadow-[0_16px_30px_rgba(29,154,204,0.25)] transition hover:bg-[var(--brand-accent-strong)]"
                >
                  Start the assessment
                </Link>
              </motion.div>
              <Link
                href="/"
                className="inline-flex items-center rounded-xl border border-[#d1d5db] bg-white px-5 py-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-accent)]/40 hover:text-[var(--brand-accent-strong)]"
              >
                Back to home
              </Link>
            </motion.div>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
