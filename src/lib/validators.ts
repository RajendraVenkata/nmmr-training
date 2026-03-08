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

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

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
  type: z.enum(["markdown", "document", "quiz", "image"]),
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

// ============================================================
// Content Validation Schemas
// ============================================================

export const quizOptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
  order: z.number().int().min(0),
});

export const quizQuestionSchema = z
  .object({
    questionText: z.string().min(1, "Question text is required"),
    questionType: z.enum(["multiple-choice", "multi-select", "true-false"]),
    options: z
      .array(quizOptionSchema)
      .min(2, "At least 2 options required")
      .max(6, "Maximum 6 options"),
    explanation: z.string(),
    order: z.number().int().min(0),
  })
  .refine((q) => q.options.some((o) => o.isCorrect), {
    message: "At least one option must be correct",
    path: ["options"],
  })
  .refine(
    (q) => q.questionType !== "true-false" || q.options.length === 2,
    {
      message: "True/false questions must have exactly 2 options",
      path: ["options"],
    }
  );

export const quizDataSchema = z.object({
  title: z
    .string()
    .min(3, "Quiz title must be at least 3 characters")
    .max(200, "Quiz title must be less than 200 characters"),
  description: z.string(),
  passingScore: z
    .number()
    .min(0, "Passing score must be 0 or more")
    .max(100, "Passing score must be 100 or less"),
  shuffleQuestions: z.boolean(),
  questions: z
    .array(quizQuestionSchema)
    .min(1, "At least 1 question required")
    .max(50, "Maximum 50 questions"),
});

export type QuizDataFormData = z.infer<typeof quizDataSchema>;

export const imageUploadSchema = z.object({
  base64: z.string().min(1, "Image data is required"),
  mimeType: z.enum([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]),
  filename: z.string().min(1, "Filename is required"),
  altText: z
    .string()
    .min(3, "Alt text must be at least 3 characters")
    .max(200, "Alt text must be less than 200 characters"),
  sizeBytes: z.number().max(2_097_152, "Image must be 2MB or smaller"),
});

export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;

export const lessonContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("markdown"),
    markdownContent: z
      .string()
      .min(1, "Content is required")
      .max(512_000, "Content too large (500KB max)"),
  }),
  z.object({
    type: z.literal("document"),
    markdownContent: z
      .string()
      .min(1, "Content is required")
      .max(512_000, "Content too large (500KB max)"),
  }),
  z.object({
    type: z.literal("quiz"),
    quizData: quizDataSchema,
  }),
  z.object({
    type: z.literal("image"),
    imageData: z.object({
      base64: z.string().min(1, "Image data is required"),
      mimeType: z.enum([
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ]),
      altText: z.string().min(3, "Alt text is required"),
      caption: z.string(),
    }),
  }),
]);

export type LessonContentFormData = z.infer<typeof lessonContentSchema>;

export const quizSubmissionSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required"),
  answers: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      selectedOptions: z.array(z.number().int().min(0)),
    })
  ),
});

export type QuizSubmissionData = z.infer<typeof quizSubmissionSchema>;
