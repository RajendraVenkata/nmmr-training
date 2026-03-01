"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/CourseForm";
import type { CourseFormData } from "@/lib/validators";

interface CourseData {
  _id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  difficulty: string;
  price: number;
  currency: string;
  instructor: string;
  status: string;
}

export default function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) setCourse(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Course Not Found</h1>
        <p className="text-muted-foreground">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  const defaultValues = {
    title: course.title,
    slug: course.slug,
    description: course.description,
    longDescription: course.longDescription,
    category: course.category,
    difficulty: course.difficulty,
    price: course.price,
    currency: course.currency,
    instructor: course.instructor,
    status: course.status,
  } as Partial<CourseFormData>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-muted-foreground mt-1">{course.title}</p>
        </div>
      </div>

      <CourseForm mode="edit" defaultValues={defaultValues} courseId={id} />
    </div>
  );
}
