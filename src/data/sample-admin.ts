import { sampleCourses } from "./sample-courses";
import { sampleEnrollments } from "./sample-enrollments";
import { sampleUsers } from "./sample-users";

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  revenue: number;
}

export function getAdminStats(): AdminStats {
  const totalUsers = sampleUsers.length;
  const totalCourses = sampleCourses.length;
  const publishedCourses = sampleCourses.filter(
    (c) => c.status === "published"
  ).length;
  const draftCourses = sampleCourses.filter(
    (c) => c.status === "draft"
  ).length;
  const totalEnrollments = sampleEnrollments.length;
  const revenue = sampleEnrollments.reduce(
    (acc, e) => acc + e.coursePrice,
    0
  );

  return {
    totalUsers,
    totalCourses,
    publishedCourses,
    draftCourses,
    totalEnrollments,
    revenue,
  };
}

export interface RecentEnrollment {
  id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  enrolledAt: string;
  progress: number;
  status: string;
}

export function getRecentEnrollments(limit = 5): RecentEnrollment[] {
  return sampleEnrollments
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )
    .slice(0, limit)
    .map((e) => {
      const user = sampleUsers.find((u) => u.id === e.userId);
      return {
        id: e.id,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "unknown@example.com",
        courseTitle: e.courseTitle,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        status: e.status,
      };
    });
}

export function getEnrollmentCountForCourse(courseId: string): number {
  return sampleEnrollments.filter((e) => e.courseId === courseId).length;
}
