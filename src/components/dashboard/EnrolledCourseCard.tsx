"use client";

import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { EnrollmentWithCourse } from "@/types";

interface EnrolledCourseCardProps {
  enrollment: EnrollmentWithCourse;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const isCompleted = enrollment.status === "completed";

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {enrollment.courseCategory}
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
              Completed
            </Badge>
          )}
        </div>
        <CardTitle className="text-base leading-tight">
          {enrollment.courseTitle}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {enrollment.courseInstructor}
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {enrollment.courseDuration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {enrollment.completedLessons.length}/{enrollment.totalLessons}{" "}
            lessons
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{enrollment.progress}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-2" />
        </div>

        <Button
          variant={isCompleted ? "outline" : "default"}
          size="sm"
          className="w-full mt-1"
          asChild
        >
          <Link href={`/dashboard/courses/${enrollment.courseSlug}`}>
            {isCompleted ? "Review Course" : "Continue Learning"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
