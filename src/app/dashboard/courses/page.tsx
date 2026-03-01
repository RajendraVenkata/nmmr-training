"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import type { EnrollmentWithCourse } from "@/types";

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button asChild>
        <Link href="/courses">Browse Courses</Link>
      </Button>
    </div>
  );
}

export default function MyCoursesPage() {
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

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">My Courses</h1>
        <p className="text-muted-foreground">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">My Courses</h1>

      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress ({activeEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedEnrollments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress">
          {activeEnrollments.length === 0 ? (
            <EmptyState message="You haven't enrolled in any courses yet." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-4">
              {activeEnrollments.map((enrollment) => (
                <EnrolledCourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedEnrollments.length === 0 ? (
            <EmptyState message="You haven't completed any courses yet. Keep learning!" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-4">
              {completedEnrollments.map((enrollment) => (
                <EnrolledCourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
