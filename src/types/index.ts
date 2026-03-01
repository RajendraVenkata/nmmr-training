// ============================================================
// User Types
// ============================================================

export type UserRole = "learner" | "admin";
export type AuthProvider = "credentials" | "google";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Course Types
// ============================================================

export type CourseStatus = "draft" | "published" | "archived";
export type CourseDifficulty = "beginner" | "intermediate" | "advanced";
export type LessonType = "video" | "document" | "quiz" | "markdown";
export type CourseCategory =
  | "GenAI"
  | "Agentic AI"
  | "Prompt Engineering"
  | "AI Development"
  | "AI Consulting"
  | "Machine Learning";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  duration: string;
  order: number;
  isFree: boolean;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: string;
  status: CourseStatus;
  instructor: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: string;
  instructor: string;
  lessonsCount: number;
}

// ============================================================
// Enrollment Types
// ============================================================

export type EnrollmentStatus = "active" | "completed";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  completedLessons: string[];
  enrolledAt: Date;
  completedAt?: Date;
}

// ============================================================
// Transaction Types (Payment - Optional)
// ============================================================

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded";
export type PaymentProvider = "razorpay" | "stripe";

export interface Transaction {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentProvider: PaymentProvider;
  paymentId: string;
  createdAt: Date;
}

// ============================================================
// Navigation Types
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

// ============================================================
// API Response Types
// ============================================================

/** Enrollment joined with course data (returned by GET /api/enrollments) */
export interface EnrollmentWithCourse {
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

/** Admin course list item (returned by GET /api/admin/courses) */
export interface AdminCourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: CourseDifficulty;
  price: number;
  currency: string;
  status: CourseStatus;
  instructor: string;
  modulesCount: number;
  lessonsCount: number;
  createdAt: string;
}

/** Admin user list item (returned by GET /api/admin/users) */
export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  enrollmentsCount: number;
}

/** Admin dashboard stats */
export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  revenue: number;
}

/** Recent enrollment for admin dashboard */
export interface AdminRecentEnrollment {
  id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  enrolledAt: string;
  progress: number;
  status: string;
}

/** Public course list item (returned by GET /api/courses) */
export interface PublicCourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: string;
  difficulty: CourseDifficulty;
  duration: string;
  instructor: string;
  lessonsCount: number;
}

/** Full course detail (returned by GET /api/courses/[slug]) */
export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: string;
  difficulty: CourseDifficulty;
  duration: string;
  status: CourseStatus;
  instructor: string;
  lessonsCount: number;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      type: LessonType;
      content: string;
      duration: string;
      order: number;
      isFree: boolean;
    }[];
  }[];
}
