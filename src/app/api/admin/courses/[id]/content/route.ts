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

    return NextResponse.json({
      message: "Content updated",
      modulesCount: course.modules.length,
      lessonsCount: course.modules.reduce(
        (acc: number, m: { lessons?: unknown[] }) =>
          acc + (m.lessons?.length || 0),
        0
      ),
    });
  } catch (error) {
    console.error("Admin content update error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
