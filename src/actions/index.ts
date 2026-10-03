import { ActionError, defineAction, type ActionErrorCode } from "astro:actions";
import { z } from "astro/zod";
import { COURSE_ID_REGEX, QUIZ_QUESTIONS } from "@/lib/constants";
import { HttpError } from "@/lib/errors";
import { submitQuiz } from "@/server/services/quiz.service";

const STATUS_TO_CODE: Record<number, ActionErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  429: "TOO_MANY_REQUESTS",
};

export const server = {
  submitQuiz: defineAction({
    input: z.object({
      courseId: z.string().regex(COURSE_ID_REGEX),
      answers: z.array(z.number().int().min(0).max(3)).length(QUIZ_QUESTIONS),
    }),
    handler: async ({ courseId, answers }, ctx) => {
      const user = ctx.locals.user;
      if (!user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Inicia sesión para enviar la evaluación",
        });
      }
      try {
        // El userId sale de la sesión, nunca de la petición
        return await submitQuiz(user.id, courseId, answers);
      } catch (error) {
        if (error instanceof HttpError) {
          throw new ActionError({
            code: STATUS_TO_CODE[error.status] ?? "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw error;
      }
    },
  }),
};
