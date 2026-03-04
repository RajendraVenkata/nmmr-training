import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { CourseImage } from "@/lib/models/CourseImage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    await connectDB();

    const image = await CourseImage.findById(params.imageId)
      .select("base64 mimeType")
      .lean();

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(image.base64, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("Serve image error:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
