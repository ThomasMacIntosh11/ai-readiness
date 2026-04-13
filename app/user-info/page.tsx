"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { cardStagger, fadeInUp, heroStaggerContainer, heroStaggerItem, panelReveal, transitionForReducedMotion } from "@/lib/motion";

type Profile = {
  fullName: string;
  organization: string;
  role: string;
  email: string;
};

export default function UserInfoPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    localStorage.setItem("profile", JSON.stringify(profile));
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : 450));
    router.push("/results");
  };

  const isValid = profile.fullName.trim() && profile.organization.trim() && profile.email.trim();
  const requiredFieldsComplete = useMemo(
    () => [profile.fullName, profile.organization, profile.email].filter((value) => value.trim().length > 0).length,
    [profile.fullName, profile.organization, profile.email],
  );
  const completionPercent = Math.round((requiredFieldsComplete / 3) * 100);
  const submitLabel = isSubmitting ? "Preparing your report..." : "Send me my report";
  const fieldClassName = (isComplete: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-4 text-[var(--brand-ink)] transition placeholder:text-[#9ca3af] ${
      isComplete ? "border-[var(--brand-accent)] shadow-[0_0_0_3px_rgba(37,99,235,0.10)]" : "border-[#c6ced9]"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <motion.main
          className="mx-auto w-full max-w-[820px] px-6 py-10"
          initial="hidden"
          animate="visible"
          variants={cardStagger(0.04, 0.1)}
        >
          <motion.section className="rounded-[32px] bg-[var(--brand-surface)] px-8 py-10 text-center shadow-[0_12px_40px_rgba(17,24,39,0.08)] md:px-12 md:py-12" variants={panelReveal}>
            <motion.div variants={heroStaggerContainer} initial="hidden" animate="visible">
              <motion.h1 className="text-4xl font-semibold tracking-tight text-[var(--brand-ink)] md:text-5xl" variants={heroStaggerItem}>
                Where should we send your full AI maturity report?
              </motion.h1>
              <motion.p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]" variants={heroStaggerItem}>
                Get a detailed breakdown of what your results mean, along with clear guidance on what to focus on next.
              </motion.p>
            </motion.div>

            <motion.div className="mx-auto mt-8 max-w-[620px] rounded-2xl bg-[var(--brand-bg)] p-4 text-left" variants={fadeInUp}>
              <div className="flex items-center justify-between text-sm text-[var(--brand-muted)]">
                <span>Profile completion</span>
                <span>{completionPercent}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                <motion.div
                  className="h-full rounded-full bg-[var(--brand-accent)]"
                  initial={false}
                  animate={{ width: `${completionPercent}%` }}
                  transition={transitionForReducedMotion(!!reducedMotion, 0.25)}
                />
              </div>
            </motion.div>

            <motion.div className="mx-auto mt-8 max-w-[620px] text-left" variants={fadeInUp}>
              <p className="text-2xl font-semibold tracking-tight text-[var(--brand-ink)]">What you&apos;ll receive</p>
              <div className="space-y-4 text-base text-[#374151]">
                <p className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg font-semibold text-[#5bb96c]">✓</span>
                  <span>A deeper explanation of your AI maturity stage and what it looks like in practice</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg font-semibold text-[#5bb96c]">✓</span>
                  <span>The most common challenges organizations face at this stage</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg font-semibold text-[#5bb96c]">✓</span>
                  <span>A structured 90-day plan to move forward</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg font-semibold text-[#5bb96c]">✓</span>
                  <span>What to focus on as you progress to the next level</span>
                </p>
              </div>
              <p className="mt-8 text-lg leading-8 text-[var(--brand-ink)]">
                Built on 7 core capabilities observed across organizations adopting AI at scale.
              </p>
            </motion.div>

            <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-[620px] space-y-4 text-left">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Name</span>
                <input
                  value={profile.fullName}
                  onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                  className={fieldClassName(profile.fullName.trim().length > 0)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f2937]">Organization</span>
                <input
                  value={profile.organization}
                  onChange={(event) => setProfile((prev) => ({ ...prev, organization: event.target.value }))}
                  className={fieldClassName(profile.organization.trim().length > 0)}
                  placeholder="Your organization"
                  required
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#1f2937]">Email address</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value, role: "" }))}
                    className={fieldClassName(profile.email.trim().length > 0)}
                    placeholder="name@company.com"
                    required
                  />
                </label>

                <div className="flex items-end">
                  <motion.button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    whileHover={isValid && !isSubmitting && !reducedMotion ? { y: -1 } : undefined}
                    whileTap={isValid && !isSubmitting && !reducedMotion ? { scale: 0.98 } : undefined}
                    className={`w-full rounded-xl px-6 py-4 text-base font-semibold ${
                      isValid && !isSubmitting
                        ? "bg-[var(--brand-ink)] text-white hover:bg-black"
                        : "bg-[#9ca3af] text-white"
                    }`}
                  >
                    {submitLabel}
                  </motion.button>
                </div>
              </div>
              <p className="text-center text-sm text-[var(--brand-muted)]">
                We&apos;ll use your details to send your results and may follow up about the assessment.
              </p>
            </form>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
