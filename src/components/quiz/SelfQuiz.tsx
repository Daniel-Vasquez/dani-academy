import { useEffect, useReducer, useRef } from "react";
import { actions } from "astro:actions";
import { cn } from "@/lib/cn";
import { renderInline } from "@/lib/inline-code";
import type { SelfQuestion, SubmitQuizResult } from "@/server/services/quiz.service";

/** Lo mínimo para ver la rúbrica: obliga a escribir algo antes de leer qué se esperaba */
export const MIN_REFLECTION_CHARS = 40;

type Verdict = 0 | 1 | null;

export type SelfQuizState =
  | {
      status: "answering";
      step: number;
      texts: string[];
      revealed: boolean[];
      verdicts: Verdict[];
      error?: string;
    }
  | {
      status: "submitting";
      step: number;
      texts: string[];
      revealed: boolean[];
      verdicts: Verdict[];
    }
  | { status: "done"; texts: string[]; verdicts: (0 | 1)[]; result: SubmitQuizResult };

export type SelfQuizAction =
  | { type: "write"; text: string }
  | { type: "reveal" }
  | { type: "judge"; verdict: 0 | 1 }
  | { type: "go"; step: number }
  | { type: "submit" }
  | { type: "failed"; error: string }
  | { type: "graded"; result: SubmitQuizResult }
  | { type: "retry" };

export const initialSelfQuizState = (count: number, texts?: string[]): SelfQuizState => ({
  status: "answering",
  step: 0,
  texts: texts ?? Array<string>(count).fill(""),
  revealed: Array<boolean>(count).fill(false),
  verdicts: Array<Verdict>(count).fill(null),
});

const at = <T,>(list: T[], i: number, value: T) => list.map((v, j) => (j === i ? value : v));

/** Reducer puro (temario I2.3): se testea sin montar el componente */
export function selfQuizReducer(state: SelfQuizState, action: SelfQuizAction): SelfQuizState {
  switch (action.type) {
    case "write":
      if (state.status !== "answering") return state;
      return { ...state, error: undefined, texts: at(state.texts, state.step, action.text) };
    case "reveal": {
      if (state.status !== "answering") return state;
      const text = state.texts[state.step] ?? "";
      if (text.trim().length < MIN_REFLECTION_CHARS) return state;
      return { ...state, revealed: at(state.revealed, state.step, true) };
    }
    case "judge":
      if (state.status !== "answering" || !state.revealed[state.step]) return state;
      return {
        ...state,
        error: undefined,
        verdicts: at(state.verdicts, state.step, action.verdict),
      };
    case "go":
      if (state.status !== "answering") return state;
      return { ...state, step: Math.max(0, Math.min(action.step, state.texts.length - 1)) };
    case "submit":
      if (state.status !== "answering" || state.verdicts.some((v) => v === null)) return state;
      return { ...state, status: "submitting", error: undefined } as SelfQuizState;
    case "failed":
      if (state.status !== "submitting") return state;
      return { ...state, status: "answering", error: action.error };
    case "graded":
      if (state.status !== "submitting") return state;
      return {
        status: "done",
        texts: state.texts,
        verdicts: state.verdicts as (0 | 1)[],
        result: action.result,
      };
    case "retry":
      // Las reflexiones se conservan: el segundo intento suele ser revisarlas, no empezar de cero
      return initialSelfQuizState(state.texts.length, state.texts);
  }
}

interface Props {
  courseId: string;
  courseHref: string;
  questions: SelfQuestion[];
}

const primaryButton =
  "rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
  "rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold ring-1 ring-surface-2 transition ring-inset hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50";

const VERDICTS = [
  { value: 1, label: "Cumple todos los puntos" },
  { value: 0, label: "No los cumple todos" },
] as const;

export default function SelfQuiz({ courseId, courseHref, questions }: Props) {
  const [state, dispatch] = useReducer(selfQuizReducer, questions.length, (n) =>
    initialSelfQuizState(n),
  );
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
    if (state.status !== "answering" || state.verdicts.some((v) => v === null)) return;
    const answers = state.verdicts as number[];
    dispatch({ type: "submit" });
    const { data, error } = await actions.submitQuiz({ courseId, answers });
    if (error) dispatch({ type: "failed", error: error.message });
    else dispatch({ type: "graded", result: data });
  }

  if (state.status === "done") {
    const { result, texts, verdicts } = state;
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
              ? "Has superado la evaluación del proyecto. Tu valoración se ha guardado en tu progreso; tus respuestas, no: cópialas si quieres conservarlas."
              : `Necesitas ${result.passingScore}/${result.total}. Revisa las respuestas que no cumplían la rúbrica y vuelve a intentarlo: se conservan hasta que salgas de la página.`}
          </p>
        </div>

        <ol className="space-y-6">
          {questions.map((q, i) => (
            <li key={i} className="rounded-2xl border border-surface-2 p-5">
              <p className="text-xs font-medium tracking-wider text-muted uppercase">
                Pregunta {i + 1} ·{" "}
                <span className={verdicts[i] === 1 ? "text-accent-strong" : "text-danger-strong"}>
                  {verdicts[i] === 1 ? "Cumple" : "No cumple"}
                </span>
              </p>
              <p className="mt-2 font-serif text-lg">{renderInline(q.prompt)}</p>
              <p className="mt-3 border-l-2 border-surface-2 pl-3 font-serif whitespace-pre-wrap text-muted">
                {texts[i]}
              </p>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "retry" })}
            className={secondaryButton}
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

  const { step, texts, revealed, verdicts } = state;
  const question = questions[step]!;
  const text = texts[step] ?? "";
  const missing = MIN_REFLECTION_CHARS - text.trim().length;
  const isLast = step === questions.length - 1;
  const judgedCount = verdicts.filter((v) => v !== null).length;
  const submitting = state.status === "submitting";

  return (
    <section aria-labelledby="quiz-question" className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Pregunta {step + 1} de {questions.length}
        </span>
        <span>
          {judgedCount}/{questions.length} valoradas
        </span>
      </div>

      <h2
        id="quiz-question"
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-xl leading-snug font-medium focus:outline-none"
      >
        {renderInline(question.prompt)}
      </h2>

      <div className="space-y-2">
        <label htmlFor={`reflexion-${step}`} className="block text-sm font-medium">
          Tu respuesta
        </label>
        <textarea
          key={step}
          id={`reflexion-${step}`}
          rows={8}
          value={text}
          disabled={submitting}
          onChange={(e) => dispatch({ type: "write", text: e.target.value })}
          aria-describedby={`reflexion-ayuda-${step}`}
          className="w-full rounded-xl border border-surface-2 bg-bg p-4 font-serif leading-relaxed focus-visible:outline-2 focus-visible:outline-accent-strong"
        />
        <p id={`reflexion-ayuda-${step}`} className="text-sm text-muted">
          Responde sobre tu proyecto, con ejemplos concretos. No se guarda: solo tu valoración.
        </p>
      </div>

      {revealed[step] ? (
        <div className="space-y-4 rounded-2xl border border-surface-2 bg-surface p-5">
          <p className="text-sm font-semibold">Una buena respuesta…</p>
          <ul className="list-disc space-y-2 pl-5 font-serif">
            {question.rubric.map((point, i) => (
              <li key={i}>{renderInline(point)}</li>
            ))}
          </ul>
          <fieldset disabled={submitting} className="space-y-2">
            <legend className="text-sm font-semibold">
              ¿Tu respuesta cumple todos los puntos?
            </legend>
            {VERDICTS.map((v) => (
              <label
                key={v.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-strong",
                  verdicts[step] === v.value
                    ? "border-accent bg-accent/10"
                    : "border-surface-2 hover:bg-bg",
                )}
              >
                <input
                  type="radio"
                  name={`veredicto-${step}`}
                  className="accent-(--accent-strong)"
                  checked={verdicts[step] === v.value}
                  onChange={() => dispatch({ type: "judge", verdict: v.value })}
                />
                {v.label}
              </label>
            ))}
          </fieldset>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={missing > 0}
            onClick={() => dispatch({ type: "reveal" })}
            className={secondaryButton}
          >
            Ver la rúbrica
          </button>
          {missing > 0 && (
            <span className="text-sm text-muted">
              Escribe al menos {MIN_REFLECTION_CHARS} caracteres (faltan {missing}).
            </span>
          )}
        </div>
      )}

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
            disabled={judgedCount < questions.length || submitting}
            onClick={submit}
            className={primaryButton}
          >
            {submitting ? "Guardando…" : "Enviar valoración"}
          </button>
        ) : (
          <button
            type="button"
            disabled={verdicts[step] === null}
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
