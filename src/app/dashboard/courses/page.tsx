"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import {
  getActiveEnrollments,
  getCompletedEnrollments,
  SAMPLE_USER_ID,
} from "@/data/sample-enrollments";

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
  const { data: session } = useSession();
  const userId = session?.user?.id || SAMPLE_USER_ID;

  const activeEnrollments = getActiveEnrollments(userId);
  const completedEnrollments = getCompletedEnrollments(userId);

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
