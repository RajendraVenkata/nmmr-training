"use client";

import { useSession } from "next-auth/react";
import { LearningStats } from "@/components/dashboard/LearningStats";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import {
  getEnrollmentsForUser,
  getActiveEnrollments,
  getCompletedEnrollments,
  getTotalHoursLearned,
  SAMPLE_USER_ID,
} from "@/data/sample-enrollments";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || SAMPLE_USER_ID;
  const userName = session?.user?.name || "Learner";

  const allEnrollments = getEnrollmentsForUser(userId);
  const activeEnrollments = getActiveEnrollments(userId);
  const completedEnrollments = getCompletedEnrollments(userId);
  const totalHours = getTotalHoursLearned(userId);

  const lastActive = activeEnrollments
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )
    .at(0);

  const recentEnrollments = allEnrollments
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    )
    .slice(0, 3);

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
        enrolledCount={allEnrollments.length}
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
