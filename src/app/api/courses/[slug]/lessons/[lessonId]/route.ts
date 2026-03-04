import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";
import { Enrollment } from "@/lib/models/Enrollment";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    await connectDB();

    const course = await Course.findOne({
      slug: params.slug,
      status: "published",
    }).lean();

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Find the lesson in the course modules
    let foundLesson = null;
    for (const mod of course.modules || []) {
      for (const lesson of mod.lessons || []) {
        if (lesson._id.toString() === params.lessonId) {
          foundLesson = lesson;
          break;
        }
      }
      if (foundLesson) break;
    }

    if (!foundLesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Check access: free lessons are always accessible
    if (!foundLesson.isFree) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const enrollment = await Enrollment.findOne({
        userId: session.user.id,
        courseId: course._id,
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: "Enrollment required to access this lesson" },
          { status: 403 }
        );
      }
    }

    // Fetch lesson content from LessonContent collection
    const content = await LessonContent.findOne({
      courseId: course._id,
      lessonId: params.lessonId,
    }).lean();

    if (!content) {
      return NextResponse.json(
        { error: "Lesson content not available yet" },
        { status: 404 }
      );
    }

    const response: Record<string, unknown> = {
      id: content._id.toString(),
      courseId: content.courseId.toString(),
      lessonId: content.lessonId.toString(),
      type: content.type,
    };

    if (content.type === "markdown" || content.type === "document") {
      response.markdownContent = content.markdownContent || "";
    } else if (content.type === "quiz") {
      response.quizData = content.quizData;
    } else if (content.type === "image") {
      response.imageData = content.imageData;
    }

    if (content.inlineImages && content.inlineImages.length > 0) {
      response.inlineImages = content.inlineImages;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fetch lesson content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson content" },
      { status: 500 }
    );
  }
}
