"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { isAnswered, type Answers } from "@/lib/answers";
import { cardStagger, fadeInUp, heroStaggerContainer, heroStaggerItem, panelReveal, staggerContainer, transitionForReducedMotion } from "@/lib/motion";
import { MATURITY_RECS } from "@/lib/recommendations";
import {
  calculateCategoryScores,
  calculateOverallScore,
  maturityFromScore,
  type ScoreRow,
} from "@/lib/scoring";

type Profile = {
  fullName?: string;
  organization?: string;
  role?: string;
  email?: string;
};

const MATURITY_STAGE_DESCRIPTIONS = {
  Explorer:
    "Your organization is in the early stages of its AI journey. There is growing awareness and curiosity, but efforts are still informal and not yet connected to business priorities. Activity is likely happening in small pockets, driven by individual interest rather than a coordinated approach. There is no clear structure for how AI should be used or where it should create value. This stage is about moving from exploration to focus. The goal is not to do more, but to start doing the right things in a more intentional way.",
  Pilot:
    "Your organization has started to experiment with AI and is beginning to see early signs of value. Teams are testing use cases and building initial momentum. At the same time, efforts are still fragmented. Successful experiments are not consistently scaled, and progress often depends on individual teams rather than a shared approach. You are at the stage where learning is happening quickly. The next step is to bring focus and structure so that early wins can be repeated and expanded.",
  Builder:
    "Your organization has moved beyond early experimentation and is starting to build real AI capability. There is clear intent, early investment, and some teams are already seeing meaningful impact. Progress, however, is uneven. Some areas are moving quickly while others are still at an earlier stage. Ways of working are not yet consistent, and scaling successful initiatives requires more effort than it should. This stage is about turning capability into consistency. The focus is on making what works repeatable across the organization.",
  Integrator:
    "AI is becoming part of how work gets done across your organization. Use cases are embedded in workflows, and adoption is growing across teams. There is a solid foundation in place, and progress is more consistent than in earlier stages. The focus now shifts to improving quality, measuring value more clearly, and ensuring alignment across the organization. This stage is about strengthening performance and expanding impact. The goal is to make AI usage more precise, reliable, and outcome-driven.",
  Transformer:
    "AI is shaping how your organization creates value. It is embedded in operations, decision-making, and in some cases, new products or services. You have moved beyond adoption and into advantage. AI is not only improving efficiency, but also enabling new ways of working and competing. The challenge at this stage is to continue evolving. As the technology changes quickly, maintaining momentum and staying ahead requires ongoing focus and investment.",
} as const;

function articleFor(label: string) {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}

function firstSentence(text: string) {
  const match = text.match(/^(.*?[.!?])\s/);
  return match ? match[1] : text;
}

function scoreBand(score: number) {
  if (score >= 80) {
    return { label: "Strong", className: "bg-[#ecfdf3] text-[#166534]" };
  }
  if (score >= 65) {
    return { label: "Developing", className: "bg-[#fef9c3] text-[#854d0e]" };
  }
  return { label: "Growth edge", className: "bg-[#ffe4e6] text-[#be123c]" };
}

function getStoredAnswers() {
  return localStorage.getItem("answers") ?? "{}";
}

function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (!event.key || event.key === "answers" || event.key === "profile") {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export default function ResultsPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const answersRaw = useSyncExternalStore(
    subscribeToStorage,
    () => (typeof window === "undefined" ? "{}" : getStoredAnswers()),
    () => "{}",
  );
  const profileRaw = useSyncExternalStore(
    subscribeToStorage,
    () => (typeof window === "undefined" ? "{}" : localStorage.getItem("profile") ?? "{}"),
    () => "{}",
  );

  const answers = useMemo<Answers>(() => {
    try {
      return JSON.parse(answersRaw);
    } catch {
      return {};
    }
  }, [answersRaw]);

  const profile = useMemo<Profile>(() => {
    try {
      return JSON.parse(profileRaw);
    } catch {
      return {};
    }
  }, [profileRaw]);

  const onDownloadPdf = async () => {
    if (typeof window === "undefined" || isExportingPdf) {
      return;
    }

    const report = document.getElementById("pdf-report");
    if (!report) {
      return;
    }

    setIsExportingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(report, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => element.classList?.contains("no-print") ?? false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("AI-Readiness-Assessment-Report.pdf");
    } finally {
      setIsExportingPdf(false);
    }
  };
  const onRetake = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("answers");
      localStorage.removeItem("profile");
    }
    router.push("/assessment");
  };

  const { categoryScores, overallScore } = useMemo(() => {
    const scores = calculateCategoryScores(answers);
    return {
      categoryScores: scores,
      overallScore: calculateOverallScore(answers),
    };
  }, [answers]);

  const maturity = maturityFromScore(overallScore);
  const participantFirstName = profile.fullName?.trim().split(/\s+/)[0] || "Participant";
  const maturityArticle = articleFor(maturity.label);
  const stageDescription = MATURITY_STAGE_DESCRIPTIONS[maturity.label as keyof typeof MATURITY_STAGE_DESCRIPTIONS];
  const scoredCategoryRows = useMemo(
    () => categoryScores.filter((row) => row.scoredResponses > 0),
    [categoryScores],
  );
  const lowestScore = scoredCategoryRows.length > 0 ? Math.min(...scoredCategoryRows.map((row) => row.score)) : null;
  const highestScore = scoredCategoryRows.length > 0 ? Math.max(...scoredCategoryRows.map((row) => row.score)) : null;
  const highestRow = useMemo(
    () => [...scoredCategoryRows].sort((a, b) => b.score - a.score)[0],
    [scoredCategoryRows],
  );
  const lowestRow = useMemo(
    () => [...scoredCategoryRows].sort((a, b) => a.score - b.score)[0],
    [scoredCategoryRows],
  );
  const maturityRec = MATURITY_RECS[maturity.label];

  const hasCompletedAssessment = useMemo(
    () => Object.values(answers).some((value) => isAnswered(value)),
    [answers],
  );

  if (!hasCompletedAssessment) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
        <ThreadBackground variant={1} />
        <div className="relative z-10">
          <SiteHeader />
          <motion.main className="mx-auto w-full max-w-[980px] px-6 py-10" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)]" variants={panelReveal}>
              <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">No Completed Assessment Found</h1>
              <p className="mt-3 text-[var(--brand-muted)]">Please complete the assessment before viewing results.</p>
              <motion.div whileHover={reducedMotion ? undefined : { y: -1 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
                <Link href="/assessment" className="mt-6 inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]">
                Go to assessment
                </Link>
              </motion.div>
            </motion.section>
          </motion.main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <motion.main className="mx-auto w-full max-w-[980px] px-6 py-10 print-report" initial="hidden" animate="visible" variants={staggerContainer}>
          <div id="pdf-report">
            <motion.section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card" variants={panelReveal}>
            <div className="flex flex-col gap-6">
              <motion.div className="max-w-4xl" variants={heroStaggerContainer} initial="hidden" animate="visible">
                <motion.p
                  className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--brand-ink)] md:text-5xl"
                  variants={heroStaggerItem}
                >
                  <span className="text-[var(--brand-accent-strong)]">{participantFirstName}</span>, your organization is{" "}
                  {maturityArticle} <span className="text-[var(--brand-accent-strong)]">AI {maturity.label}</span>.
                </motion.p>
                <motion.p
                  className="mt-4 max-w-3xl text-base leading-7 text-[var(--brand-muted)] md:text-lg"
                  variants={heroStaggerItem}
                >
                  {stageDescription}
                </motion.p>
              </motion.div>
              <div className="flex justify-start no-print">
                <motion.button
                  type="button"
                  onClick={onDownloadPdf}
                  disabled={isExportingPdf}
                  whileHover={!isExportingPdf && !reducedMotion ? { y: -1 } : undefined}
                  whileTap={!isExportingPdf && !reducedMotion ? { scale: 0.98 } : undefined}
                  className="inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]"
                >
                  {isExportingPdf ? "Generating report..." : "Download report"}
                </motion.button>
              </div>
            </div>

            <motion.section
              className="mt-8 overflow-hidden rounded-[28px] border border-[#d7dde5] bg-white shadow-[0_20px_60px_rgba(17,24,39,0.08)]"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionForReducedMotion(!!reducedMotion, 0.5)}
            >
              <div className="flex justify-center border-b border-[#e5e7eb] px-6 py-4 no-print">
                <div className="inline-flex rounded-full border border-[#d5d9e1] bg-white p-1 shadow-sm">
                  <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Share</span>
                  <button type="button" className="rounded-full bg-[#0a66c2] px-3 py-1 text-xs font-semibold text-white">LinkedIn</button>
                  <button type="button" className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--brand-ink)]">Invite Your Team</button>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b border-[#e5e7eb] p-7 lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Your Team Archetype</p>
                  <h3 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--brand-ink)]">The {maturity.label}</h3>
                  <p className="mt-4 text-lg leading-8 text-[var(--brand-muted)]">{firstSentence(stageDescription)}</p>
                  <div className="mt-6 border-t border-[#e5e7eb] pt-5 text-base leading-7 text-[var(--brand-muted)]">
                    {maturityRec.items[0]?.subtitle}
                  </div>
                </div>

                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)]">Your 7 Domain Scores</p>
                  <div className="mt-4 space-y-5">
                    {categoryScores.map((row) => {
                      const band = scoreBand(row.score);
                      return (
                        <div key={`board-${row.enablerId}`}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-base font-semibold text-[var(--brand-ink)]">{row.enablerName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-semibold text-[var(--brand-ink)]">{row.score}%</span>
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${band.className}`}>
                                {band.label}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                            <div
                              className="h-full rounded-full bg-[var(--brand-accent)]"
                              style={{ width: `${row.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-[#e5e7eb] bg-[#f8fafc] p-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#bbf7d0] bg-[#ecfdf3] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#166534]">Signature Move</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--brand-ink)]">{highestRow?.enablerName ?? "Top strength"}</p>
                </div>
                <div className="rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#be123c]">Growth Unlock</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--brand-ink)]">{lowestRow?.enablerName ?? "Primary opportunity"}</p>
                </div>
              </div>

              <div className="bg-[linear-gradient(172deg,#f4d8eb_0%,#e8c8e0_100%)] px-6 py-8 text-center">
                <p className="text-lg font-medium text-[var(--brand-ink)]">Get a deeper readout with clear next steps tailored to your profile.</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#111827] px-6 py-3 text-sm font-semibold text-white hover:bg-black"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                  Get Your Archetype Report
                </Link>
              </div>
            </motion.section>
            </motion.section>

            <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
              <motion.section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card" variants={panelReveal}>
              <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">Category Scores</h2>
              <motion.div className="mt-5 space-y-3" variants={cardStagger(0.02, 0.05)}>
                {categoryScores.map((row: ScoreRow) => (
                  <motion.div
                    key={row.enablerId}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      highestScore !== null && lowestScore !== null && row.score === highestScore && row.score === lowestScore
                        ? "bg-[#eef2ff] ring-1 ring-[#c7d2fe]"
                        : highestScore !== null && row.score === highestScore
                          ? "bg-[#ecfdf3] ring-1 ring-[#86efac]"
                          : lowestScore !== null && row.score === lowestScore
                            ? "bg-[#fff1f2] ring-1 ring-[#fda4af]"
                            : "bg-[var(--brand-bg)]"
                    }`}
                    variants={fadeInUp}
                  >
                    <div className="text-sm font-medium text-[#1f2937]">{row.enablerName}</div>
                    <div className="text-lg font-semibold text-[var(--brand-ink)]">{row.score}%</div>
                  </motion.div>
                ))}
              </motion.div>
              </motion.section>

              <motion.section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card print-page-break" variants={panelReveal}>
              <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">What to focus on in the next 90 days</h2>
              <p className="mt-1 text-sm font-medium text-[var(--brand-muted)]">{maturityRec.subtitle}</p>

              <div className="mt-5 space-y-4">
                {maturityRec.items.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-xl bg-[var(--brand-bg)] p-5">
                    <p className="text-xl font-semibold text-[#1f2937]">
                      {index + 1}. {item.title}
                    </p>
                    <p className="mt-2 text-base text-[#374151]">{item.subtitle}</p>
                  </div>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={onRetake}
                whileHover={reducedMotion ? undefined : { y: -1 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                className="mt-6 inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)] no-print"
              >
                Retake assessment
              </motion.button>
              </motion.section>
            </div>

            <motion.div
              className="mt-8 flex justify-center no-print"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionForReducedMotion(!!reducedMotion, 0.35)}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
                Get a free readout of your report
              </Link>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
