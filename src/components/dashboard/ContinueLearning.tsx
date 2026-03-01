"use client";

import Link from "next/link";
import { PlayCircle, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { SampleEnrollment } from "@/data/sample-enrollments";

interface ContinueLearningProps {
  enrollment: SampleEnrollment | undefined;
}

export function ContinueLearning({ enrollment }: ContinueLearningProps) {
  if (!enrollment) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-10">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No courses in progress</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start learning by enrolling in a course.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {enrollment.courseTitle}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {enrollment.courseInstructor} &middot;{" "}
              {enrollment.completedLessons.length}/{enrollment.totalLessons}{" "}
              lessons completed
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Progress
                value={enrollment.progress}
                className="h-2 flex-1"
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {enrollment.progress}%
              </span>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link
              href={`/dashboard/courses/${enrollment.courseSlug}`}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Resume
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
