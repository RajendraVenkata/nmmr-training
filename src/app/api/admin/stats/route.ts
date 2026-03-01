import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { User } from "@/lib/models/User";
import { Enrollment } from "@/lib/models/Enrollment";

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

    const [totalUsers, totalCourses, publishedCourses, draftCourses, totalEnrollments, revenueResult] =
      await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Course.countDocuments({ status: "published" }),
        Course.countDocuments({ status: "draft" }),
        Enrollment.countDocuments(),
        Enrollment.aggregate([
          {
            $lookup: {
              from: "courses",
              localField: "courseId",
              foreignField: "_id",
              as: "course",
            },
          },
          { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: null,
              total: { $sum: { $ifNull: ["$course.price", 0] } },
            },
          },
        ]),
      ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();

    const userIds = recentEnrollments.map((e) => e.userId);
    const courseIds = recentEnrollments.map((e) => e.courseId);

    const [users, courses] = await Promise.all([
      User.find({ _id: { $in: userIds } }).lean(),
      Course.find({ _id: { $in: courseIds } }).lean(),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

    const recentEnrollmentsList = recentEnrollments.map((e) => {
      const user = userMap.get(e.userId.toString());
      const course = courseMap.get(e.courseId.toString());
      return {
        id: e._id.toString(),
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "unknown@example.com",
        courseTitle: course?.title || "Unknown Course",
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        status: e.status,
      };
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        revenue,
      },
      recentEnrollments: recentEnrollmentsList,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
