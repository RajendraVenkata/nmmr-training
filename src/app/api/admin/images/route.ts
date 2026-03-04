import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { CourseImage } from "@/lib/models/CourseImage";
import { imageUploadSchema } from "@/lib/validators";

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
    const { courseId, purpose = "inline" } = body;

    const parsed = imageUploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();

    const image = await CourseImage.create({
      courseId: courseId || null,
      purpose,
      filename: parsed.data.filename,
      mimeType: parsed.data.mimeType,
      base64: parsed.data.base64,
      width: body.width,
      height: body.height,
      sizeBytes: parsed.data.sizeBytes,
      altText: parsed.data.altText,
      uploadedBy: result.session.user.id,
    });

    return NextResponse.json(
      {
        id: image._id.toString(),
        filename: image.filename,
        mimeType: image.mimeType,
        purpose: image.purpose,
        sizeBytes: image.sizeBytes,
        altText: image.altText,
        url: `/api/images/${image._id.toString()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const result = await requireAdmin();
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const purpose = searchParams.get("purpose");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (courseId) filter.courseId = courseId;
    if (purpose) filter.purpose = purpose;

    await connectDB();

    const total = await CourseImage.countDocuments(filter);
    const images = await CourseImage.find(filter)
      .select("-base64") // Exclude base64 from listing
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      images: images.map((img) => ({
        id: img._id.toString(),
        courseId: img.courseId?.toString() || null,
        purpose: img.purpose,
        filename: img.filename,
        mimeType: img.mimeType,
        sizeBytes: img.sizeBytes,
        altText: img.altText,
        url: `/api/images/${img._id.toString()}`,
        createdAt: img.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    );
  }
}
