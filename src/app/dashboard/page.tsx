"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LearningStats } from "@/components/dashboard/LearningStats";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import type { EnrollmentWithCourse } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Learner";
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEnrollments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeEnrollments = enrollments.filter((e) => e.status === "active");
  const completedEnrollments = enrollments.filter((e) => e.status === "completed");

  const lastActive = activeEnrollments
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )
    .at(0);

  const recentEnrollments = [...enrollments]
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )
    .slice(0, 3);

  // Estimate total hours from course durations and progress
  const totalHours = (() => {
    let totalMinutes = 0;
    for (const e of enrollments) {
      const hours = parseInt(e.courseDuration) || 0;
      totalMinutes += Math.round(hours * 60 * (e.progress / 100));
    }
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  })();

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {userName.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your learning progress.
        </p>
      </div>

      <LearningStats
        enrolledCount={enrollments.length}
        completedCount={completedEnrollments.length}
        totalHours={totalHours}
      />

      <ContinueLearning enrollment={lastActive} />

      {recentEnrollments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Enrollments</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recentEnrollments.map((enrollment) => (
              <EnrolledCourseCard
                key={enrollment.id}
                enrollment={enrollment}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
