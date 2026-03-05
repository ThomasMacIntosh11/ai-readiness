import { ENABLERS } from "./enablers";
import { QUESTIONS } from "./questions";

export type ScoreRow = {
  enablerId: string;
  enablerName: string;
  score: number;
};

export type Maturity = {
  label: "Explorer" | "Builder" | "Integrator" | "Market Shaper";
  range: string;
};

function scoreFromOneToFive(value: number) {
  return Math.round(((value - 1) / 4) * 100);
}

export function calculateCategoryScores(answers: Record<string, number>): ScoreRow[] {
  return ENABLERS.map((enabler) => {
    const enablerQuestions = QUESTIONS.filter((q) => q.enablerId === enabler.id);
    const values = enablerQuestions
      .map((q) => answers[q.id])
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) {
      return { enablerId: enabler.id, enablerName: enabler.name, score: 0 };
    }

    const avg = values.reduce((total, value) => total + value, 0) / values.length;
    return {
      enablerId: enabler.id,
      enablerName: enabler.name,
      score: scoreFromOneToFive(avg),
    };
  });
}

export function calculateOverallScore(categoryScores: ScoreRow[]) {
  if (categoryScores.length === 0) {
    return 0;
  }

  const total = categoryScores.reduce((sum, row) => sum + row.score, 0);
  return Math.round(total / categoryScores.length);
}

export function maturityFromScore(score: number): Maturity {
  if (score <= 25) {
    return { label: "Explorer", range: "0-25%" };
  }
  if (score <= 50) {
    return { label: "Builder", range: "26-50%" };
  }
  if (score <= 75) {
    return { label: "Integrator", range: "51-75%" };
  }
  return { label: "Market Shaper", range: "76-100%" };
}

export function lowestCategories(categoryScores: ScoreRow[], count: number) {
  return [...categoryScores].sort((a, b) => a.score - b.score).slice(0, count);
}
