"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { isAnswered, type Answers, type AnswerValue } from "@/lib/answers";
import { ENABLERS } from "@/lib/enablers";
import { QUESTIONS } from "@/lib/questions";

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      return JSON.parse(localStorage.getItem("answers") ?? "{}");
    } catch {
      return {};
    }
  });

  const allAnswered = useMemo(() => QUESTIONS.every((question) => isAnswered(answers[question.id])), [answers]);

  const onSelect = (questionId: string, value: AnswerValue) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    localStorage.setItem("answers", JSON.stringify(next));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[980px] px-6 py-8">
          <section className="rounded-2xl bg-[var(--brand-surface)] p-8 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
            <h1 className="text-5xl font-semibold tracking-tight text-[var(--brand-ink)]">Assessment Questionnaire</h1>
            <div className="mt-3 space-y-2 text-lg text-[var(--brand-muted)]">
              <p>Please answer each statement using the scale below:</p>
              <p>1 - Not at all</p>
              <p>2 - Early stages</p>
              <p>3 - In progress</p>
              <p>4 - Mostly true</p>
              <p>5 - Fully established</p>
              <p>N/A - Not applicable or too early to assess meaningfully</p>
              <p>Responses marked N/A count as answered, but are excluded from score averages.</p>
            </div>
          </section>

          <div className="mt-7 space-y-7">
            {ENABLERS.map((enabler) => {
              const questionsForEnabler = QUESTIONS.filter((question) => question.enablerId === enabler.id);

              return (
                <section
                  key={enabler.id}
                  className="rounded-2xl bg-[var(--brand-surface)] p-6 shadow-[0_4px_16px_rgba(17,24,39,0.08)]"
                >
                  <h2 className="text-3xl font-semibold text-[var(--brand-ink)]">
                    {enabler.order}. {enabler.shortName}
                  </h2>
                  <p className="mt-2 text-lg text-[var(--brand-muted)]">{enabler.name}</p>

                  <div className="mt-5 space-y-4">
                    {questionsForEnabler.map((question) => (
                      <div key={question.id} className="rounded-xl bg-[var(--brand-bg)] p-4">
                        <p className="text-xl font-medium text-[#1f2937]">{question.text}</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {([1, 2, 3, 4, 5, "N/A"] as const).map((value) => (
                            <button
                              key={`${question.id}-${value}`}
                              type="button"
                              onClick={() => onSelect(question.id, value)}
                              className={`rounded-full border px-3 text-sm font-semibold transition ${
                                answers[question.id] === value
                                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                                  : "border-[#9ca3af] bg-white text-[var(--brand-ink)] hover:border-[var(--brand-accent)]"
                              }`}
                              style={{ height: "2.5rem", minWidth: value === "N/A" ? "3.75rem" : "2.5rem" }}
                              aria-label={`${question.text} - ${value}`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-[var(--brand-surface)] p-6 shadow-[0_4px_16px_rgba(17,24,39,0.08)]">
            <p className="text-base text-[var(--brand-muted)]">
              {allAnswered ? "All questions answered. Continue to user details." : "Please answer all questions to continue."}
            </p>
            <Link
              href={allAnswered ? "/user-info" : "#"}
              aria-disabled={!allAnswered}
              className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                allAnswered
                  ? "bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-strong)]"
                  : "pointer-events-none bg-[#9ca3af] text-white"
              }`}
            >
              Continue
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
