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
