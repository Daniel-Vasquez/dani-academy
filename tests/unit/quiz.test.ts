import { describe, expect, it } from "vitest";
import { gradeQuiz } from "@/lib/domain/quiz";

describe("gradeQuiz", () => {
  const key = [1, 2, 0, 3, 1];

  it.each([
    [[1, 2, 0, 3, 1], 5, true],
    [[1, 2, 0, 3, 0], 4, true],
    [[0, 2, 0, 3, 0], 3, false],
    [[0, 0, 1, 0, 0], 0, false],
  ])("respuestas %j → %i aciertos (aprobado: %s)", (answers, score, passed) => {
    const result = gradeQuiz(key, answers, 4);
    expect(result.score).toBe(score);
    expect(result.passed).toBe(passed);
    expect(result.total).toBe(5);
    expect(result.results).toHaveLength(5);
  });

  it("marca pregunta a pregunta qué respuestas son correctas", () => {
    expect(gradeQuiz(key, [1, 0, 0, 0, 1], 4).results).toEqual([true, false, true, false, true]);
  });

  it("falla si el número de respuestas no coincide", () => {
    expect(() => gradeQuiz(key, [1, 2], 4)).toThrow("Se esperaban 5 respuestas y llegaron 2");
  });
});
