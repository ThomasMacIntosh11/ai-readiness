export type NumericAnswer = 1 | 2 | 3 | 4 | 5;
export type AnswerValue = NumericAnswer | "N/A";
export type Answers = Partial<Record<string, AnswerValue>>;

export function isAnswered(value: unknown): value is AnswerValue {
  return value === "N/A" || (typeof value === "number" && value >= 1 && value <= 5);
}

export function isScoredAnswer(value: unknown): value is NumericAnswer {
  return typeof value === "number" && value >= 1 && value <= 5;
}
