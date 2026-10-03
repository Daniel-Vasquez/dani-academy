import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { COURSE_ID_REGEX, SECTION_ID_REGEX } from "@/lib/constants";

const courses = defineCollection({
  loader: file("src/content/courses.json"),
  schema: z.object({
    id: z.string().regex(COURSE_ID_REGEX),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    level: z.enum(["basic", "intermediate", "advanced", "final"]),
    order: z.number().int().positive(),
    objective: z.string(),
    prerequisites: z.array(z.string()), // IDs de curso ("B1") o texto libre ("JavaScript")
    plannedSections: z.number().int().positive(),
    published: z.boolean(),
  }),
});

const sections = defineCollection({
  // Ignora archivos que empiecen por "_" (borradores)
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/sections" }),
  schema: z.object({
    sectionId: z.string().regex(SECTION_ID_REGEX),
    course: reference("courses"),
    title: z.string(),
    order: z.number().int().positive(),
    minutes: z.number().int().positive().default(60),
    summary: z.string().max(220),
  }),
});

export const collections = { courses, sections };
