import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Enrollment } from "@/lib/models/Enrollment";

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
    const search = searchParams.get("search") || "";

    await connectDB();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(filter).sort({ createdAt: -1 }).lean();

    const userIds = users.map((u) => u._id.toString());
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      enrollmentCounts.map((e: { _id: string; count: number }) => [
        e._id,
        e.count,
      ])
    );

    return NextResponse.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        provider: u.provider || "credentials",
        createdAt: u.createdAt,
        enrollmentsCount: countMap.get(u._id.toString()) || 0,
      }))
    );
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
