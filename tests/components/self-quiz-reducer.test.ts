import { describe, expect, it } from "vitest";
import {
  initialSelfQuizState,
  MIN_REFLECTION_CHARS,
  selfQuizReducer,
  type SelfQuizAction,
  type SelfQuizState,
} from "@/components/quiz/SelfQuiz";
import type { SubmitQuizResult } from "@/server/services/quiz.service";

const REFLEXION = "x".repeat(MIN_REFLECTION_CHARS);
const RESULT: SubmitQuizResult = { score: 4, total: 5, passed: true, passingScore: 4, review: [] };

const run = (state: SelfQuizState, ...actions: SelfQuizAction[]) =>
  actions.reduce(selfQuizReducer, state);

/** Escribe, ve la rúbrica y valora las primeras preguntas de un total de `count` */
const judgeAll = (verdicts: (0 | 1)[], count = verdicts.length) =>
  verdicts.reduce(
    (s, verdict, step) =>
      run(
        s,
        { type: "go", step },
        { type: "write", text: REFLEXION },
        { type: "reveal" },
        { type: "judge", verdict },
      ),
    initialSelfQuizState(count),
  );

describe("selfQuizReducer", () => {
  it("no enseña la rúbrica hasta que hay una respuesta escrita", () => {
    const corta = run(
      initialSelfQuizState(5),
      { type: "write", text: "  sí  " },
      { type: "reveal" },
    );
    expect(corta).toMatchObject({ revealed: [false, false, false, false, false] });
    const larga = run(corta, { type: "write", text: REFLEXION }, { type: "reveal" });
    expect(larga).toMatchObject({ revealed: [true, false, false, false, false] });
  });

  it("no se puede valorar sin haber visto la rúbrica", () => {
    const s = run(initialSelfQuizState(5), { type: "judge", verdict: 1 });
    expect(s).toMatchObject({ verdicts: [null, null, null, null, null] });
  });

  it("no envía hasta valorar las cinco", () => {
    expect(run(judgeAll([1, 1, 0, 1], 5), { type: "submit" }).status).toBe("answering");
    expect(run(judgeAll([1, 1, 0, 1, 1]), { type: "submit" }).status).toBe("submitting");
  });

  it("guarda el resultado y, al reintentar, conserva las respuestas escritas", () => {
    const done = run(
      judgeAll([1, 1, 0, 1, 1]),
      { type: "submit" },
      { type: "graded", result: RESULT },
    );
    expect(done).toMatchObject({ status: "done", verdicts: [1, 1, 0, 1, 1], result: RESULT });
    const retry = run(done, { type: "retry" });
    expect(retry).toMatchObject({
      status: "answering",
      step: 0,
      texts: Array(5).fill(REFLEXION),
      revealed: Array(5).fill(false),
      verdicts: Array(5).fill(null),
    });
  });

  it("un error al enviar vuelve a la pregunta con el mensaje", () => {
    const s = run(
      judgeAll([1, 1, 1, 1, 1]),
      { type: "submit" },
      { type: "failed", error: "Sin red" },
    );
    expect(s).toMatchObject({ status: "answering", error: "Sin red" });
  });
});
