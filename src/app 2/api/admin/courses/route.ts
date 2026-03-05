import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";

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

export async function GET() {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    await connectDB();

    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      courses.map((c) => ({
        id: c._id.toString(),
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        price: c.price,
        currency: c.currency,
        status: c.status,
        instructor: c.instructor,
        modulesCount: c.modules?.length || 0,
        lessonsCount:
          c.modules?.reduce(
            (acc: number, m: { lessons?: unknown[] }) =>
              acc + (m.lessons?.length || 0),
            0
          ) || 0,
        createdAt: c.createdAt,
      }))
    );
  } catch (error) {
    console.error("Admin courses list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const body = await request.json();

    await connectDB();

    const course = await Course.create({
      ...body,
      modules: [],
    });

    return NextResponse.json(
      {
        message: "Course created",
        course: {
          id: course._id.toString(),
          slug: course.slug,
          title: course.title,
          status: course.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin course create error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
