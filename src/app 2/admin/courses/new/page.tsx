"use client";

import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to create a new course.
        </p>
      </div>

      <CourseForm mode="create" />
    </div>
  );
}
