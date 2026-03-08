import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { getPublishedCourses, type SampleCourse } from "@/data/sample-courses";

export const dynamic = "force-dynamic";

function sampleToPublic(courses: SampleCourse[], query: string, category: string, difficulty: string) {
  let filtered = courses;
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    );
  }
  if (category) filtered = filtered.filter((c) => c.category === category);
  if (difficulty) filtered = filtered.filter((c) => c.difficulty === difficulty);

  return filtered.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail || "/images/placeholder-course.webp",
    price: c.price,
    currency: c.currency,
    category: c.category,
    difficulty: c.difficulty,
    duration: c.duration,
    instructor: c.instructor,
    lessonsCount: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const difficulty = searchParams.get("difficulty") || "";

    // Try MongoDB first; fall back to sample data if DB is unavailable
    try {
      await connectDB();
    } catch {
      const result = sampleToPublic(getPublishedCourses(), query, category, difficulty);
      return NextResponse.json(result);
    }

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

    // If DB is connected but empty, fall back to sample data
    if (courses.length === 0) {
      const result = sampleToPublic(getPublishedCourses(), query, category, difficulty);
      return NextResponse.json(result);
    }

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
