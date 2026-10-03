import { useEffect, useReducer, useRef } from "react";
import { actions } from "astro:actions";
import { cn } from "@/lib/cn";
import { renderInline } from "@/lib/inline-code";
import type { PublicQuestion, SubmitQuizResult } from "@/server/services/quiz.service";

type Answers = (number | null)[];

export type QuizState =
  | { status: "answering"; step: number; answers: Answers; error?: string }
  | { status: "submitting"; step: number; answers: Answers }
  | { status: "done"; answers: number[]; result: SubmitQuizResult };

export type QuizAction =
  | { type: "select"; option: number }
  | { type: "go"; step: number }
  | { type: "submit" }
  | { type: "failed"; error: string }
  | { type: "graded"; result: SubmitQuizResult }
  | { type: "reset"; count: number };

export const initialQuizState = (count: number): QuizState => ({
  status: "answering",
  step: 0,
  answers: Array<number | null>(count).fill(null),
});

/** Reducer puro (temario I2.3): se testea sin montar el componente */
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "select":
      if (state.status !== "answering") return state;
      return {
        ...state,
        error: undefined,
        answers: state.answers.map((a, i) => (i === state.step ? action.option : a)),
      };
    case "go":
      if (state.status !== "answering") return state;
      return { ...state, step: Math.max(0, Math.min(action.step, state.answers.length - 1)) };
    case "submit":
      if (state.status !== "answering" || state.answers.some((a) => a === null)) return state;
      return { status: "submitting", step: state.step, answers: state.answers };
    case "failed":
      if (state.status !== "submitting") return state;
      return { status: "answering", step: state.step, answers: state.answers, error: action.error };
    case "graded":
      if (state.status !== "submitting") return state;
      return { status: "done", answers: state.answers as number[], result: action.result };
    case "reset":
      return initialQuizState(action.count);
  }
}

interface Props {
  courseId: string;
  courseHref: string;
  questions: PublicQuestion[];
}

const LETTERS = ["A", "B", "C", "D"];

const primaryButton =
  "rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export default function Quiz({ courseId, courseHref, questions }: Props) {
  const [state, dispatch] = useReducer(quizReducer, questions.length, initialQuizState);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Al cambiar de pregunta o mostrar el resultado, el foco va al título (lectores de pantalla y teclado)
  const focusKey = state.status === "done" ? "done" : `q${state.step}`;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [focusKey]);

  async function submit() {
    if (state.status !== "answering" || state.answers.some((a) => a === null)) return;
    const answers = state.answers as number[];
    dispatch({ type: "submit" });
    const { data, error } = await actions.submitQuiz({ courseId, answers });
    if (error) dispatch({ type: "failed", error: error.message });
    else dispatch({ type: "graded", result: data });
  }

  if (state.status === "done") {
    const { result, answers } = state;
    return (
      <section aria-labelledby="quiz-result" className="space-y-8">
        <div
          className={cn(
            "rounded-2xl border p-6",
            result.passed ? "border-accent/50 bg-accent/10" : "border-warning/50 bg-warning/10",
          )}
        >
          <h2
            id="quiz-result"
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-2xl font-semibold focus:outline-none"
          >
            {result.passed ? "¡Aprobado!" : "Aún no"} · {result.score}/{result.total}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {result.passed
              ? "Has superado la evaluación de este curso. El resultado se ha guardado en tu progreso."
              : `Necesitas ${result.passingScore}/${result.total}. Repasa las explicaciones y vuelve a intentarlo.`}
          </p>
        </div>

        <ol className="space-y-6">
          {questions.map((q, i) => {
            const review = result.review[i]!;
            return (
              <li key={i} className="rounded-2xl border border-surface-2 p-5">
                <p className="text-xs font-medium tracking-wider text-muted uppercase">
                  Pregunta {i + 1} ·{" "}
                  <span className={review.isCorrect ? "text-accent-strong" : "text-danger-strong"}>
                    {review.isCorrect ? "Correcta" : "Incorrecta"}
                  </span>
                </p>
                <p className="mt-2 font-serif text-lg">{renderInline(q.prompt)}</p>
                <p className="mt-3 text-sm">
                  Tu respuesta: <strong>{renderInline(q.options[answers[i]!]!)}</strong>
                </p>
                {!review.isCorrect && (
                  <p className="mt-1 text-sm">
                    Correcta:{" "}
                    <strong className="text-accent-strong">
                      {renderInline(q.options[review.correctAnswer]!)}
                    </strong>
                  </p>
                )}
                <p className="mt-3 border-l-2 border-accent pl-3 font-serif text-muted">
                  {renderInline(review.explanation)}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "reset", count: questions.length })}
            className="rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold ring-1 ring-surface-2 transition ring-inset hover:bg-surface-2"
          >
            Reintentar
          </button>
          <a href={courseHref} className={primaryButton}>
            Volver al curso
          </a>
        </div>
      </section>
    );
  }

  const { step, answers } = state;
  const question = questions[step]!;
  const isLast = step === questions.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const submitting = state.status === "submitting";

  return (
    <section aria-labelledby="quiz-question" className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Pregunta {step + 1} de {questions.length}
        </span>
        <span>
          {answeredCount}/{questions.length} respondidas
        </span>
      </div>

      <fieldset disabled={submitting} className="space-y-4">
        <legend className="sr-only">Pregunta {step + 1}</legend>
        <h2
          id="quiz-question"
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-xl leading-snug font-medium focus:outline-none"
        >
          {renderInline(question.prompt)}
        </h2>
        {question.code && (
          <pre className="overflow-x-auto rounded-xl border border-surface-2 bg-surface p-4 font-mono text-sm leading-relaxed">
            <code>{question.code}</code>
          </pre>
        )}
        <div className="space-y-2" role="radiogroup" aria-labelledby="quiz-question">
          {question.options.map((option, i) => (
            <label
              key={i}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-strong",
                answers[step] === i
                  ? "border-accent bg-accent/10"
                  : "border-surface-2 hover:bg-surface",
              )}
            >
              <input
                type="radio"
                name={`q-${step}`}
                className="mt-1 accent-(--accent-strong)"
                checked={answers[step] === i}
                onChange={() => dispatch({ type: "select", option: i })}
              />
              <span>
                <span className="mr-2 font-semibold text-muted">{LETTERS[i]}.</span>
                {renderInline(option)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.status === "answering" && state.error && (
        <p
          role="alert"
          className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger-strong"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={step === 0 || submitting}
          onClick={() => dispatch({ type: "go", step: step - 1 })}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface disabled:opacity-40"
        >
          ← Anterior
        </button>
        {isLast ? (
          <button
            type="button"
            disabled={answeredCount < questions.length || submitting}
            onClick={submit}
            className={primaryButton}
          >
            {submitting ? "Corrigiendo…" : "Enviar respuestas"}
          </button>
        ) : (
          <button
            type="button"
            disabled={answers[step] === null}
            onClick={() => dispatch({ type: "go", step: step + 1 })}
            className={primaryButton}
          >
            Siguiente →
          </button>
        )}
      </div>
    </section>
  );
}
