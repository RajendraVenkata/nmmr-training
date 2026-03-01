"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseTable } from "@/components/admin/CourseTable";
import type { AdminCourseItem } from "@/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your course catalog.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/courses/new">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            New Course
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading courses...</p>
      ) : (
        <CourseTable courses={courses} />
      )}
    </div>
  );
}
