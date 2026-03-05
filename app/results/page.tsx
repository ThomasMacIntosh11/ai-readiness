"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { ENABLER_RECS, MATURITY_RECS } from "@/lib/recommendations";
import {
  calculateCategoryScores,
  calculateOverallScore,
  lowestCategories,
  maturityFromScore,
  type ScoreRow,
} from "@/lib/scoring";

type Profile = {
  fullName?: string;
  organization?: string;
  role?: string;
  email?: string;
};

const MATURITY_STAGES = [
  { label: "Explorer", range: "0-25%", start: 0, end: 25 },
  { label: "Builder", range: "26-50%", start: 26, end: 50 },
  { label: "Integrator", range: "51-75%", start: 51, end: 75 },
  { label: "Market Shaper", range: "76-100%", start: 76, end: 100 },
] as const;

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

function MaturityJourneyGraph({ score }: { score: number }) {
  const boundedScore = clamp(score, 0, 100);
  const t = boundedScore / 100;
  const marker = bezierPoint(t);
  const separators = [25, 50, 75];
  const title = MATURITY_STAGES.find((stage) => boundedScore >= stage.start && boundedScore <= stage.end)?.label ?? "Explorer";

  return (
    <div className="rounded-xl bg-[var(--brand-bg)] p-5">
      <h3 className="text-lg font-semibold text-[var(--brand-ink)]">AI Maturity Journey</h3>
      <p className="mt-1 text-sm text-[var(--brand-muted)]">
        You are currently in <span className="font-semibold text-[var(--brand-ink)]">{title}</span> at <span className="font-semibold text-[var(--brand-ink)]">{boundedScore}%</span>.
      </p>

      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 740 300" className="h-[300px] min-w-[680px] w-full">
          <line x1="44" y1="250" x2="690" y2="250" stroke="var(--brand-ink)" strokeWidth="3" />
          <line x1="48" y1="40" x2="48" y2="266" stroke="var(--brand-ink)" strokeWidth="3" />
          <text x="366" y="286" textAnchor="middle" fontSize="20" fill="var(--brand-ink)">
            Organization Maturity
          </text>
          

          {separators.map((value) => {
            const x = 48 + (624 * value) / 100;
            return <line key={value} x1={x} y1="54" x2={x} y2="250" stroke="var(--brand-muted)" strokeDasharray="4 6" />;
          })}

          <path
            d="M 48 250 C 190 232, 328 120, 672 62"
            fill="none"
            stroke="var(--brand-muted)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {MATURITY_STAGES.map((stage) => {
            const center = (stage.start + stage.end) / 2;
            const x = 48 + (624 * center) / 100;
            return (
              <g key={stage.label}>
                <text x={x} y={24} textAnchor="middle" fontSize="16" fill="var(--brand-accent)" fontWeight="700">
                  {stage.label}
                </text>
                <text x={x} y={44} textAnchor="middle" fontSize="14" fill="var(--brand-ink)">
                  {stage.range}
                </text>
              </g>
            );
          })}

          <circle cx={marker.x} cy={marker.y} r="10" fill="var(--brand-accent)" />
          <circle cx={marker.x} cy={marker.y} r="17" fill="none" stroke="var(--brand-accent)" strokeOpacity="0.22" strokeWidth="6" />
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

  const answers = useMemo<Record<string, number>>(() => {
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
      overallScore: calculateOverallScore(scores),
    };
  }, [answers]);

  const maturity = maturityFromScore(overallScore);
  const lowestTwo = lowestCategories(categoryScores, 2);
  const maturityRec = MATURITY_RECS[maturity.label];
  const recommendationItems = [
    maturityRec,
    ...lowestTwo.map((item) => {
      const recByThreshold = ENABLER_RECS[item.enablerId as keyof typeof ENABLER_RECS];
      return item.score < 50 ? recByThreshold.under50 : recByThreshold.overOrEqual50;
    }),
  ];

  if (categoryScores.every((row) => row.score === 0)) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
        <ThreadBackground variant={1} />
        <div className="relative z-10">
          <SiteHeader />
          <main className="mx-auto w-full max-w-[980px] px-6 py-10">
            <section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
              <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">No Completed Assessment Found</h1>
              <p className="mt-3 text-[var(--brand-muted)]">Please complete the assessment before viewing results.</p>
              <Link href="/assessment" className="mt-6 inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]">
                Go to assessment
              </Link>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[980px] px-6 py-10 print-report">
          <div className="rounded-xl border border-[#d1d5db] bg-white px-6 py-5 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-[#1f2937]">AI Readiness Self-Assessment Report</p>
                <p className="text-sm text-[#6b7280]">{profile.organization ? `${profile.organization}` : "Organization Report"}</p>
              </div>
              <div className="text-right text-sm text-[#6b7280]">
                <p>{profile.fullName ? profile.fullName : "Participant"}</p>
                <p>{profile.role ? profile.role : "Role"}</p>
              </div>
            </div>
          </div>
          <div id="pdf-report">
            <section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--brand-ink)]">Assessment Results</h1>
            <p className="mt-3 text-lg text-[var(--brand-muted)]">
              {profile.fullName ? `${profile.fullName}, here is your AI readiness profile.` : "Here is your AI readiness profile."}
            </p>
            <div className="mt-5 no-print">
              <button
                type="button"
                onClick={onDownloadPdf}
                disabled={isExportingPdf}
                className="inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)]"
              >
                {isExportingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>

            <div className="mt-6">
              <MaturityJourneyGraph score={overallScore} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[var(--brand-bg)] p-5">
                <div className="text-sm font-medium text-[var(--brand-muted)]">Cumulative Score</div>
                <div className="mt-1 text-4xl font-semibold text-[var(--brand-ink)]">{overallScore}%</div>
              </div>
              <div className="rounded-xl bg-[var(--brand-bg)] p-5">
                <div className="text-sm font-medium text-[var(--brand-muted)]">Maturity Stage</div>
                <div className="mt-1 text-2xl font-semibold text-[var(--brand-ink)]">{maturity.label}</div>
                <div className="mt-1 text-sm text-[var(--brand-muted)]">Range: {maturity.range}</div>
              </div>
            </div>
          </section>

            <section className="mt-7 rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card">
            <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">Category Scores</h2>
            <div className="mt-5 space-y-3">
              {categoryScores.map((row: ScoreRow) => (
                <div key={row.enablerId} className="flex items-center justify-between rounded-xl bg-[var(--brand-bg)] px-4 py-3">
                  <div className="text-sm font-medium text-[#1f2937]">{row.enablerName}</div>
                  <div className="text-lg font-semibold text-[var(--brand-ink)]">{row.score}%</div>
                </div>
              ))}
            </div>
          </section>

            <section className="mt-7 rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)] print-card print-page-break">
            <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">Recommendations</h2>

            <div className="mt-5 space-y-4">
              {recommendationItems.map((rec, index) => (
                <div key={`${rec.title}-${index}`} className="rounded-xl bg-[var(--brand-bg)] p-5">
                  <p className="text-xl font-semibold text-[#1f2937]">{rec.title}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-[#374151]">
                    {rec.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onRetake}
              className="mt-6 inline-flex rounded-lg bg-[var(--brand-accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-accent-strong)] no-print"
            >
              Retake assessment
            </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
