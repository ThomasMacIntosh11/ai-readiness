import { ENABLERS } from "./enablers";
import { QUESTIONS } from "./questions";
import { isAnswered, scoreForAnswer, type Answers } from "./answers";

export type ScoreRow = {
  enablerId: string;
  enablerName: string;
  score: number;
  scoredResponses: number;
};

export type Maturity = {
  label: "Explorer" | "Pilot" | "Builder" | "Integrator" | "Transformer";
  range: string;
};

function scoreFromAnswered(totalPoints: number, answeredCount: number) {
  if (answeredCount === 0) {
    return 0;
  }

  return Math.round((totalPoints / (answeredCount * 5)) * 100);
}

export function calculateCategoryScores(answers: Answers): ScoreRow[] {
  return ENABLERS.map((enabler) => {
    const enablerQuestions = QUESTIONS.filter((q) => q.enablerId === enabler.id);
    const values = enablerQuestions
      .map((q) => answers[q.id])
      .filter(isAnswered)
      .map(scoreForAnswer);

    if (values.length === 0) {
      return { enablerId: enabler.id, enablerName: enabler.name, score: 0, scoredResponses: 0 };
    }

    const totalPoints = values.reduce((total, value) => total + value, 0);
    return {
      enablerId: enabler.id,
      enablerName: enabler.name,
      score: scoreFromAnswered(totalPoints, values.length),
      scoredResponses: values.length,
    };
  });
}

export function calculateOverallScore(answers: Answers) {
  const values = QUESTIONS.map((q) => answers[q.id]).filter(isAnswered).map(scoreForAnswer);
  const totalPoints = values.reduce((sum, value) => sum + value, 0);

  return scoreFromAnswered(totalPoints, values.length);
}

export function maturityFromScore(score: number): Maturity {
  if (score <= 25) {
    return { label: "Explorer", range: "0-25%" };
  }
  if (score <= 50) {
    return { label: "Pilot", range: "26-50%" };
  }
  if (score <= 70) {
    return { label: "Builder", range: "51-70%" };
  }
  if (score <= 85) {
    return { label: "Integrator", range: "71-85%" };
  }
  return { label: "Transformer", range: "86-100%" };
}

export function lowestCategories(categoryScores: ScoreRow[], count: number) {
  return [...categoryScores].sort((a, b) => a.score - b.score).slice(0, count);
}
