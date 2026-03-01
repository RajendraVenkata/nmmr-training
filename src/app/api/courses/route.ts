import { NextResponse } from "next/server";
import { getPublishedCourses, searchCourses, getLessonsCount } from "@/data/sample-courses";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";

  let courses = query ? searchCourses(query) : getPublishedCourses();

  if (category) {
    courses = courses.filter((c) => c.category === category);
  }

  if (difficulty) {
    courses = courses.filter((c) => c.difficulty === difficulty);
  }

  const result = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail,
    price: c.price,
    currency: c.currency,
    category: c.category,
    difficulty: c.difficulty,
    duration: c.duration,
    instructor: c.instructor,
    lessonsCount: getLessonsCount(c),
  }));

  return NextResponse.json(result);
}
