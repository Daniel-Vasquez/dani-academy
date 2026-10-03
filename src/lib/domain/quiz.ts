export interface GradeResult {
  results: boolean[];
  score: number;
  total: number;
  passed: boolean;
}

export function gradeQuiz(
  answerKey: number[],
  answers: number[],
  passingScore: number,
): GradeResult {
  if (answers.length !== answerKey.length) {
    throw new Error(`Se esperaban ${answerKey.length} respuestas y llegaron ${answers.length}`);
  }
  const results = answerKey.map((correct, i) => answers[i] === correct);
  const score = results.filter(Boolean).length;
  return { results, score, total: answerKey.length, passed: score >= passingScore };
}
