import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================================
// Admin: Course Form
// ============================================================

export const courseFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  longDescription: z.string(),
  category: z.enum([
    "GenAI",
    "Agentic AI",
    "Prompt Engineering",
    "AI Development",
    "AI Consulting",
    "Machine Learning",
  ]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be 0 or more"),
  currency: z.string(),
  instructor: z.string().min(2, "Instructor name is required"),
  status: z.enum(["draft", "published", "archived"]),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;

// ============================================================
// Admin: Module & Lesson Forms
// ============================================================

export const moduleFormSchema = z.object({
  title: z
    .string()
    .min(2, "Module title must be at least 2 characters")
    .max(200, "Module title must be less than 200 characters"),
});

export type ModuleFormData = z.infer<typeof moduleFormSchema>;

export const lessonFormSchema = z.object({
  title: z
    .string()
    .min(2, "Lesson title must be at least 2 characters")
    .max(200, "Lesson title must be less than 200 characters"),
  type: z.enum(["video", "document", "quiz", "markdown"]),
  content: z.string(),
  duration: z.string().min(1, "Duration is required"),
  isFree: z.boolean(),
});

export type LessonFormData = z.infer<typeof lessonFormSchema>;

// ============================================================
// Admin: User Role
// ============================================================

export const userRoleSchema = z.object({
  role: z.enum(["learner", "admin"]),
});

export type UserRoleFormData = z.infer<typeof userRoleSchema>;
