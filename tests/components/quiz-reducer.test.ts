import { describe, expect, it } from "vitest";
import { initialQuizState, quizReducer, type QuizState } from "@/components/quiz/Quiz";
import type { SubmitQuizResult } from "@/server/services/quiz.service";

const answerAll = (state: QuizState, options: number[]) =>
  options.reduce(
    (s, option, step) =>
      quizReducer(quizReducer(s, { type: "go", step }), { type: "select", option }),
    state,
  );

const RESULT: SubmitQuizResult = { score: 4, total: 5, passed: true, passingScore: 4, review: [] };

describe("quizReducer", () => {
  it("empieza en la primera pregunta sin respuestas", () => {
    expect(initialQuizState(5)).toEqual({
      status: "answering",
      step: 0,
      answers: Array(5).fill(null),
    });
  });

  it("select guarda la respuesta de la pregunta actual", () => {
    const s = quizReducer(quizReducer(initialQuizState(3), { type: "go", step: 1 }), {
      type: "select",
      option: 2,
    });
    expect(s).toMatchObject({ step: 1, answers: [null, 2, null] });
  });

  it("go no se sale de los límites", () => {
    expect(quizReducer(initialQuizState(5), { type: "go", step: 99 })).toMatchObject({ step: 4 });
    expect(quizReducer(initialQuizState(5), { type: "go", step: -3 })).toMatchObject({ step: 0 });
  });

  it("no envía con respuestas vacías", () => {
    const s = answerAll(initialQuizState(5), [1, 2, 0]);
    expect(quizReducer(s, { type: "submit" })).toBe(s);
  });

  it("envía cuando todas tienen respuesta", () => {
    const s = quizReducer(answerAll(initialQuizState(5), [1, 2, 0, 3, 1]), { type: "submit" });
    expect(s).toMatchObject({ status: "submitting", answers: [1, 2, 0, 3, 1] });
  });

  it("failed vuelve a answering con el error y conserva las respuestas", () => {
    const sending = quizReducer(answerAll(initialQuizState(5), [1, 2, 0, 3, 1]), {
      type: "submit",
    });
    const s = quizReducer(sending, { type: "failed", error: "Demasiados intentos seguidos" });
    expect(s).toMatchObject({
      status: "answering",
      answers: [1, 2, 0, 3, 1],
      error: "Demasiados intentos seguidos",
    });
    // Elegir otra opción borra el error
    expect(quizReducer(s, { type: "select", option: 0 })).not.toHaveProperty(
      "error",
      expect.anything(),
    );
  });

  it("graded pasa a done con el resultado", () => {
    const sending = quizReducer(answerAll(initialQuizState(5), [1, 2, 0, 3, 1]), {
      type: "submit",
    });
    expect(quizReducer(sending, { type: "graded", result: RESULT })).toEqual({
      status: "done",
      answers: [1, 2, 0, 3, 1],
      result: RESULT,
    });
  });

  it("ignora acciones fuera de su estado", () => {
    const answering = initialQuizState(5);
    expect(quizReducer(answering, { type: "failed", error: "x" })).toBe(answering);
    expect(quizReducer(answering, { type: "graded", result: RESULT })).toBe(answering);
    const sending = quizReducer(answerAll(answering, [1, 2, 0, 3, 1]), { type: "submit" });
    expect(quizReducer(sending, { type: "select", option: 3 })).toBe(sending);
  });

  it("reset vuelve al estado inicial", () => {
    const sending = quizReducer(answerAll(initialQuizState(5), [1, 2, 0, 3, 1]), {
      type: "submit",
    });
    const done = quizReducer(sending, { type: "graded", result: RESULT });
    expect(quizReducer(done, { type: "reset", count: 5 })).toEqual(initialQuizState(5));
  });
});
