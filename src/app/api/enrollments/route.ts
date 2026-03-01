import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/lib/models/Enrollment";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const enrollments = await Enrollment.find({ userId: session.user.id })
      .sort({ enrolledAt: -1 })
      .lean();

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();
    const courseMap = new Map(
      courses.map((c) => [c._id.toString(), c])
    );

    const result = enrollments.map((e) => {
      const course = courseMap.get(e.courseId.toString());
      const totalLessons = course
        ? course.modules.reduce(
            (acc: number, m: { lessons: unknown[] }) => acc + m.lessons.length,
            0
          )
        : 0;

      return {
        id: e._id.toString(),
        userId: e.userId.toString(),
        courseId: e.courseId.toString(),
        courseSlug: course?.slug || "",
        status: e.status,
        progress: e.progress,
        completedLessons: e.completedLessons,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        courseTitle: course?.title || "",
        courseCategory: course?.category || "",
        courseThumbnail: course?.thumbnail || "",
        courseInstructor: course?.instructor || "",
        courseDuration: course?.duration || "",
        coursePrice: course?.price || 0,
        courseCurrency: course?.currency || "INR",
        totalLessons,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course || course.status !== "published") {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const existing = await Enrollment.findOne({
      userId: session.user.id,
      courseId,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Already enrolled" },
        { status: 409 }
      );
    }

    const enrollment = await Enrollment.create({
      userId: session.user.id,
      courseId,
      status: "active",
      progress: 0,
      completedLessons: [],
    });

    return NextResponse.json(
      {
        message: "Enrolled successfully",
        enrollment: {
          id: enrollment._id.toString(),
          status: enrollment.status,
          progress: enrollment.progress,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}
