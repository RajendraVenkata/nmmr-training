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
export type LessonType = "markdown" | "document" | "quiz" | "image";
export type QuestionType = "multiple-choice" | "multi-select" | "true-false";
export type ImagePurpose = "thumbnail" | "banner" | "inline" | "instructor";
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
  contentRef?: string;
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
  thumbnailRef?: string;
  price: number;
  currency: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: string;
  status: CourseStatus;
  instructor: string;
  tags: string[];
  prerequisites: string[];
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
  thumbnailUrl?: string;
  price: number;
  currency: string;
  category: string;
  difficulty: CourseDifficulty;
  duration: string;
  status: CourseStatus;
  instructor: string;
  tags: string[];
  prerequisites: string[];
  lessonsCount: number;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      type: LessonType;
      duration: string;
      order: number;
      isFree: boolean;
      hasContent: boolean;
    }[];
  }[];
}

// ============================================================
// Quiz Types
// ============================================================

export interface QuizOption {
  text: string;
  isCorrect?: boolean;
  order?: number;
}

export interface QuizQuestion {
  questionText: string;
  questionType: QuestionType;
  options: QuizOption[];
  explanation?: string;
  order?: number;
}

export interface QuizData {
  title: string;
  description?: string;
  passingScore: number;
  shuffleQuestions?: boolean;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  lessonId: string;
  answers: { questionIndex: number; selectedOptions: number[] }[];
  score: number;
  passed: boolean;
  attemptedAt: string;
}

// ============================================================
// Lesson Content Types
// ============================================================

export interface LessonImageData {
  base64: string;
  mimeType: string;
  altText: string;
  caption: string;
}

export interface InlineImage {
  id: string;
  base64: string;
  mimeType: string;
  altText: string;
}

export interface LessonContentData {
  id: string;
  courseId: string;
  lessonId: string;
  type: LessonType;
  markdownContent?: string;
  quizData?: QuizData;
  imageData?: LessonImageData;
  inlineImages?: InlineImage[];
}

// ============================================================
// Course Image Types
// ============================================================

export interface CourseImageData {
  id: string;
  courseId?: string;
  purpose: ImagePurpose;
  filename: string;
  mimeType: string;
  base64: string;
  width?: number;
  height?: number;
  sizeBytes: number;
  altText: string;
}

export interface CourseImageMeta {
  id: string;
  courseId?: string;
  purpose: ImagePurpose;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  createdAt: string;
}

// ============================================================
// Chat Widget Types
// ============================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatLead {
  name: string;
  mobile: string;
}

// ============================================================
// Lab Types (Terminal / Remote Command Execution)
// ============================================================

export interface LabPreloadFile {
  path: string;
  content: string;
}

export interface LabResources {
  cpuLimit: number;
  memoryLimit: string;
  diskLimit: string;
  timeoutMinutes: number;
}

export interface LabDefinition {
  id: string;
  labId: string;
  name: string;
  dockerImage: string;
  description: string;
  resources: LabResources;
  preloadFiles: LabPreloadFile[];
  startupCommand: string | null;
  networkEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabListItem {
  id: string;
  labId: string;
  name: string;
  dockerImage: string;
  description: string;
  resources: LabResources;
  isActive: boolean;
  lessonsUsingLab?: number;
}
