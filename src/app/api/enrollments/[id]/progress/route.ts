import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, action = "complete" } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "lessonId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const enrollment = await Enrollment.findById(params.id);
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    if (enrollment.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "uncomplete") {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id: string) => id !== lessonId
      );
    } else {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    }

    const course = await Course.findById(enrollment.courseId);
    if (course) {
      const totalLessons = course.modules.reduce(
        (acc: number, m: { lessons: unknown[] }) => acc + m.lessons.length,
        0
      );
      enrollment.progress =
        totalLessons > 0
          ? Math.round(
              (enrollment.completedLessons.length / totalLessons) * 100
            )
          : 0;

      if (enrollment.progress === 100 && enrollment.status !== "completed") {
        enrollment.status = "completed";
        enrollment.completedAt = new Date();
      }
    }

    await enrollment.save();

    return NextResponse.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      status: enrollment.status,
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
