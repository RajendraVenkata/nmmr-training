import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lab } from "@/lib/models/Lab";

export const dynamic = "force-dynamic";

// GET /api/admin/labs — list all lab definitions
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const labs = await Lab.find().sort({ _id: -1 }).lean();

    const result = labs.map((lab) => ({
      id: lab._id.toString(),
      labId: lab.labId,
      name: lab.name,
      dockerImage: lab.dockerImage,
      description: lab.description,
      resources: lab.resources || { cpuLimit: 0.5, memoryLimit: "256m", diskLimit: "100m", timeoutMinutes: 30 },
      preloadFiles: lab.preloadFiles || [],
      startupCommand: lab.startupCommand || null,
      networkEnabled: lab.networkEnabled ?? false,
      isActive: lab.isActive ?? true,
      createdAt: lab.createdAt ? new Date(lab.createdAt).toISOString() : null,
      updatedAt: lab.updatedAt ? new Date(lab.updatedAt).toISOString() : null,
    }));

    return NextResponse.json({ labs: result });
  } catch (err) {
    console.error("GET /api/admin/labs error:", err);
    return NextResponse.json(
      { error: "Failed to fetch labs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/labs — create new lab definition
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.labId || !body.name || !body.dockerImage) {
      return NextResponse.json(
        { error: "labId, name, and dockerImage are required" },
        { status: 400 }
      );
    }

    // Validate labId format (slug-like)
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(body.labId) && body.labId.length > 1) {
      return NextResponse.json(
        { error: "labId must be lowercase alphanumeric with hyphens (e.g., python-basics)" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check uniqueness
    const existing = await Lab.findOne({ labId: body.labId });
    if (existing) {
      return NextResponse.json(
        { error: `Lab with labId "${body.labId}" already exists` },
        { status: 409 }
      );
    }

    const lab = await Lab.create({
      labId: body.labId,
      name: body.name,
      dockerImage: body.dockerImage,
      description: body.description || "",
      resources: {
        cpuLimit: body.resources?.cpuLimit || 0.5,
        memoryLimit: body.resources?.memoryLimit || "256m",
        diskLimit: body.resources?.diskLimit || "100m",
        timeoutMinutes: body.resources?.timeoutMinutes || 30,
      },
      preloadFiles: body.preloadFiles || [],
      startupCommand: body.startupCommand || null,
      networkEnabled: body.networkEnabled || false,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json(
      {
        lab: {
          id: lab._id.toString(),
          labId: lab.labId,
          name: lab.name,
          dockerImage: lab.dockerImage,
          description: lab.description,
          resources: lab.resources,
          preloadFiles: lab.preloadFiles,
          startupCommand: lab.startupCommand,
          networkEnabled: lab.networkEnabled,
          isActive: lab.isActive,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/labs error:", err);
    return NextResponse.json(
      { error: "Failed to create lab" },
      { status: 500 }
    );
  }
}
