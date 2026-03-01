import type { EnrollmentStatus } from "@/types";
import { sampleCourses } from "./sample-courses";

export interface SampleEnrollment {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string;
  status: EnrollmentStatus;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  completedAt?: string;
  courseTitle: string;
  courseCategory: string;
  courseThumbnail: string;
  courseInstructor: string;
  courseDuration: string;
  coursePrice: number;
  courseCurrency: string;
  totalLessons: number;
}

export const SAMPLE_USER_ID = "sample-user-1";

export const sampleEnrollments: SampleEnrollment[] = [
  {
    id: "enr-1",
    userId: SAMPLE_USER_ID,
    courseId: "1",
    courseSlug: "introduction-to-generative-ai",
    status: "active",
    progress: 42,
    completedLessons: ["l1", "l2", "l3", "l4", "l5"],
    enrolledAt: "2025-11-15T10:30:00Z",
    courseTitle: "Introduction to Generative AI",
    courseCategory: "GenAI",
    courseThumbnail: "/images/placeholder-course.webp",
    courseInstructor: "Dr. Priya Sharma",
    courseDuration: "6 hours",
    coursePrice: 0,
    courseCurrency: "INR",
    totalLessons: 12,
  },
  {
    id: "enr-2",
    userId: SAMPLE_USER_ID,
    courseId: "3",
    courseSlug: "prompt-engineering-masterclass",
    status: "active",
    progress: 18,
    completedLessons: ["l28", "l29"],
    enrolledAt: "2025-12-20T14:00:00Z",
    courseTitle: "Prompt Engineering Masterclass",
    courseCategory: "Prompt Engineering",
    courseThumbnail: "/images/placeholder-course.webp",
    courseInstructor: "Dr. Priya Sharma",
    courseDuration: "8 hours",
    coursePrice: 2999,
    courseCurrency: "INR",
    totalLessons: 11,
  },
  {
    id: "enr-3",
    userId: SAMPLE_USER_ID,
    courseId: "6",
    courseSlug: "ai-strategy-for-leaders",
    status: "completed",
    progress: 100,
    completedLessons: [
      "l60", "l61", "l62", "l63", "l64",
      "l65", "l66", "l67", "l68", "l69",
    ],
    enrolledAt: "2025-09-01T08:00:00Z",
    completedAt: "2025-10-15T16:00:00Z",
    courseTitle: "AI Strategy for Business Leaders",
    courseCategory: "AI Consulting",
    courseThumbnail: "/images/placeholder-course.webp",
    courseInstructor: "Dr. Priya Sharma",
    courseDuration: "5 hours",
    coursePrice: 3999,
    courseCurrency: "INR",
    totalLessons: 10,
  },
  {
    id: "enr-4",
    userId: SAMPLE_USER_ID,
    courseId: "2",
    courseSlug: "building-ai-agents-with-langchain",
    status: "active",
    progress: 7,
    completedLessons: ["l13"],
    enrolledAt: "2026-01-10T09:00:00Z",
    courseTitle: "Building AI Agents with LangChain",
    courseCategory: "Agentic AI",
    courseThumbnail: "/images/placeholder-course.webp",
    courseInstructor: "Rajesh Kumar",
    courseDuration: "12 hours",
    coursePrice: 4999,
    courseCurrency: "INR",
    totalLessons: 15,
  },
];

export function getEnrollmentsForUser(userId: string) {
  return sampleEnrollments.filter((e) => e.userId === userId);
}

export function getEnrollmentById(id: string) {
  return sampleEnrollments.find((e) => e.id === id);
}

export function getEnrollmentByUserAndCourse(
  userId: string,
  courseSlug: string
) {
  return sampleEnrollments.find(
    (e) => e.userId === userId && e.courseSlug === courseSlug
  );
}

export function getActiveEnrollments(userId: string) {
  return getEnrollmentsForUser(userId).filter((e) => e.status === "active");
}

export function getCompletedEnrollments(userId: string) {
  return getEnrollmentsForUser(userId).filter((e) => e.status === "completed");
}

export function getTotalHoursLearned(userId: string): string {
  const enrollments = getEnrollmentsForUser(userId);
  let totalMinutes = 0;

  for (const enrollment of enrollments) {
    const course = sampleCourses.find((c) => c.id === enrollment.courseId);
    if (!course) continue;

    const allLessons = course.modules.flatMap((m) => m.lessons);
    for (const lesson of allLessons) {
      if (enrollment.completedLessons.includes(lesson.id)) {
        const mins = parseInt(lesson.duration) || 0;
        totalMinutes += mins;
      }
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
