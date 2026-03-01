"use client";

import { useState, useMemo } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { getPublishedCourses, getLessonsCount } from "@/data/sample-courses";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const allCourses = getPublishedCourses();

  const filteredCourses = useMemo(() => {
    let courses = allCourses;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      courses = courses.filter((c) => c.category === selectedCategory);
    }

    if (selectedDifficulty) {
      courses = courses.filter((c) => c.difficulty === selectedDifficulty);
    }

    return courses;
  }, [allCourses, searchQuery, selectedCategory, selectedDifficulty]);

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

      {filteredCourses.length === 0 ? (
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
                lessonsCount={getLessonsCount(course)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
