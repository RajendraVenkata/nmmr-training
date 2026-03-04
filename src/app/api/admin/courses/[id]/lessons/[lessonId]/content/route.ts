import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";
import { lessonContentSchema } from "@/lib/validators";

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

function findLessonInCourse(
  course: { modules?: { lessons?: { _id: { toString(): string } }[] }[] },
  lessonId: string
) {
  for (const mod of course.modules || []) {
    for (const lesson of mod.lessons || []) {
      if (lesson._id.toString() === lessonId) {
        return lesson;
      }
    }
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    await connectDB();

    const course = await Course.findById(params.id).lean();
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!findLessonInCourse(course, params.lessonId)) {
      return NextResponse.json(
        { error: "Lesson not found in course" },
        { status: 404 }
      );
    }

    const content = await LessonContent.findOne({
      courseId: params.id,
      lessonId: params.lessonId,
    }).lean();

    if (!content) {
      return NextResponse.json(
        { error: "No content found for this lesson" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: content._id.toString(),
      courseId: content.courseId.toString(),
      lessonId: content.lessonId.toString(),
      type: content.type,
      markdownContent: content.markdownContent,
      quizData: content.quizData,
      imageData: content.imageData,
      inlineImages: content.inlineImages,
      version: content.version,
      updatedAt: content.updatedAt,
    });
  } catch (error) {
    console.error("Admin fetch lesson content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();

    const parsed = lessonContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();

    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!findLessonInCourse(course, params.lessonId)) {
      return NextResponse.json(
        { error: "Lesson not found in course" },
        { status: 404 }
      );
    }

    const contentData: Record<string, unknown> = {
      courseId: params.id,
      lessonId: params.lessonId,
      type: parsed.data.type,
      updatedBy: result.session.user.id,
    };

    if (
      parsed.data.type === "markdown" ||
      parsed.data.type === "document"
    ) {
      contentData.markdownContent = parsed.data.markdownContent;
    } else if (parsed.data.type === "quiz") {
      contentData.quizData = parsed.data.quizData;
    } else if (parsed.data.type === "image") {
      contentData.imageData = parsed.data.imageData;
    }

    // Handle inline images if provided
    if (body.inlineImages) {
      contentData.inlineImages = body.inlineImages;
    }

    const content = await LessonContent.findOneAndUpdate(
      { courseId: params.id, lessonId: params.lessonId },
      { ...contentData, $inc: { version: 1 } },
      { new: true, upsert: true }
    );

    // Update contentRef on the lesson subdocument
    await Course.updateOne(
      { _id: params.id, "modules.lessons._id": params.lessonId },
      { $set: { "modules.$[].lessons.$[lesson].contentRef": content._id } },
      { arrayFilters: [{ "lesson._id": params.lessonId }] }
    );

    return NextResponse.json({
      id: content._id.toString(),
      courseId: content.courseId.toString(),
      lessonId: content.lessonId.toString(),
      type: content.type,
      version: content.version,
      message: "Content saved successfully",
    });
  } catch (error) {
    console.error("Admin save lesson content error:", error);
    return NextResponse.json(
      { error: "Failed to save lesson content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    await connectDB();

    const deleted = await LessonContent.findOneAndDelete({
      courseId: params.id,
      lessonId: params.lessonId,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "No content found for this lesson" },
        { status: 404 }
      );
    }

    // Clear contentRef on the lesson subdocument
    await Course.updateOne(
      { _id: params.id, "modules.lessons._id": params.lessonId },
      {
        $unset: {
          "modules.$[].lessons.$[lesson].contentRef": "",
        },
      },
      { arrayFilters: [{ "lesson._id": params.lessonId }] }
    );

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Admin delete lesson content error:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson content" },
      { status: 500 }
    );
  }
}
