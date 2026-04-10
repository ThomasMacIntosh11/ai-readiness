"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import SiteHeader from "@/app/components-site-header";
import ThreadBackground from "@/app/components-thread-background";
import { isAnswered, type Answers, type AnswerValue } from "@/lib/answers";
import { ENABLERS } from "@/lib/enablers";
import {
  chapterPulse,
  fadeInUp,
  heroStaggerContainer,
  heroStaggerItem,
  milestoneGlow,
  panelReveal,
  staggerContainer,
  transitionForReducedMotion,
} from "@/lib/motion";
import { QUESTIONS } from "@/lib/questions";

const SCALE_OPTIONS = [
  { value: 1 as const, label: "Strongly disagree" },
  { value: 2 as const, label: "Disagree" },
  { value: 3 as const, label: "Neutral" },
  { value: 4 as const, label: "Agree" },
  { value: 5 as const, label: "Strongly agree" },
  { value: "N/A" as const, label: "Not sure" },
];
const MILESTONE_COPY: Record<number, string> = {
  25: "Great momentum.",
  50: "Halfway there.",
  75: "Strong progress.",
  100: "Journey complete.",
};

export default function AssessmentPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeSelection, setActiveSelection] = useState<{ questionId: string; value: AnswerValue } | null>(null);

  const allAnswered = useMemo(() => QUESTIONS.every((question) => isAnswered(answers[question.id])), [answers]);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentEnabler = currentQuestion ? ENABLERS.find((enabler) => enabler.id === currentQuestion.enablerId) : undefined;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100);
  const milestoneCopy = MILESTONE_COPY[progressPercent];
  const unlockedState = allAnswered ? "All set. Continue to your report." : "Please answer all questions to continue.";

  const onSelect = (questionId: string, value: AnswerValue) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    localStorage.setItem("answers", JSON.stringify(next));
  };
  const onSelectAndAdvance = (questionId: string, value: AnswerValue) => {
    onSelect(questionId, value);
    setActiveSelection({ questionId, value });

    const isFinalQuestion = currentQuestionIndex === QUESTIONS.length - 1;

    window.setTimeout(() => {
      if (isFinalQuestion) {
        router.push("/user-info");
        return;
      }

      setCurrentQuestionIndex((index) => Math.min(QUESTIONS.length - 1, index + 1));
    }, reducedMotion ? 0 : 220);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--brand-bg)]">
      <ThreadBackground variant={1} />
      <div className="relative z-10">
        <SiteHeader />
        <motion.main
          className="mx-auto w-full max-w-[1200px] px-6 py-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {currentQuestion && (
            <motion.section
              className="rounded-2xl bg-[var(--brand-surface)] p-6 shadow-[0_4px_16px_rgba(17,24,39,0.08)] md:p-8"
              variants={panelReveal}
            >
                <motion.div className="flex flex-wrap items-center justify-between gap-3" variants={heroStaggerContainer} initial="hidden" animate="visible">
                  <motion.p
                    className="text-base font-semibold text-[var(--brand-muted)]"
                    key={`chapter-${currentQuestionIndex}`}
                    variants={chapterPulse}
                    initial="idle"
                    animate="active"
                  >
                    Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                  </motion.p>
                </motion.div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--brand-accent)] transition-all"
                    initial={false}
                    animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                    transition={transitionForReducedMotion(!!reducedMotion)}
                    style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {milestoneCopy ? (
                    <motion.p
                      key={`milestone-${progressPercent}`}
                      className="mt-3 inline-flex rounded-full bg-[var(--brand-bg)] px-3 py-1 text-xs font-semibold text-[var(--brand-accent)]"
                      variants={milestoneGlow}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -4 }}
                    >
                      {milestoneCopy}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    className="mt-5 rounded-xl bg-[var(--brand-bg)] p-5 md:p-6"
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                    transition={transitionForReducedMotion(!!reducedMotion)}
                  >
                    <motion.p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-muted)]" variants={heroStaggerItem} initial="hidden" animate="visible">
                      {currentEnabler ? `${currentEnabler.order}. ${currentEnabler.shortName}` : "Question"}
                    </motion.p>
                    <motion.p className="mt-3 text-2xl font-medium leading-[1.25] text-[#1f2937] md:text-3xl" variants={heroStaggerItem} initial="hidden" animate="visible">
                      {currentQuestion.text}
                    </motion.p>

                    <div className="mt-5 rounded-xl bg-white p-4 md:p-5">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6">
                        {SCALE_OPTIONS.map((option) => {
                          const isSelected =
                            activeSelection?.questionId === currentQuestion.id && activeSelection.value === option.value;
                          const isNotSure = option.value === "N/A";
                          return (
                            <motion.button
                              key={`${currentQuestion.id}-${option.value}`}
                              type="button"
                              onClick={() => onSelectAndAdvance(currentQuestion.id, option.value)}
                              whileHover={reducedMotion ? undefined : { y: -1 }}
                              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                              className={`rounded-lg border px-3 py-3 text-center text-xs font-semibold transition md:text-sm ${
                                isSelected
                                  ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                                  : isNotSure
                                    ? "border-[#c7ced9] bg-[#f3f4f6] text-[var(--brand-ink)] hover:border-[var(--brand-accent)]"
                                    : "border-[#9ca3af] bg-white text-[var(--brand-ink)] hover:border-[var(--brand-accent)]"
                              }`}
                              aria-label={`${option.label} for ${currentQuestion.text}`}
                            >
                              {option.label}
                            </motion.button>
                          );
                        })}
                      </div>

                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}
                    disabled={currentQuestionIndex === 0}
                    whileHover={currentQuestionIndex === 0 || reducedMotion ? undefined : { y: -1 }}
                    whileTap={currentQuestionIndex === 0 || reducedMotion ? undefined : { scale: 0.98 }}
                    className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                      currentQuestionIndex === 0
                        ? "cursor-not-allowed bg-[#d1d5db] text-white"
                        : "bg-white text-[var(--brand-ink)] ring-1 ring-[#9ca3af] hover:ring-[var(--brand-accent)]"
                    }`}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((index) => Math.min(QUESTIONS.length - 1, index + 1))}
                    disabled={currentQuestionIndex === QUESTIONS.length - 1}
                    whileHover={currentQuestionIndex === QUESTIONS.length - 1 || reducedMotion ? undefined : { y: -1 }}
                    whileTap={currentQuestionIndex === QUESTIONS.length - 1 || reducedMotion ? undefined : { scale: 0.98 }}
                    className={`rounded-lg px-5 py-3 text-sm font-semibold ${
                      currentQuestionIndex === QUESTIONS.length - 1
                        ? "cursor-not-allowed bg-[#d1d5db] text-white"
                        : "bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-strong)]"
                    }`}
                  >
                    Next
                  </motion.button>
                </div>
            </motion.section>
          )}

          <motion.div
            className="mt-8 flex items-center justify-between rounded-2xl bg-[var(--brand-surface)] p-6 shadow-[0_4px_16px_rgba(17,24,39,0.08)]"
            variants={fadeInUp}
            animate={allAnswered ? { boxShadow: "0 8px 26px rgba(37,99,235,0.18)" } : undefined}
            transition={transitionForReducedMotion(!!reducedMotion, 0.25)}
          >
            <p className="text-base text-[var(--brand-muted)]">
              {unlockedState}
            </p>
            <motion.div whileHover={allAnswered && !reducedMotion ? { y: -1 } : undefined} whileTap={allAnswered && !reducedMotion ? { scale: 0.98 } : undefined}>
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
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
