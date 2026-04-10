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

const DOMAIN_AVERAGE_BY_ENABLER: Record<string, number> = {
  strategy: 60,
  data: 30,
  technology: 55,
  talent: 35,
  operating_model: 30,
  governance: 40,
  culture: 35,
};

const MATURITY_STAGES = [
  { label: "Explorer", range: "0-25", start: 0, end: 25 },
  { label: "Pilot", range: "26-50", start: 26, end: 50 },
  { label: "Builder", range: "51-70", start: 51, end: 70 },
  { label: "Integrator", range: "71-85", start: 71, end: 85 },
  { label: "Transformer", range: "86-100", start: 86, end: 100 },
] as const;

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

const MATURITY_STAGE_HEADLINES = {
  Explorer: "Organizations in the AI Explorer stage are building awareness and setting focus.",
  Pilot: "Organizations in the AI Pilot stage are validating early value and creating momentum.",
  Builder: "Organizations in the AI Builder stage are turning early capability into repeatable execution.",
  Integrator: "Organizations in the AI Integrator stage are embedding AI in workflows and scaling reliable impact.",
  Transformer: "Organizations in the AI Transformer stage are using AI as a strategic source of advantage.",
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function bezierPoint(t: number) {
  const p0 = { x: 48, y: 250 };
  const p1 = { x: 190, y: 232 };
  const p2 = { x: 328, y: 120 };
  const p3 = { x: 672, y: 62 };
  const u = 1 - t;

  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function stageCenter(index: number, totalStages: number) {
  return 48 + (624 * (index + 0.5)) / totalStages;
}

function scoreToJourneyT(score: number) {
  const boundedScore = clamp(score, 0, 100);
  const totalStages = MATURITY_STAGES.length;
  const stageIndex = MATURITY_STAGES.findIndex(
    (stage) => boundedScore >= stage.start && boundedScore <= stage.end,
  );

  if (stageIndex < 0) {
    return 0;
  }

  const stage = MATURITY_STAGES[stageIndex];
  const span = Math.max(1, stage.end - stage.start);
  const progressInStage = clamp((boundedScore - stage.start) / span, 0, 1);

  return (stageIndex + progressInStage) / totalStages;
}

function articleFor(label: string) {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}

function benchmarkStatus(score: number, average: number) {
  const gap = score - average;

  if (gap >= 15) {
    return { label: "Strong", className: "bg-[#dff4e8] text-[#1f7a4d]" };
  }
  if (gap >= 0) {
    return { label: "Developing", className: "bg-[#fff3cd] text-[#946200]" };
  }

  return { label: "Growth edge", className: "bg-[#fde2e8] text-[#bf2950]" };
}

function MaturityJourneyGraph({ score }: { score: number }) {
  const reducedMotion = useReducedMotion();
  const boundedScore = clamp(score, 0, 100);
  const t = scoreToJourneyT(boundedScore);
  const marker = bezierPoint(t);
  const separators = Array.from({ length: MATURITY_STAGES.length - 1 }, (_, index) => index + 1);
  const currentStage = MATURITY_STAGES.find((stage) => boundedScore >= stage.start && boundedScore <= stage.end) ?? MATURITY_STAGES[0];
  const title = currentStage.label;
  const stageHeadline = MATURITY_STAGE_HEADLINES[title as keyof typeof MATURITY_STAGE_HEADLINES];

  return (
    <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(29,154,204,0.08),rgba(255,255,255,0.98)_28%)] p-6 shadow-[0_18px_50px_rgba(17,24,39,0.06)] md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[var(--brand-accent)]/15 bg-[var(--brand-accent)]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
            Your Results
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--brand-ink)] md:text-3xl">
            {stageHeadline.split(title)[0]}
            <span className="text-[var(--brand-accent-strong)]">{title}</span>
            {stageHeadline.split(title)[1]}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--brand-muted)] md:text-base">
            Organizational maturity reflects how well your strategy, capabilities, governance, and ways of working are
            aligned to turn AI ambition into repeatable business impact.
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {MATURITY_STAGES.map((stage) => {
          const isCurrent = stage.label === title;
          return (
            <motion.div
              key={stage.label}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isCurrent
                  ? "border-[var(--brand-accent)]/30 bg-[var(--brand-accent)] text-white shadow-[0_12px_24px_rgba(29,154,204,0.22)]"
                  : "border-[#d7dde5] bg-white/85 text-[var(--brand-muted)]"
              }`}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionForReducedMotion(!!reducedMotion, 0.4)}
            >
              <span className="font-semibold">{stage.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg viewBox="0 0 740 320" className="h-[320px] min-w-[680px] w-full">
          <defs>
            <linearGradient id="journey-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="journey-line" x1="48" y1="250" x2="672" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.42" />
              <stop offset="45%" stopColor="var(--brand-accent)" stopOpacity="0.82" />
              <stop offset="100%" stopColor="var(--brand-accent-strong)" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          <line x1="48" y1="250" x2="690" y2="250" stroke="var(--brand-ink)" strokeWidth="3.5" />
          <line x1="48" y1="40" x2="48" y2="250" stroke="var(--brand-ink)" strokeWidth="3.5" />
          <text x="366" y="298" textAnchor="middle" fontSize="19" fill="var(--brand-ink)" fontWeight="600">
            Organization Maturity
          </text>

          {[80, 140, 200].map((y) => (
            <line key={y} x1="48" y1={y} x2="690" y2={y} stroke="rgba(107,114,128,0.14)" strokeDasharray="4 8" />
          ))}

          {separators.map((separatorIndex) => {
            const x = 48 + (624 * separatorIndex) / MATURITY_STAGES.length;
            return <line key={separatorIndex} x1={x} y1="54" x2={x} y2="250" stroke="rgba(107,114,128,0.65)" strokeDasharray="5 9" />;
          })}

          <motion.path
            d="M 48 250 C 190 232, 328 120, 672 62 L 672 250 L 48 250 Z"
            fill="url(#journey-area)"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionForReducedMotion(!!reducedMotion, 0.6)}
          />

          <motion.path
            d="M 48 250 C 190 232, 328 120, 672 62"
            fill="none"
            stroke="url(#journey-line)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={transitionForReducedMotion(!!reducedMotion, 1.1)}
          />

          {MATURITY_STAGES.map((stage, index) => {
            const x = stageCenter(index, MATURITY_STAGES.length);
            const isCurrent = stage.label === title;
            return (
              <g key={stage.label}>
                <text
                  x={x}
                  y={24}
                  textAnchor="middle"
                  fontSize="15"
                  fill={isCurrent ? "var(--brand-accent-strong)" : "var(--brand-muted)"}
                  fontWeight={isCurrent ? "700" : "600"}
                >
                  {stage.label}
                </text>
                {isCurrent ? (
                  <motion.line
                    x1={x - 48}
                    x2={x + 48}
                    y1={28}
                    y2={28}
                    stroke="var(--brand-accent)"
                    strokeWidth="3"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={transitionForReducedMotion(!!reducedMotion, 0.55)}
                  />
                ) : null}
              </g>
            );
          })}

          <motion.circle
            cx={marker.x}
            cy={marker.y}
            r="22"
            fill="var(--brand-accent)"
            fillOpacity="0.12"
            initial={reducedMotion ? false : { cx: marker.x, cy: 250, opacity: 0 }}
            animate={reducedMotion ? { cx: marker.x, cy: marker.y, opacity: 1 } : { cx: marker.x, cy: marker.y, opacity: [0, 1, 1], scale: [0.8, 1.05, 1] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
          <motion.circle
            cx={marker.x}
            cy={marker.y}
            r="11"
            fill="var(--brand-accent)"
            initial={reducedMotion ? false : { cx: marker.x, cy: 250 }}
            animate={{ cx: marker.x, cy: marker.y }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
          <motion.circle
            cx={marker.x}
            cy={marker.y}
            r="18"
            fill="none"
            stroke="var(--brand-accent)"
            strokeOpacity="0.24"
            strokeWidth="5"
            initial={reducedMotion ? false : { cx: marker.x, cy: 250, opacity: 0 }}
            animate={
              reducedMotion
                ? { cx: marker.x, cy: marker.y, opacity: 1 }
                : { cx: marker.x, cy: marker.y, opacity: [0, 1, 0.5, 1], scale: [0.85, 1.08, 1] }
            }
            transition={reducedMotion ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
          {!reducedMotion ? (
            <motion.circle
              cx={marker.x}
              cy={marker.y}
              r="30"
              fill="none"
              stroke="var(--brand-accent)"
              strokeOpacity="0.22"
              strokeWidth="2.5"
              animate={{ opacity: [0.18, 0.42, 0.12], scale: [0.9, 1.22, 0.9] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
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

            <motion.div
              className="mt-8"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionForReducedMotion(!!reducedMotion, 0.5)}
            >
              <MaturityJourneyGraph score={overallScore} />
            </motion.div>

            <motion.div className="mt-6 grid gap-4 md:grid-cols-2" variants={cardStagger(0.04, 0.06)} initial="hidden" animate="visible">
              <motion.div
                className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(29,154,204,0.08),rgba(255,255,255,0.96))] p-6 shadow-[0_16px_40px_rgba(17,24,39,0.05)]"
                variants={fadeInUp}
                whileHover={reducedMotion ? undefined : { y: -4 }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">Cumulative Score</div>
                <div className="mt-3 text-5xl font-semibold tracking-tight text-[var(--brand-ink)]">{overallScore}%</div>
                <div className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                  Your current readiness signal across the full assessment.
                </div>
              </motion.div>
              <motion.div
                className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(29,154,204,0.06))] p-6 shadow-[0_16px_40px_rgba(17,24,39,0.05)]"
                variants={fadeInUp}
                whileHover={reducedMotion ? undefined : { y: -4 }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-muted)]">Maturity Stage</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--brand-ink)]">{maturity.label}</div>
                <div className="mt-2 inline-flex rounded-full bg-[var(--brand-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--brand-accent-strong)]">
                  Range: {maturity.range}
                </div>
                <div className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                  The stage that best reflects how prepared your organization is to turn AI into repeatable outcomes.
                </div>
              </motion.div>
            </motion.div>
            </motion.section>

            <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start">
              <motion.section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card" variants={panelReveal}>
              <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">Your 7 Domain Scores</h2>
              <motion.div className="mt-5 space-y-3" variants={cardStagger(0.02, 0.05)}>
                {categoryScores.map((row: ScoreRow) => {
                  const average = DOMAIN_AVERAGE_BY_ENABLER[row.enablerId] ?? 0;
                  const status = benchmarkStatus(row.score, average);

                  return (
                    <motion.div key={row.enablerId} className="rounded-xl bg-[var(--brand-bg)] px-5 py-4" variants={fadeInUp}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="max-w-[70%] text-lg font-semibold text-[#1f2937]">{row.enablerName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-semibold text-[var(--brand-ink)]">{row.score}%</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      <div className="relative mt-4">
                        <div
                          className="pointer-events-none absolute -top-4 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--brand-muted)]"
                          style={{ left: `${average}%` }}
                        >
                          avg.
                        </div>
                        <div
                          className="pointer-events-none absolute -top-0.5 bottom-0 w-px -translate-x-1/2 bg-[#6b7280]/70"
                          style={{ left: `${average}%` }}
                          aria-hidden="true"
                        />
                        <div className="h-3 overflow-hidden rounded-full bg-[#d9dde3]">
                          <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${row.score}%` }} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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
