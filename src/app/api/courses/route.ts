import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";

    await connectDB();

    const filter: Record<string, unknown> = { status: "published" };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { instructor: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const courses = await Course.find(filter).sort({ _id: -1 }).lean();

    const result = courses.map((c) => {
      const thumbnailUrl = c.thumbnailRef
        ? `/api/images/${c.thumbnailRef.toString()}`
        : null;
      return {
        id: c._id.toString(),
        slug: c.slug,
        title: c.title,
        description: c.description,
        thumbnail: thumbnailUrl || c.thumbnail || "/images/placeholder-course.webp",
        price: c.price,
        currency: c.currency || "INR",
        category: c.category,
        difficulty: c.difficulty,
        duration: c.duration,
        instructor: c.instructor,
        lessonsCount:
          c.modules?.reduce(
            (acc: number, m: { lessons?: unknown[] }) =>
              acc + (m.lessons?.length || 0),
            0
          ) || 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
