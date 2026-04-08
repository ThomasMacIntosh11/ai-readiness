import { ENABLERS } from "./enablers";
import { QUESTIONS } from "./questions";
import { isScoredAnswer, type Answers } from "./answers";

export type ScoreRow = {
  enablerId: string;
  enablerName: string;
  score: number;
  scoredResponses: number;
};

export type Maturity = {
  label: "Explorer" | "Builder" | "Integrator" | "Market Shaper";
  range: string;
};

function scoreFromOneToFive(value: number) {
  return Math.round(((value - 1) / 4) * 100);
}

export function calculateCategoryScores(answers: Answers): ScoreRow[] {
  return ENABLERS.map((enabler) => {
    const enablerQuestions = QUESTIONS.filter((q) => q.enablerId === enabler.id);
    const values = enablerQuestions
      .map((q) => answers[q.id])
      .filter(isScoredAnswer);

    if (values.length === 0) {
      return { enablerId: enabler.id, enablerName: enabler.name, score: 0, scoredResponses: 0 };
    }

    const avg = values.reduce((total, value) => total + value, 0) / values.length;
    return {
      enablerId: enabler.id,
      enablerName: enabler.name,
      score: scoreFromOneToFive(avg),
      scoredResponses: values.length,
    };
  });
}

export function calculateOverallScore(categoryScores: ScoreRow[]) {
  const scoredCategories = categoryScores.filter((row) => row.scoredResponses > 0);

  if (scoredCategories.length === 0) {
    return 0;
  }

  const total = scoredCategories.reduce((sum, row) => sum + row.score, 0);
  return Math.round(total / scoredCategories.length);
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
