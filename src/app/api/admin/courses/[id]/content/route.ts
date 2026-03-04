import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }
  if ((session.user as { role?: string }).role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }
  return { session };
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { id } = params;
    const { modules } = await request.json();

    if (!Array.isArray(modules)) {
      return NextResponse.json(
        { error: "modules must be an array" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get current course to find removed lessons
    const currentCourse = await Course.findById(id).lean();
    if (!currentCourse) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Collect current lesson IDs
    const currentLessonIds = new Set<string>();
    for (const mod of currentCourse.modules || []) {
      for (const lesson of mod.lessons || []) {
        currentLessonIds.add(lesson._id.toString());
      }
    }

    // Collect new lesson IDs (lessons that have _id)
    const newLessonIds = new Set<string>();
    for (const mod of modules) {
      for (const lesson of mod.lessons || []) {
        if (lesson._id) {
          newLessonIds.add(lesson._id.toString());
        }
      }
    }

    // Find removed lesson IDs
    const removedLessonIds: string[] = [];
    for (const lessonId of Array.from(currentLessonIds)) {
      if (!newLessonIds.has(lessonId)) {
        removedLessonIds.push(lessonId);
      }
    }

    // Delete LessonContent for removed lessons
    if (removedLessonIds.length > 0) {
      await LessonContent.deleteMany({
        courseId: id,
        lessonId: { $in: removedLessonIds },
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { modules },
      { new: true }
    );

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Get content status for each lesson
    const contentDocs = await LessonContent.find(
      { courseId: id },
      { lessonId: 1, type: 1, updatedAt: 1 }
    ).lean();

    const contentMap = new Map(
      contentDocs.map((d) => [
        d.lessonId.toString(),
        { type: d.type, updatedAt: d.updatedAt },
      ])
    );

    const lessonStatuses = [];
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const status = contentMap.get(lesson._id.toString());
        lessonStatuses.push({
          lessonId: lesson._id.toString(),
          hasContent: !!status,
          contentType: status?.type || null,
          lastUpdated: status?.updatedAt || null,
        });
      }
    }

    return NextResponse.json({
      message: "Content updated",
      modulesCount: course.modules.length,
      lessonsCount: course.modules.reduce(
        (acc: number, m: { lessons?: unknown[] }) =>
          acc + (m.lessons?.length || 0),
        0
      ),
      removedLessons: removedLessonIds.length,
      lessonStatuses,
    });
  } catch (error) {
    console.error("Admin content update error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
