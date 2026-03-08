"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, GraduationCap, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { formatPrice } from "@/lib/utils";
import type { PublicCourseItem } from "@/types";

export default function CoursesPage() {
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  // Fetch all published courses
  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch enrolled course IDs for authenticated users
  useEffect(() => {
    if (status !== "authenticated") {
      setEnrolledCourseIds(new Set());
      return;
    }

    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const ids = new Set<string>(
            data.map((e: { courseId: string }) => e.courseId)
          );
          setEnrolledCourseIds(ids);
        }
      })
      .catch(() => {});
  }, [status]);

  const filteredCourses = useMemo(() => {
    let result = courses;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedDifficulty) {
      result = result.filter((c) => c.difficulty === selectedDifficulty);
    }

    return result;
  }, [courses, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeading
        title="Browse Courses"
        subtitle="Explore our training catalog and find the right course for your learning goals."
      />

      {/* Pricing Tiers */}
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="rounded-xl border bg-green-50 dark:bg-green-950/30 p-5 text-center">
          <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <h3 className="font-semibold text-lg">Beginner</h3>
          <p className="text-sm text-muted-foreground mb-1">10 courses · B1–B10</p>
          <p className="text-2xl font-bold">{formatPrice(2999, "INR")}</p>
        </div>
        <div className="rounded-xl border bg-amber-50 dark:bg-amber-950/30 p-5 text-center">
          <GraduationCap className="h-6 w-6 mx-auto mb-2 text-amber-600" />
          <h3 className="font-semibold text-lg">Intermediate</h3>
          <p className="text-sm text-muted-foreground mb-1">10 courses · I1–I10</p>
          <p className="text-2xl font-bold">{formatPrice(4999, "INR")}</p>
        </div>
        <div className="rounded-xl border bg-red-50 dark:bg-red-950/30 p-5 text-center">
          <Rocket className="h-6 w-6 mx-auto mb-2 text-red-600" />
          <h3 className="font-semibold text-lg">Advanced</h3>
          <p className="text-sm text-muted-foreground mb-1">13 courses · A1–A13</p>
          <p className="text-2xl font-bold">{formatPrice(7999, "INR")}</p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <CourseSearch value={searchQuery} onChange={setSearchQuery} />
        <CourseFilters
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No courses found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                description={course.description}
                price={course.price}
                currency={course.currency}
                category={course.category}
                difficulty={course.difficulty}
                duration={course.duration}
                instructor={course.instructor}
                lessonsCount={course.lessonsCount}
                isEnrolled={enrolledCourseIds.has(course.id)}
                courseNumber={course.courseNumber}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
