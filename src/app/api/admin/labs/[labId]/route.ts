import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lab } from "@/lib/models/Lab";

export const dynamic = "force-dynamic";

// GET /api/admin/labs/:labId — get specific lab config
export async function GET(
  request: Request,
  { params }: { params: { labId: string } }
) {
  try {
    // Support both admin JWT and API key auth (for relay service)
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      const session = await auth();
      if (!session || (session.user as { role?: string }).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await connectDB();
    const lab = await Lab.findOne({ labId: params.labId }).lean();

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error(`GET /api/admin/labs/${params.labId} error:`, err);
    return NextResponse.json(
      { error: "Failed to fetch lab" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/labs/:labId — update lab definition
export async function PUT(
  request: Request,
  { params }: { params: { labId: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();
    const lab = await Lab.findOne({ labId: params.labId });

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    // Update fields
    if (body.name !== undefined) lab.name = body.name;
    if (body.dockerImage !== undefined) lab.dockerImage = body.dockerImage;
    if (body.description !== undefined) lab.description = body.description;
    if (body.resources) {
      if (body.resources.cpuLimit !== undefined)
        lab.resources.cpuLimit = body.resources.cpuLimit;
      if (body.resources.memoryLimit !== undefined)
        lab.resources.memoryLimit = body.resources.memoryLimit;
      if (body.resources.diskLimit !== undefined)
        lab.resources.diskLimit = body.resources.diskLimit;
      if (body.resources.timeoutMinutes !== undefined)
        lab.resources.timeoutMinutes = body.resources.timeoutMinutes;
    }
    if (body.preloadFiles !== undefined) lab.preloadFiles = body.preloadFiles;
    if (body.startupCommand !== undefined)
      lab.startupCommand = body.startupCommand;
    if (body.networkEnabled !== undefined)
      lab.networkEnabled = body.networkEnabled;
    if (body.isActive !== undefined) lab.isActive = body.isActive;

    await lab.save();

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error(`PUT /api/admin/labs/${params.labId} error:`, err);
    return NextResponse.json(
      { error: "Failed to update lab" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/labs/:labId — delete lab definition
export async function DELETE(
  request: Request,
  { params }: { params: { labId: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const lab = await Lab.findOne({ labId: params.labId });

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    await Lab.deleteOne({ labId: params.labId });

    return NextResponse.json({ message: "Lab deleted successfully" });
  } catch (err) {
    console.error(`DELETE /api/admin/labs/${params.labId} error:`, err);
    return NextResponse.json(
      { error: "Failed to delete lab" },
      { status: 500 }
    );
  }
}
