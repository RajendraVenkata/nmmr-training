import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { CourseImage } from "@/lib/models/CourseImage";
import { Course } from "@/lib/models/Course";
import { LessonContent } from "@/lib/models/LessonContent";

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

export async function GET(
  _request: Request,
  { params }: { params: { imageId: string } }
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

    const image = await CourseImage.findById(params.imageId).lean();
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: image._id.toString(),
      courseId: image.courseId?.toString() || null,
      purpose: image.purpose,
      filename: image.filename,
      mimeType: image.mimeType,
      base64: image.base64,
      width: image.width,
      height: image.height,
      sizeBytes: image.sizeBytes,
      altText: image.altText,
      createdAt: image.createdAt,
    });
  } catch (error) {
    console.error("Fetch image error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { imageId: string } }
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

    const image = await CourseImage.findById(params.imageId);
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Check if image is referenced as a course thumbnail
    const thumbnailRef = await Course.findOne({
      thumbnailRef: params.imageId,
    }).lean();

    // Check if image is referenced in lesson content inline images
    const contentRef = await LessonContent.findOne({
      "inlineImages.id": params.imageId,
    }).lean();

    if (thumbnailRef || contentRef) {
      const references: string[] = [];
      if (thumbnailRef) {
        references.push(
          `Course thumbnail: "${thumbnailRef.title}"`
        );
      }
      if (contentRef) {
        references.push(
          `Lesson content (courseId: ${contentRef.courseId})`
        );
      }
      return NextResponse.json(
        {
          error: "Image is still referenced",
          references,
        },
        { status: 409 }
      );
    }

    await CourseImage.findByIdAndDelete(params.imageId);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
