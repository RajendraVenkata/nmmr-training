"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  BarChart3,
  User,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { formatPrice } from "@/lib/utils";
import type { CourseDetail } from "@/types";

export default function CoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then((res) => {
        if (res.status === 404) {
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
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/courses" className="text-primary hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const lessonsCount = course.lessonsCount;

  // Extract "What you'll learn" from longDescription
  const learnItems = course.longDescription
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .slice(0, 6)
    .map((line) => line.replace("- ", ""));

  return (
    <div>
      {/* Hero section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">
                  {course.difficulty.charAt(0).toUpperCase() +
                    course.difficulty.slice(1)}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {course.instructor}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {lessonsCount} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  {course.modules.length} modules
                </span>
              </div>
            </div>

            {/* Pricing card */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-20">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold">
                    {course.price === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      formatPrice(course.price, course.currency)
                    )}
                  </span>
                </div>

                <EnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  price={course.price}
                />

                <Separator className="my-4" />

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {course.duration} of content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {lessonsCount} lessons across {course.modules.length} modules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Hands-on projects included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            {learnItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  What You&apos;ll Learn
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {learnItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <CourseCurriculum modules={course.modules} />

            {/* Instructor */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Instructor</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">
                    AI Expert & Instructor at NMMR Technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
