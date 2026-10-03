import { getCollection, type CollectionEntry } from "astro:content";

export type Course = CollectionEntry<"courses">;
export type Section = CollectionEntry<"sections">;

export async function getCourses(): Promise<Course[]> {
  const courses = await getCollection("courses");
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const courses = await getCollection("courses");
  return courses.find((c) => c.data.slug === slug);
}

export async function getCourseSections(courseId: string): Promise<Section[]> {
  const sections = await getCollection("sections", (s) => s.data.course.id === courseId);
  return sections.sort((a, b) => a.data.order - b.data.order);
}

export async function getSectionById(sectionId: string): Promise<Section | undefined> {
  const [section] = await getCollection("sections", (s) => s.data.sectionId === sectionId);
  return section;
}

/** "typescript-desde-cero/03-arrays-tuplas-y-objetos" → "03-arrays-tuplas-y-objetos" */
export const sectionSlug = (section: Section): string => section.id.split("/").at(-1)!;

export const courseUrl = (course: Course): string => `/cursos/${course.data.slug}`;

export const sectionUrl = (course: Course, section: Section): string =>
  `${courseUrl(course)}/${sectionSlug(section)}`;
