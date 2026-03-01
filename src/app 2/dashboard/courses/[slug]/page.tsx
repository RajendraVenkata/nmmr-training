"use client";

import { useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CoursePlayerSidebar } from "@/components/dashboard/CoursePlayerSidebar";
import { LessonContent } from "@/components/dashboard/LessonContent";
import { getCourseBySlug } from "@/data/sample-courses";
import {
  getEnrollmentByUserAndCourse,
  SAMPLE_USER_ID,
} from "@/data/sample-enrollments";
import { getLessonContent } from "@/data/sample-lesson-content";

export default function CoursePlayerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const userId = session?.user?.id || SAMPLE_USER_ID;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const course = getCourseBySlug(slug);
  const enrollment = getEnrollmentByUserAndCourse(userId, slug);

  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules
      .sort((a, b) => a.order - b.order)
      .flatMap((m) =>
        m.lessons
          .sort((a, b) => a.order - b.order)
          .map((l) => ({
            ...l,
            moduleId: m.id,
            moduleTitle: m.title,
          }))
      );
  }, [course]);

  const initialLessonId = useMemo(() => {
    if (!enrollment) return allLessons[0]?.id || "";
    const firstUncompleted = allLessons.find(
      (l) => !enrollment.completedLessons.includes(l.id)
    );
    return firstUncompleted?.id || allLessons[0]?.id || "";
  }, [enrollment, allLessons]);

  const [currentLessonId, setCurrentLessonId] = useState(initialLessonId);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(enrollment?.completedLessons || [])
  );

  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === currentLessonId
  );
  const currentLesson = allLessons[currentLessonIndex];

  const progress =
    allLessons.length > 0
      ? Math.round((completedLessons.size / allLessons.length) * 100)
      : 0;

  const handleMarkComplete = useCallback(() => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      next.add(currentLessonId);
      return next;
    });
  }, [currentLessonId]);

  const handleSelectLesson = useCallback(
    (lessonId: string) => {
      setCurrentLessonId(lessonId);
      setMobileSidebarOpen(false);
    },
    []
  );

  const handleNext =
    currentLessonIndex < allLessons.length - 1
      ? () => setCurrentLessonId(allLessons[currentLessonIndex + 1].id)
      : null;

  const handlePrevious =
    currentLessonIndex > 0
      ? () => setCurrentLessonId(allLessons[currentLessonIndex - 1].id)
      : null;

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/courses">Back to My Courses</Link>
        </Button>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Not Enrolled</h2>
        <p className="text-muted-foreground mb-4">
          You need to enroll in this course to access the content.
        </p>
        <Button asChild>
          <Link href={`/courses/${slug}`}>View Course Details</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-0 -m-6 lg:-m-8 min-h-[calc(100vh-8rem)]">
      {/* Mobile sidebar trigger */}
      <div className="lg:hidden flex items-center gap-2 p-4 border-b">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4 mr-1.5" />
              Lessons
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] p-0">
            <CoursePlayerSidebar
              course={course}
              currentLessonId={currentLessonId}
              completedLessons={completedLessons}
              onSelectLesson={handleSelectLesson}
              progress={progress}
            />
          </SheetContent>
        </Sheet>
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          My Courses
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 lg:p-8">
        <Link
          href="/dashboard/courses"
          className="hidden lg:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>

        {currentLesson && (
          <LessonContent
            lesson={currentLesson}
            content={getLessonContent(currentLesson.id)}
            isCompleted={completedLessons.has(currentLessonId)}
            onMarkComplete={handleMarkComplete}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-80 border-l overflow-auto bg-muted/20">
        <CoursePlayerSidebar
          course={course}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onSelectLesson={handleSelectLesson}
          progress={progress}
        />
      </div>
    </div>
  );
}
