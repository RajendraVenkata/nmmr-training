import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";
import { getCourseBySlug } from "@/data/sample-courses";

export const dynamic = "force-dynamic";

function sampleCourseToDetail(slug: string) {
  const sc = getCourseBySlug(slug);
  if (!sc) return null;
  return {
    id: sc.id,
    slug: sc.slug,
    title: sc.title,
    description: sc.description,
    longDescription: sc.longDescription,
    thumbnail: sc.thumbnail || "/images/placeholder-course.webp",
    thumbnailUrl: null,
    price: sc.price,
    currency: sc.currency,
    category: sc.category,
    difficulty: sc.difficulty,
    duration: sc.duration,
    status: sc.status,
    instructor: sc.instructor,
    tags: [],
    prerequisites: [],
    lessonsCount: sc.modules.reduce((acc, m) => acc + m.lessons.length, 0),
    modules: sc.modules.map((m) => ({
      id: m.id,
      title: m.title,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        duration: l.duration,
        order: l.order,
        isFree: l.isFree,
        hasContent: false,
      })),
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Try MongoDB first; fall back to sample data if DB is unavailable
    try {
      await connectDB();
    } catch {
      const detail = sampleCourseToDetail(params.slug);
      if (!detail) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }
      return NextResponse.json(detail);
    }

    const course = await Course.findOne({
      slug: params.slug,
      status: "published",
    }).lean();

    if (!course) {
      // Try sample data as fallback
      const detail = sampleCourseToDetail(params.slug);
      if (detail) return NextResponse.json(detail);
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const lessonsCount =
      course.modules?.reduce(
        (acc: number, m: { lessons?: unknown[] }) =>
          acc + (m.lessons?.length || 0),
        0
      ) || 0;

    // Get all lesson IDs that have content
    const lessonContentDocs = await LessonContent.find(
      { courseId: course._id },
      { lessonId: 1 }
    ).lean();
    const contentLessonIds = new Set(
      lessonContentDocs.map((d) => d.lessonId.toString())
    );

    const thumbnailUrl = course.thumbnailRef
      ? `/api/images/${course.thumbnailRef.toString()}`
      : null;

    return NextResponse.json({
      id: course._id.toString(),
      slug: course.slug,
      title: course.title,
      description: course.description,
      longDescription: course.longDescription || "",
      thumbnail: thumbnailUrl || course.thumbnail || "/images/placeholder-course.webp",
      thumbnailUrl,
      price: course.price,
      currency: course.currency || "INR",
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      status: course.status,
      instructor: course.instructor,
      tags: course.tags || [],
      prerequisites: course.prerequisites || [],
      lessonsCount,
      modules: (course.modules || []).map(
        (m: {
          _id: { toString: () => string };
          title: string;
          order: number;
          lessons: {
            _id: { toString: () => string };
            title: string;
            type: string;
            duration: string;
            order: number;
            isFree: boolean;
            contentRef?: { toString: () => string };
          }[];
        }) => ({
          id: m._id.toString(),
          title: m.title,
          order: m.order,
          lessons: (m.lessons || []).map((l) => ({
            id: l._id.toString(),
            title: l.title,
            type: l.type,
            duration: l.duration,
            order: l.order,
            isFree: l.isFree,
            hasContent: contentLessonIds.has(l._id.toString()),
          })),
        })
      ),
    });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
