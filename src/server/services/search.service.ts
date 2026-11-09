import { buildSearchIndex, mdxToPlainText, searchIndex } from "@/lib/domain/search";
import { getCourses, getCourseSections, sectionUrl } from "@/lib/content";

type SearchIndex = ReturnType<typeof buildSearchIndex>;

// El contenido solo cambia con un despliegue: el índice se construye una vez por instancia
let indexPromise: Promise<SearchIndex> | null = null;

async function createIndex(): Promise<SearchIndex> {
  const courses = (await getCourses()).filter((c) => c.data.published);
  const documents = await Promise.all(
    courses.map(async (course) =>
      (await getCourseSections(course.id)).map((section) => ({
        sectionId: section.data.sectionId,
        sectionTitle: section.data.title,
        courseTitle: course.data.title,
        url: sectionUrl(course, section),
        text: mdxToPlainText(section.body ?? ""),
      })),
    ),
  );
  return buildSearchIndex(documents.flat());
}

export async function searchCourses(query: string) {
  indexPromise ??= createIndex().catch((error) => {
    indexPromise = null; // el siguiente intento vuelve a construirlo
    throw error;
  });
  return searchIndex(await indexPromise, query);
}
