"use client";

import { useState, useEffect, useMemo } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { CourseFilters } from "@/components/courses/CourseFilters";
import type { PublicCourseItem } from "@/types";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
