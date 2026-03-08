import type { NavItem } from "@/types";

// ============================================================
// Company Information
// ============================================================

export const COMPANY = {
  name: "NMMR Technologies",
  shortName: "NMMR Training",
  legalName: "NMMR Technologies Private Limited",
  tagline: "Master AI Skills That Matter",
  description:
    "A hands-on training platform for Agentic AI — build AI agents from zero to production with Docker-based labs, LangChain, LangGraph, RAG, and cloud deployment.",
  email: "training@nmmr.tech",
  phone: "+91 9876543210",
  address: "Hyderabad, Telangana, India",
  social: {
    linkedin: "https://linkedin.com/company/nmmr-technologies",
    twitter: "https://twitter.com/nmmrtech",
    github: "https://github.com/nmmr-technologies",
  },
} as const;

// ============================================================
// Site Metadata
// ============================================================

export const SITE = {
  name: "NMMR Training",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://training.nmmr.tech",
  title: "NMMR Training - Agentic AI Courses",
  description:
    "Build Agentic AI Applications from Zero to Production — hands-on courses with Docker-based labs covering AI agents, RAG, LangChain, and cloud deployment.",
  ogImage: "/images/og-image.webp",
} as const;

// ============================================================
// Navigation
// ============================================================

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Courses", href: "/dashboard/courses" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Purchases", href: "/dashboard/purchases" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Labs", href: "/admin/labs" },
  { label: "Users", href: "/admin/users" },
];

// ============================================================
// Course Categories & Difficulties
// ============================================================

export const COURSE_CATEGORIES = [
  "AI Foundations",
  "LLM Providers",
  "Prompt Engineering",
  "Agentic AI",
  "RAG & Retrieval",
  "Cloud & Production",
] as const;

export const COURSE_DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

// ============================================================
// Lesson Types
// ============================================================

export const LESSON_TYPES = [
  { value: "markdown", label: "Markdown" },
  { value: "document", label: "Document" },
  { value: "quiz", label: "Quiz" },
  { value: "image", label: "Image" },
] as const;

// ============================================================
// Content Limits
// ============================================================

export const MAX_IMAGE_SIZE_BYTES = 2_097_152; // 2MB
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;
export const MAX_LESSON_CONTENT_SIZE = 512_000; // 500KB for markdown
export const MAX_QUIZ_QUESTIONS = 50;
export const MAX_QUIZ_OPTIONS = 6;

// ============================================================
// Footer Links
// ============================================================

export const FOOTER_LINKS = {
  platform: [
    { label: "Browse Courses", href: "/courses" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Getting Started", href: "/courses?difficulty=beginner" },
    { label: "Agentic AI Courses", href: "/courses?category=Agentic+AI" },
    { label: "Cloud & Production", href: "/courses?category=Cloud+%26+Production" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
} as const;
