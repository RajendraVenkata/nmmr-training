import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
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

    const lessonsCount =
      course.modules?.reduce(
        (acc: number, m: { lessons?: unknown[] }) =>
          acc + (m.lessons?.length || 0),
        0
      ) || 0;

    return NextResponse.json({
      id: course._id.toString(),
      slug: course.slug,
      title: course.title,
      description: course.description,
      longDescription: course.longDescription || "",
      thumbnail: course.thumbnail || "/images/placeholder-course.webp",
      price: course.price,
      currency: course.currency || "INR",
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      status: course.status,
      instructor: course.instructor,
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
            content: string;
            duration: string;
            order: number;
            isFree: boolean;
          }[];
        }) => ({
          id: m._id.toString(),
          title: m.title,
          order: m.order,
          lessons: (m.lessons || []).map((l) => ({
            id: l._id.toString(),
            title: l.title,
            type: l.type,
            content: l.content || "",
            duration: l.duration,
            order: l.order,
            isFree: l.isFree,
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
