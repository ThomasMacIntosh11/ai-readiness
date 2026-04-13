"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
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
            className="relative rounded-2xl bg-[var(--brand-surface)] p-8 pt-20 shadow-[0_4px_16px_rgba(17,24,39,0.08)] md:p-10 md:pt-20"
            variants={panelReveal}
          >
            <motion.div className="absolute left-8 top-8" variants={heroStaggerItem} initial="hidden" animate="visible">
              <Link
                href="/"
                aria-label="Back to home"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--brand-accent)]/20 bg-white text-[var(--brand-accent-strong)] shadow-[0_10px_25px_rgba(17,24,39,0.05)] transition hover:border-[var(--brand-accent)]/35 hover:bg-[var(--brand-accent)]/5"
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  ←
                </span>
              </Link>
            </motion.div>
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
              <motion.p className="mx-auto mt-4 max-w-3xl text-left text-lg leading-8 text-[var(--brand-muted)]" variants={heroStaggerItem}>
                You&apos;ll work through 35 questions across seven sections, answering statements about your organization
                using Strongly disagree, Disagree, Neutral, Agree, Strongly agree, or Not sure.
              </motion.p>
              <motion.p className="mx-auto mt-3 max-w-3xl text-left text-lg leading-8 text-[var(--brand-muted)]" variants={heroStaggerItem}>
                Choose the option that best reflects your organization today. If you don&apos;t know the answer or don&apos;t
                have the information, choose not sure. It won&apos;t count against your score.
              </motion.p>
            </motion.div>
            <motion.div className="mt-8 flex justify-center" variants={heroStaggerItem}>
              <motion.div whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  href="/assessment/questions"
                  className="inline-flex items-center rounded-xl bg-[var(--brand-accent)] px-8 py-5 text-lg font-semibold text-white shadow-[0_16px_30px_rgba(29,154,204,0.25)] transition hover:bg-[var(--brand-accent-strong)]"
                >
                  Start the assessment
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="mt-3 text-center" variants={heroStaggerItem}>
              <Link href="/terms-and-conditions" className="text-xs font-medium text-[var(--brand-muted)] hover:text-[var(--brand-accent-strong)] hover:underline">
                T&apos;s and C&apos;s
              </Link>
            </motion.div>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
