import { NextResponse } from "next/server";
import { getCourseBySlug, getLessonsCount } from "@/data/sample-courses";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const course = getCourseBySlug(params.slug);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...course,
    lessonsCount: getLessonsCount(course),
  });
}
