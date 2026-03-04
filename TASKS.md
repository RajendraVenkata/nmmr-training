# NMMR Training Platform - Task Breakdown

> **Status Legend:** `[ ]` Not started | `[~]` In progress | `[x]` Completed

---

## Phase 1: Project Foundation

### 1.1 Project Initialization
- [ ] Initialize Next.js 14 project with TypeScript and App Router (`npx create-next-app@14`)
- [ ] Install and configure Tailwind CSS
- [ ] Install and configure shadcn/ui (init + add core components: button, card, input, label, badge, avatar, dropdown-menu, dialog, sheet, tabs, toast, separator)
- [ ] Install additional dependencies: `lucide-react`, `next-themes`, `framer-motion`
- [ ] Configure `tsconfig.json` path aliases (`@/`)
- [ ] Set up `.env.example` with all required environment variables
- [ ] Set up `.gitignore` (node_modules, .env.local, .next, etc.)
- [ ] Create `src/lib/constants.ts` with company info, navigation links, and site metadata
- [ ] Create `src/types/index.ts` with TypeScript interfaces (User, Course, Module, Lesson, Enrollment)
- [ ] Create `src/lib/utils.ts` with common utility functions (cn, formatDate, formatPrice, slugify)

### 1.2 Layout & Navigation
- [ ] Create root `src/app/layout.tsx` with HTML structure, font loading (Inter, JetBrains Mono), and provider wrappers
- [ ] Create `src/styles/globals.css` with Tailwind directives, CSS variables for colors, and custom utility classes
- [ ] Create `src/components/layout/Header.tsx` — responsive header with logo, nav links (Home, Courses, About, Contact), auth buttons (Login/Register or user avatar dropdown), and theme toggle
- [ ] Create `src/components/layout/MobileMenu.tsx` — slide-out mobile navigation (Sheet component from shadcn)
- [ ] Create `src/components/layout/Footer.tsx` — company info, quick links, social media, copyright
- [ ] Create `src/components/shared/ThemeToggle.tsx` — light/dark mode toggle using `next-themes`
- [ ] Set up `next-themes` ThemeProvider in root layout
- [ ] Create `src/components/layout/Sidebar.tsx` — sidebar navigation for dashboard and admin pages
- [ ] Test responsive navigation at mobile, tablet, and desktop breakpoints

---

## Phase 2: Authentication

### 2.1 Auth Setup
- [ ] Install NextAuth.js v5 (Auth.js): `next-auth@beta @auth/mongodb-adapter`
- [ ] Install password hashing: `bcryptjs` and `@types/bcryptjs`
- [ ] Install form validation: `react-hook-form`, `@hookform/resolvers`, `zod`
- [ ] Create `src/lib/auth.ts` — NextAuth configuration with:
  - Credentials provider (email + password with bcrypt verification)
  - Google OAuth provider
  - JWT strategy with session callback (include user role and id)
  - MongoDB adapter for user persistence
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route handler
- [ ] Create `src/lib/validators.ts` — Zod schemas for login, registration, and profile forms

### 2.2 Database Connection
- [ ] Install MongoDB driver: `mongoose` (or `mongodb` native driver)
- [ ] Create `src/lib/db.ts` — MongoDB connection singleton with connection caching
- [ ] Create `src/lib/models/User.ts` — User model (id, name, email, passwordHash, image, role, provider, timestamps)
- [ ] Create `src/lib/models/Course.ts` — Course model with embedded modules and lessons
- [ ] Create `src/lib/models/Enrollment.ts` — Enrollment model (userId, courseId, progress, completedLessons)
- [ ] Test database connection locally with MongoDB Atlas free tier

### 2.3 Auth Pages
- [ ] Create `src/app/login/page.tsx` — Login page with:
  - Email + password form (react-hook-form + zod validation)
  - "Sign in with Google" button
  - "Forgot password?" link (placeholder for now)
  - "Don't have an account? Register" link
  - Error message display
- [ ] Create `src/components/auth/LoginForm.tsx` — Login form component
- [ ] Create `src/components/auth/GoogleSignInButton.tsx` — styled Google SSO button
- [ ] Create `src/app/register/page.tsx` — Registration page with:
  - Name, email, password, confirm password fields
  - Password strength indicator
  - "Already have an account? Login" link
- [ ] Create `src/components/auth/RegisterForm.tsx` — Registration form component
- [ ] Create `src/app/api/auth/register/route.ts` — Registration API endpoint (validate, hash password, create user)

### 2.4 Auth Protection
- [ ] Create `src/components/auth/AuthGuard.tsx` — wrapper component that redirects unauthenticated users to `/login`
- [ ] Create `src/lib/auth-helpers.ts` — server-side helpers: `getServerSession`, `requireAuth`, `requireAdmin`
- [ ] Create middleware (`src/middleware.ts`) to protect `/dashboard/*` and `/admin/*` routes
- [ ] Add role-based access control: admin routes return 403 for non-admin users
- [ ] Update Header to show user avatar + dropdown (My Dashboard, Profile, Logout) when authenticated

---

## Phase 3: Public Pages

### 3.1 Homepage
- [ ] Create `src/app/page.tsx` — Homepage layout
- [ ] Create `src/components/home/HeroSection.tsx` — hero with tagline, description, and CTA buttons ("Browse Courses", "Start Learning")
- [ ] Create `src/components/home/FeaturedCourses.tsx` — grid of 3-4 featured course cards
- [ ] Create `src/components/home/ValueProps.tsx` — why learn with NMMR (expert instructors, hands-on projects, AI-focused, affordable)
- [ ] Create `src/components/home/CategorySection.tsx` — browse by category (GenAI, Agentic AI, Prompt Engineering, etc.)
- [ ] Create `src/components/home/CTASection.tsx` — bottom CTA to drive sign-ups
- [ ] Create `src/components/shared/SectionHeading.tsx` — reusable section title component

### 3.2 Course Catalog
- [ ] Create `src/app/courses/page.tsx` — Course listing page
- [ ] Create `src/components/courses/CourseCard.tsx` — card with thumbnail, title, instructor, price, rating, difficulty badge
- [ ] Create `src/components/courses/CourseGrid.tsx` — responsive grid of course cards
- [ ] Create `src/components/courses/CourseSearch.tsx` — search bar for filtering courses by keyword
- [ ] Create `src/components/courses/CourseFilters.tsx` — sidebar filters (category, difficulty, price range: free/paid)
- [ ] Create `src/app/api/courses/route.ts` — GET endpoint: list published courses with search, category, difficulty filters and pagination
- [ ] Implement client-side search and filter state management

### 3.3 Course Detail Page
- [ ] Create `src/app/courses/[slug]/page.tsx` — Course detail page
- [ ] Create `src/components/courses/CourseCurriculum.tsx` — expandable module/lesson list showing lesson titles and durations
- [ ] Course detail sections: hero (title, instructor, rating, price), description, what you'll learn, curriculum, instructor bio, reviews placeholder
- [ ] "Enroll Now" / "Buy Now" CTA button (changes based on auth state and enrollment status)
- [ ] Create `src/app/api/courses/[slug]/route.ts` — GET endpoint: return full course details by slug

### 3.4 About Page
- [ ] Create `src/app/about/page.tsx` — About page with company story, mission, vision, team section

### 3.5 Contact Page
- [ ] Create `src/app/contact/page.tsx` — Contact page with form (name, email, subject, message) + company info
- [ ] Integrate Formspree for form submission (or create `/api/contact` endpoint)

---

## Phase 4: Learner Dashboard

### 4.1 Dashboard Layout
- [ ] Create `src/app/dashboard/layout.tsx` — dashboard layout with sidebar navigation (Overview, My Courses, Profile, Purchases)
- [ ] Create `src/app/dashboard/page.tsx` — learner dashboard overview with:
  - Welcome message
  - Learning stats (courses enrolled, courses completed, total hours)
  - Continue learning (last accessed course)
  - Recently enrolled courses

### 4.2 My Courses
- [ ] Create `src/app/dashboard/courses/page.tsx` — list of enrolled courses with progress bars
- [ ] Create `src/components/dashboard/EnrolledCourseCard.tsx` — course card showing progress percentage and "Continue" button
- [ ] Create `src/components/dashboard/ProgressCard.tsx` — circular or bar progress indicator
- [ ] Create `src/components/dashboard/LearningStats.tsx` — stats cards (enrolled, completed, hours)

### 4.3 Course Player
- [ ] Create `src/app/dashboard/courses/[slug]/page.tsx` — course player page with:
  - Left: lesson content area (video player / PDF viewer / markdown renderer)
  - Right: collapsible sidebar with module/lesson list and completion checkboxes
- [ ] Create `src/components/courses/CoursePlayer.tsx` — main player component
- [ ] Install and configure `react-player` for video playback
- [ ] Implement markdown rendering for text lessons (react-markdown + syntax highlighting)
- [ ] Create `src/app/api/enrollments/[id]/progress/route.ts` — PUT endpoint to mark lessons complete and update progress percentage
- [ ] Implement "Next Lesson" / "Previous Lesson" navigation
- [ ] Auto-mark lesson complete when video finishes or user scrolls to bottom of text

### 4.4 Profile & Purchases
- [ ] Create `src/app/dashboard/profile/page.tsx` — profile edit form (name, avatar, password change)
- [ ] Create `src/app/dashboard/purchases/page.tsx` — purchase/enrollment history table

### 4.5 Enrollment API
- [ ] Create `src/app/api/enrollments/route.ts`:
  - `GET` — return user's enrollments with course details and progress
  - `POST` — enroll user in a course (free courses: instant enroll; paid courses: require payment verification)
- [ ] Handle duplicate enrollment prevention (compound unique index on userId + courseId)

---

## Phase 5: Admin Dashboard

### 5.1 Admin Layout & Overview
- [ ] Create `src/app/admin/layout.tsx` — admin layout with sidebar (Dashboard, Courses, Users)
- [ ] Create `src/app/admin/page.tsx` — admin dashboard with:
  - Stats cards (total users, total courses, total enrollments, revenue if payments enabled)
  - Recent enrollments list
  - Quick links to create course, manage users
- [ ] Create `src/components/admin/StatsCards.tsx` — reusable stat card component

### 5.2 Course Management
- [ ] Create `src/app/admin/courses/page.tsx` — courses table with columns: title, status (draft/published), enrollments count, price, actions (edit/delete)
- [ ] Create `src/app/admin/courses/new/page.tsx` — create course form
- [ ] Create `src/components/admin/CourseForm.tsx` — reusable form for create/edit with fields:
  - Title, slug (auto-generated), description, long description (markdown editor)
  - Category (dropdown), difficulty (dropdown), price, currency
  - Thumbnail upload
  - Instructor name
  - Status (draft/published)
- [ ] Create `src/app/admin/courses/[id]/edit/page.tsx` — edit existing course
- [ ] Create `src/app/api/admin/courses/route.ts` — POST create course (admin only)
- [ ] Create `src/app/api/admin/courses/[id]/route.ts` — PUT update, DELETE course (admin only)

### 5.3 Content Management (Modules & Lessons)
- [ ] Create `src/app/admin/courses/[id]/content/page.tsx` — module and lesson management page
- [ ] Create `src/components/admin/ModuleEditor.tsx` — add/edit/reorder/delete modules within a course
- [ ] Create `src/components/admin/LessonUploader.tsx` — add lessons to a module:
  - Lesson type selector (video, document, markdown, quiz)
  - File upload for video/PDF (to Azure Blob Storage)
  - Markdown editor for text lessons
  - Simple quiz builder (question + multiple choice answers)
  - Duration field
  - "Free preview" toggle
  - Drag-and-drop reordering
- [ ] Create `src/app/api/admin/courses/[id]/content/route.ts` — POST upload content to Azure Blob Storage
- [ ] Create `src/lib/storage.ts` — Azure Blob Storage helpers (upload, delete, generate SAS URL)

### 5.4 User Management
- [ ] Create `src/app/admin/users/page.tsx` — users table with columns: name, email, role, joined date, enrollments count, actions
- [ ] Create `src/app/api/admin/users/route.ts` — GET list users (with search/filter), PUT update user role
- [ ] Create `src/components/admin/UserTable.tsx` — data table with search, sort, and role change dropdown
- [ ] Implement role change confirmation dialog (prevent accidental admin privilege grants)

---

## Phase 6: Polish & SEO

### 6.1 SEO & Metadata
- [ ] Add metadata to all pages using Next.js `generateMetadata` (title, description, OpenGraph, Twitter cards)
- [ ] Create `src/app/sitemap.ts` — dynamic sitemap generation (include courses)
- [ ] Create `src/app/robots.ts` — robots.txt generation
- [ ] Add structured data (JSON-LD) for Organization and Course pages
- [ ] Add canonical URLs to all pages

### 6.2 Error Handling & Loading States
- [ ] Create `src/app/not-found.tsx` — custom 404 page
- [ ] Create `src/app/error.tsx` — global error boundary
- [ ] Create `src/app/loading.tsx` — global loading skeleton
- [ ] Add loading skeletons for course grid, dashboard, and admin pages
- [ ] Add toast notifications for success/error actions (shadcn toast)

### 6.3 Performance
- [ ] Optimize images: use Next.js `<Image>` component everywhere, serve WebP/AVIF
- [ ] Implement lazy loading for below-fold sections
- [ ] Add font subsetting and `display: swap` for Inter and JetBrains Mono
- [ ] Audit and minimize client-side JavaScript bundle
- [ ] Add caching headers for static assets

### 6.4 Accessibility
- [ ] Audit all pages for WCAG 2.1 AA compliance
- [ ] Ensure all interactive elements have proper ARIA labels
- [ ] Test keyboard navigation through all flows (login, enrollment, course player)
- [ ] Ensure color contrast ratios meet AA standards in both light and dark modes
- [ ] Add skip-to-content link

### 6.5 Analytics
- [ ] Integrate Microsoft Clarity (add script to root layout)
- [ ] Add custom events for key actions (enrollment, course completion, sign-up)

### 6.6 Legal Pages
- [ ] Create `src/app/privacy-policy/page.tsx`
- [ ] Create `src/app/terms-of-service/page.tsx`
- [ ] Add links in footer

---

## Phase 7: Deployment

### 7.1 Azure Setup
- [ ] Create Azure Static Web Apps resource (Free tier)
- [ ] Connect GitHub repository for CI/CD
- [ ] Configure `staticwebapp.config.json` for:
  - Route fallback rules
  - API route mapping
  - CORS headers
  - Content Security Policy headers

### 7.2 CI/CD Pipeline
- [ ] Create `.github/workflows/azure-static-web-apps.yml` — GitHub Actions workflow:
  - Trigger on push to `main`
  - Install dependencies
  - Run linter
  - Build Next.js app
  - Deploy to Azure Static Web Apps
- [ ] Configure preview deployments on pull requests

### 7.3 Environment & Domain
- [ ] Set environment variables in Azure Static Web Apps configuration
- [ ] Configure custom domain (training.nmmr.tech or similar)
- [ ] Verify SSL certificate provisioning
- [ ] Test production deployment end-to-end

### 7.4 Database & Storage Production Setup
- [ ] Create production MongoDB Atlas cluster (free tier)
- [ ] Set up database indexes (email unique, slug unique, userId+courseId compound)
- [ ] Create Azure Blob Storage container for course content
- [ ] Configure CORS on Blob Storage to allow website origin
- [ ] Seed production database with initial courses (if any)

---

## Phase 8: Sample Data & Testing

### 8.1 Seed Data
- [ ] Create `scripts/seed.ts` — database seeding script
- [ ] Create 3-5 sample courses with modules and lessons:
  1. "Introduction to Generative AI" (free, beginner)
  2. "Building AI Agents with LangChain" (paid, intermediate)
  3. "Prompt Engineering Masterclass" (paid, beginner)
  4. "RAG Systems: From Theory to Production" (paid, advanced)
  5. "Agentic AI for Business Process Automation" (paid, intermediate)
- [ ] Create sample admin user and sample learner user
- [ ] Create sample enrollments with progress data

### 8.2 Testing
- [ ] Test full user flow: Register → Login → Browse → Enroll → Learn → Complete
- [ ] Test Google SSO flow end-to-end
- [ ] Test admin flow: Login → Create Course → Add Modules → Add Lessons → Publish
- [ ] Test responsive design on mobile, tablet, desktop
- [ ] Test dark mode across all pages
- [ ] Run Lighthouse audit (target: Performance >90, Accessibility >95, SEO >95)

---

## Phase 9: Payment Integration (OPTIONAL)

> This phase is **entirely optional** and can be implemented independently of Phases 1-8. The platform works fully without payments — all courses are either free or enrollment is manually managed by admins.

### 9.1 Payment Provider Setup
- [ ] Choose payment provider: **Razorpay** (recommended for India) or **Stripe** (international)
- [ ] Create merchant account with chosen provider
- [ ] Obtain API keys (test and production)
- [ ] Add payment environment variables to `.env.local` and Azure config

### 9.2 Payment Backend
- [ ] Install payment SDK: `razorpay` or `stripe`
- [ ] Create `src/lib/payment.ts` — payment provider abstraction layer:
  - `createOrder(amount, currency, courseId, userId)` — create payment order
  - `verifyPayment(paymentId, orderId, signature)` — verify payment signature
  - `getPaymentDetails(paymentId)` — fetch payment details
  - `processRefund(paymentId, amount)` — process refund
- [ ] Create `src/lib/models/Transaction.ts` — Transaction model (userId, courseId, amount, currency, status, paymentProvider, paymentId, timestamps)
- [ ] Create `src/app/api/payments/create-order/route.ts`:
  - Validate user is authenticated
  - Validate course exists and user is not already enrolled
  - Create payment order with provider
  - Save pending transaction record
  - Return order ID and payment details to frontend
- [ ] Create `src/app/api/payments/verify/route.ts`:
  - Verify payment signature from provider
  - Update transaction status to "completed"
  - Auto-enroll user in the course
  - Return success with enrollment details
- [ ] Create `src/app/api/payments/history/route.ts`:
  - GET: return user's transaction history with course details

### 9.3 Payment Frontend
- [ ] Create `src/components/payments/PaymentButton.tsx` — "Buy Now" button that initiates payment flow
- [ ] Create `src/components/payments/CheckoutModal.tsx` — payment modal/overlay:
  - Course summary (title, price)
  - Payment method selection (Razorpay checkout / Stripe Elements)
  - Terms acceptance checkbox
  - "Pay Now" button
- [ ] Create `src/components/payments/PaymentSuccess.tsx` — success confirmation with:
  - Order ID and amount
  - "Start Learning" button
  - Receipt download link
- [ ] Create `src/components/payments/PaymentFailure.tsx` — failure/retry screen
- [ ] Update `src/app/courses/[slug]/page.tsx`:
  - Show "Buy Now" for paid courses (triggers payment flow)
  - Show "Enroll Free" for free courses (direct enrollment)
  - Show "Continue Learning" for already enrolled users
- [ ] Update `src/app/dashboard/purchases/page.tsx` to show real transaction history

### 9.4 Payment Webhooks
- [ ] Create `src/app/api/payments/webhook/route.ts` — handle payment provider webhooks:
  - Payment completed (backup enrollment in case client verification fails)
  - Payment failed
  - Refund processed
- [ ] Implement webhook signature verification for security
- [ ] Add retry/idempotency logic (handle duplicate webhook events)

### 9.5 Admin Payment Features
- [ ] Update admin dashboard to show revenue stats
- [ ] Add transaction history view in admin panel
- [ ] Add ability to manually enroll users (override payment requirement)
- [ ] Add ability to issue refunds from admin panel
- [ ] Add coupon/discount code system (optional sub-feature):
  - Create `src/lib/models/Coupon.ts` — Coupon model (code, discountType, discountValue, expiresAt, maxUses, usedCount)
  - Admin page to create/manage coupons
  - Apply coupon code field in checkout modal
  - Validate and apply discount before payment

### 9.6 Payment Testing
- [ ] Test complete purchase flow with test API keys
- [ ] Test payment failure and retry scenarios
- [ ] Test webhook handling (use provider's webhook testing tools)
- [ ] Test refund flow
- [ ] Test coupon/discount application (if implemented)
- [ ] Verify transaction records are created correctly
- [ ] Switch to production API keys and verify live payment (small test amount)

---

## Summary

| Phase | Description | Dependency | Effort Estimate |
|-------|------------|------------|-----------------|
| Phase 1 | Project Foundation | None | Foundation |
| Phase 2 | Authentication | Phase 1 | Core |
| Phase 3 | Public Pages | Phase 1, 2 | Core |
| Phase 4 | Learner Dashboard | Phase 2, 3 | Core |
| Phase 5 | Admin Dashboard | Phase 2 | Core |
| Phase 6 | Polish & SEO | Phase 3, 4, 5 | Enhancement |
| Phase 7 | Deployment | Phase 1-6 | DevOps |
| Phase 8 | Sample Data & Testing | Phase 1-7 | QA |
| **Phase 9** | **Payment Integration** | **Phase 2, 3, 4** | **Optional** |
| **Phase 10** | **MongoDB Content-First (No Videos)** | **Phase 1-5** | **Core** |

> **Note:** Phase 9 (Payment Integration) is fully optional. Without it, all courses can be offered as free, or enrollment can be managed manually by admins. Payment can be added at any time after Phase 4 is complete.

---

## Phase 10: MongoDB Content-First Architecture (All Content in DB, No Videos) ✅ COMPLETED

> **Goal:** Move all course content (lesson text, images, quiz data) into MongoDB so the database is the single source of truth. Images are stored as base64 data URIs. No video support — lesson types are `markdown`, `document`, `quiz`, and `image`. The admin UI gets a full content editor with image upload, markdown editing, and quiz building.

### Current State Analysis

**What exists today:**
- Course model (`src/lib/models/Course.ts`) has `modules → lessons` nested structure
- Lesson `content` field is a plain string (markdown text or empty)
- Lesson `type` is `"video" | "document" | "quiz" | "markdown"` but only markdown actually renders content
- Video, document, and quiz types show placeholder UIs
- Sample data (`src/data/sample-lesson-content.ts`) has markdown content for 6 lessons
- Admin content editor (`src/app/admin/courses/[id]/content/page.tsx`) manages module/lesson metadata but **cannot edit lesson content**
- All lesson content is loaded at once with the course (no lazy loading)
- No image handling exists

**What changes:**
- Remove `video` lesson type entirely (no video support)
- Add `image` lesson type (base64 images with caption/description)
- Enhance `quiz` type with structured quiz data (questions, options, correct answers)
- Add `LessonContent` collection for large content (separate from Course document to avoid 16MB limit)
- Add `CourseImage` collection for base64-encoded images (thumbnails, inline images)
- Admin gets rich content editors: markdown editor with image embed, quiz builder, document editor
- Learner player renders all content types from MongoDB
- Lazy-load lesson content on demand instead of all-at-once

---

### 10.1 Schema Design & Models

#### `src/lib/models/Course.ts` — Update Course/Lesson Schema
- [ ] Remove `"video"` from `ILesson.type` enum, add `"image"` type
  - New type enum: `"markdown" | "document" | "quiz" | "image"`
- [ ] Add `contentRef: ObjectId` field to `ILesson` — reference to `LessonContent` collection (for lazy loading)
- [ ] Add `thumbnailRef: ObjectId` optional field to `ICourse` — reference to `CourseImage` for course thumbnail
- [ ] Keep existing `content` field on `ILesson` as a short summary/preview (max 500 chars)
- [ ] Add `tags: string[]` optional field to `ICourse` for better search/filtering
- [ ] Add `prerequisites: string[]` optional field to `ICourse` (list of course slugs)

#### `src/lib/models/LessonContent.ts` — **NEW** Lesson Content Collection
- [ ] Create new Mongoose model for storing full lesson content separately from the Course document
- [ ] Schema fields:
  - `courseId: ObjectId` (ref to Course)
  - `lessonId: ObjectId` (matches the _id of the lesson subdocument in Course)
  - `type: "markdown" | "document" | "quiz" | "image"` (mirrors lesson type)
  - `markdownContent: string` (for markdown/document types — full markdown text)
  - `quizData: IQuizData` (for quiz type — structured quiz object, see below)
  - `imageData: { base64: string, mimeType: string, altText: string, caption: string }` (for image type)
  - `inlineImages: [{ id: string, base64: string, mimeType: string, altText: string }]` (images embedded in markdown via `![alt](inline:imageId)`)
  - `version: number` (content versioning, default 1)
  - `updatedBy: ObjectId` (ref to User who last edited)
  - `createdAt, updatedAt` (timestamps)
- [ ] Add compound index on `(courseId, lessonId)` — unique
- [ ] Add index on `courseId` for bulk operations

#### `src/lib/models/QuizSchema.ts` — **NEW** Embedded Quiz Sub-Schema
- [ ] Create reusable quiz sub-schema (not a standalone collection, embedded in `LessonContent.quizData`):
  - `title: string`
  - `description: string`
  - `passingScore: number` (percentage, e.g., 70)
  - `shuffleQuestions: boolean`
  - `questions: IQuestion[]`
- [ ] `IQuestion` sub-schema:
  - `questionText: string` (supports markdown)
  - `questionType: "multiple-choice" | "multi-select" | "true-false"`
  - `options: IOption[]`
  - `explanation: string` (shown after answering — explains correct answer)
  - `order: number`
- [ ] `IOption` sub-schema:
  - `text: string`
  - `isCorrect: boolean`
  - `order: number`

#### `src/lib/models/CourseImage.ts` — **NEW** Image Storage Collection
- [ ] Create Mongoose model for storing base64-encoded images:
  - `courseId: ObjectId` (ref to Course, nullable for shared/global images)
  - `purpose: "thumbnail" | "banner" | "inline" | "instructor"` (what the image is used for)
  - `filename: string` (original filename for display)
  - `mimeType: string` (image/png, image/jpeg, image/webp, image/svg+xml)
  - `base64: string` (base64-encoded image data)
  - `width: number` (optional, for layout hints)
  - `height: number` (optional, for layout hints)
  - `sizeBytes: number` (original file size for tracking)
  - `altText: string` (accessibility)
  - `uploadedBy: ObjectId` (ref to User)
  - `createdAt, updatedAt` (timestamps)
- [ ] Add index on `courseId`
- [ ] Add index on `purpose`
- [ ] Add validation: max 2MB per image (base64 encoded ~2.7MB), only allow image/* mimeTypes

---

### 10.2 TypeScript Types Update

#### `src/types/index.ts` — Update & Add Types
- [ ] Update `LessonType` to `"markdown" | "document" | "quiz" | "image"` (remove `"video"`)
- [ ] Add `QuizData` interface:
  ```
  QuizData { title, description, passingScore, shuffleQuestions, questions: Question[] }
  ```
- [ ] Add `Question` interface:
  ```
  Question { questionText, questionType: "multiple-choice" | "multi-select" | "true-false", options: Option[], explanation, order }
  ```
- [ ] Add `Option` interface:
  ```
  Option { text, isCorrect, order }
  ```
- [ ] Add `LessonContentData` interface (API response shape for lesson content):
  ```
  LessonContentData { id, courseId, lessonId, type, markdownContent?, quizData?, imageData?, inlineImages? }
  ```
- [ ] Add `CourseImageData` interface:
  ```
  CourseImageData { id, courseId, purpose, filename, mimeType, base64, width?, height?, sizeBytes, altText }
  ```
- [ ] Add `QuizAttempt` interface (for tracking quiz submissions):
  ```
  QuizAttempt { lessonId, answers: { questionIndex, selectedOptions }[], score, passed, attemptedAt }
  ```
- [ ] Update `Lesson` interface: add `contentRef` optional field, remove `content` or make it a short preview
- [ ] Update `CourseDetail` response type: lesson data should not include full content (only title, type, duration, isFree, contentRef)

---

### 10.3 Validators & Zod Schemas

#### `src/lib/validators.ts` — Add Content Validation Schemas
- [ ] Add `lessonContentSchema` — validates content payload based on lesson type:
  - For `markdown`: `markdownContent` required (min 1 char, max 500KB string)
  - For `document`: `markdownContent` required (same as markdown, but semantic distinction)
  - For `quiz`: `quizData` required, validate nested questions/options structure
  - For `image`: `imageData` required with base64, mimeType, altText
- [ ] Add `quizDataSchema` — validates quiz structure:
  - `title` required (3-200 chars)
  - `passingScore` between 0-100
  - `questions` array (min 1, max 50)
  - Each question: `questionText` required, `options` array (min 2, max 6), at least 1 correct option
  - For `true-false`: exactly 2 options
- [ ] Add `imageUploadSchema` — validates image upload:
  - `base64` required
  - `mimeType` must be one of `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/svg+xml`
  - `sizeBytes` max 2MB (2_097_152)
  - `altText` required (3-200 chars)
- [ ] Update `lessonFormSchema` — change type enum to remove `"video"`, add `"image"`

---

### 10.4 API Routes — Lesson Content

#### `src/app/api/courses/[slug]/lessons/[lessonId]/route.ts` — **NEW** Get Single Lesson Content
- [ ] `GET` — fetch lesson content on demand (lazy loading):
  - Validate course exists and is published
  - Validate lesson exists in the course
  - Check if lesson `isFree` OR user is enrolled
  - Fetch from `LessonContent` collection by `courseId + lessonId`
  - For markdown: return `markdownContent` with inline image references resolved
  - For quiz: return `quizData` (without `isCorrect` flags if not yet submitted — or always include for client-side grading)
  - For image: return full `imageData`
  - Return 403 if lesson is not free and user is not enrolled
  - Return 404 if content not found (lesson exists but no content uploaded yet)

#### `src/app/api/admin/courses/[id]/lessons/[lessonId]/content/route.ts` — **NEW** Admin: Create/Update Lesson Content
- [ ] `PUT` — create or upsert lesson content:
  - Require admin role
  - Validate lesson exists in the course's modules
  - Validate content payload against `lessonContentSchema` based on lesson type
  - Upsert into `LessonContent` collection (courseId + lessonId as unique key)
  - Update `contentRef` on the lesson subdocument in Course
  - Set `updatedBy` to current admin user
  - Return saved content
- [ ] `GET` — fetch lesson content for admin editing:
  - Require admin role
  - Return full content including all fields
- [ ] `DELETE` — remove lesson content:
  - Require admin role
  - Delete from `LessonContent` collection
  - Clear `contentRef` on the lesson subdocument
  - Also delete any orphaned inline images

---

### 10.5 API Routes — Image Management

#### `src/app/api/admin/images/route.ts` — **NEW** Admin: Upload & List Images
- [ ] `POST` — upload a new image:
  - Require admin role
  - Accept: `{ courseId?, purpose, filename, base64, mimeType, altText, width?, height? }`
  - Validate against `imageUploadSchema`
  - Calculate `sizeBytes` from base64 data
  - Save to `CourseImage` collection
  - Return image ID and metadata
- [ ] `GET` — list images:
  - Require admin role
  - Query params: `courseId` (optional), `purpose` (optional)
  - Return image metadata (ID, filename, purpose, sizeBytes, altText) — NOT base64 data (too large for listing)
  - Paginate (default 20 per page)

#### `src/app/api/admin/images/[imageId]/route.ts` — **NEW** Admin: Get/Delete Individual Image
- [ ] `GET` — fetch image with base64 data (for admin preview or embedding)
  - Require admin role
  - Return full image data including base64
- [ ] `DELETE` — delete image:
  - Require admin role
  - Check if image is referenced by any course thumbnail or lesson content
  - If referenced, return 409 Conflict with list of referencing entities
  - If not referenced, delete

#### `src/app/api/images/[imageId]/route.ts` — **NEW** Public: Serve Image
- [ ] `GET` — serve image as binary response (for `<img src>` usage):
  - Decode base64 to binary buffer
  - Set `Content-Type` header from `mimeType`
  - Set cache headers (e.g., `Cache-Control: public, max-age=86400`)
  - Return binary image data
  - This allows `<img src="/api/images/{imageId}">` in lesson content and course thumbnails

---

### 10.6 API Routes — Quiz Submission

#### `src/app/api/enrollments/[id]/quiz/route.ts` — **NEW** Submit Quiz Answers
- [ ] `POST` — submit quiz attempt:
  - Validate user is enrolled
  - Accept: `{ lessonId, answers: [{ questionIndex, selectedOptions: number[] }] }`
  - Fetch quiz data from `LessonContent`
  - Grade: compare `selectedOptions` against `isCorrect` flags
  - Calculate score percentage
  - Determine pass/fail based on `passingScore`
  - If passed and lesson not already completed, mark lesson as complete (update enrollment progress)
  - Return: `{ score, passed, totalQuestions, correctAnswers, results: [{ correct, explanation }] }`
- [ ] `GET` — get quiz attempt history for a lesson:
  - Return previous attempts (score, passed, attemptedAt) for the given lessonId

---

### 10.7 Update Existing API Routes

#### `src/app/api/courses/[slug]/route.ts` — Modify Course Detail Response
- [ ] Change response to **exclude full lesson content** — only return lesson metadata (title, type, duration, isFree, contentRef)
- [ ] Include course thumbnail as a URL (`/api/images/{thumbnailRef}`) instead of a file path
- [ ] Add lesson content availability flag: `hasContent: boolean` (whether LessonContent exists for this lesson)

#### `src/app/api/admin/courses/[id]/content/route.ts` — Update Admin Content Save
- [ ] When modules/lessons are restructured (reorder, add, delete), handle `LessonContent` cleanup:
  - If a lesson is deleted, also delete its `LessonContent` document
  - If a module is deleted, delete `LessonContent` for all its lessons
- [ ] Return content status for each lesson: `{ lessonId, hasContent, contentType, lastUpdated }`

#### `src/app/api/admin/courses/route.ts` — Update Course Creation
- [ ] When creating a course, allow optional `thumbnailRef` for course image
- [ ] Return image URL in the response

#### `src/app/api/courses/route.ts` — Update Public Course Listing
- [ ] Replace thumbnail file paths with `/api/images/{thumbnailRef}` URLs
- [ ] Add `totalContentLessons` count (lessons that have content uploaded) alongside `lessonsCount`

---

### 10.8 Sample Data Migration

#### `src/data/sample-courses.ts` — Update Sample Data
- [ ] Remove `"video"` type lessons — change to `"markdown"` or `"document"`
- [ ] Add sample `"quiz"` lessons with proper quiz structure references
- [ ] Add sample `"image"` lessons
- [ ] Update lesson type references throughout

#### `src/data/sample-lesson-content.ts` — Expand Sample Content
- [ ] Add sample content entries for all 6 courses (currently only has 6 lessons covered)
- [ ] Add sample quiz data (at least 2 quizzes with 5 questions each)
- [ ] Add sample image lesson data (placeholder base64 image)
- [ ] Structure sample data to match the new `LessonContent` schema shape

#### `src/data/sample-quiz-data.ts` — **NEW** Sample Quiz Data
- [ ] Create sample quiz data for "Quiz: AI Fundamentals" (l4) with 5 multiple-choice questions
- [ ] Create sample quiz data for quiz lessons in other courses
- [ ] Include varied question types: multiple-choice, multi-select, true-false
- [ ] Include explanations for each question

#### `scripts/seed-content.ts` — **NEW** Database Seeding Script for Content
- [ ] Script to seed `LessonContent` collection from sample data
- [ ] Script to seed `CourseImage` collection with placeholder thumbnails
- [ ] Script to update existing Course documents with `contentRef` and `thumbnailRef`
- [ ] Idempotent (safe to run multiple times — upserts)
- [ ] Can be run standalone: `npx ts-node scripts/seed-content.ts`

---

### 10.9 Admin UI — Content Editors

#### `src/components/admin/MarkdownEditor.tsx` — **NEW** Markdown Editor Component
- [ ] Rich markdown editor with:
  - Toolbar: bold, italic, heading, list, code block, link, image embed
  - Live preview panel (side-by-side or toggle)
  - Syntax highlighting in code blocks
  - Image upload button → uploads to `CourseImage` collection → inserts `![alt](/api/images/{id})` into markdown
  - Drag-and-drop image upload support
  - Character/word count
- [ ] Accept `value` and `onChange` props for controlled usage
- [ ] Use a lightweight editor library (e.g., `@uiw/react-md-editor` or build with `textarea` + `react-markdown` preview)

#### `src/components/admin/QuizBuilder.tsx` — **NEW** Quiz Builder Component
- [ ] Interactive quiz creation form:
  - Quiz title and description fields
  - Passing score slider/input (0-100%)
  - Shuffle questions toggle
  - "Add Question" button
- [ ] Per-question editor:
  - Question text (markdown-enabled input)
  - Question type selector (multiple-choice, multi-select, true-false)
  - Options editor: add/remove options, mark correct answer(s)
  - Explanation field (shown after grading)
  - Drag-and-drop reordering of questions
- [ ] Validation: at least 1 question, each question needs 2+ options, at least 1 correct option
- [ ] Preview mode: show quiz as the learner would see it

#### `src/components/admin/ImageUploader.tsx` — **NEW** Image Upload Component
- [ ] Image upload via file picker or drag-and-drop
- [ ] Client-side image preview before upload
- [ ] Client-side validation: file type (png, jpg, webp, gif, svg), max 2MB
- [ ] Convert to base64 on client side using `FileReader`
- [ ] Alt text input field (required)
- [ ] Caption input field (optional)
- [ ] Upload to `/api/admin/images` endpoint
- [ ] Return image ID for embedding in markdown or lesson content

#### `src/components/admin/ImageLessonEditor.tsx` — **NEW** Image Lesson Editor
- [ ] For lesson type `"image"`:
  - Image upload area (uses `ImageUploader`)
  - Caption field
  - Description/annotation field (markdown)
- [ ] Preview of the image as the learner would see it

#### `src/components/admin/DocumentEditor.tsx` — **NEW** Document/Rich Text Editor
- [ ] For lesson type `"document"`:
  - Full-featured markdown editor (reuses `MarkdownEditor`)
  - Distinct from `"markdown"` type semantically (documents are typically longer, may include diagrams)
  - Image embedding support

#### `src/app/admin/courses/[id]/content/page.tsx` — Update Content Management Page
- [ ] Add "Edit Content" button next to each lesson in the module/lesson list
- [ ] Clicking "Edit Content" opens the appropriate editor based on lesson type:
  - `markdown` → `MarkdownEditor`
  - `document` → `DocumentEditor`
  - `quiz` → `QuizBuilder`
  - `image` → `ImageLessonEditor`
- [ ] Show content status indicator per lesson: green checkmark (has content), grey dash (no content yet)
- [ ] Save content via `PUT /api/admin/courses/{id}/lessons/{lessonId}/content`
- [ ] Show last-updated timestamp per lesson content

#### `src/app/admin/courses/[id]/lessons/[lessonId]/edit/page.tsx` — **NEW** Dedicated Lesson Content Edit Page
- [ ] Full-page editor for lesson content (alternative to inline editing in content page)
- [ ] Breadcrumb: Admin > Courses > {Course Title} > {Module Title} > {Lesson Title}
- [ ] Load existing content from API
- [ ] Render appropriate editor component based on lesson type
- [ ] Save / Cancel / Preview buttons
- [ ] Autosave draft (optional enhancement)

#### `src/components/admin/CourseForm.tsx` — Update Course Form
- [ ] Replace thumbnail file path input with `ImageUploader` component
- [ ] Upload thumbnail to `CourseImage` collection with `purpose: "thumbnail"`
- [ ] Store `thumbnailRef` on the course document
- [ ] Show current thumbnail preview

---

### 10.10 Learner UI — Content Rendering

#### `src/components/dashboard/LessonContent.tsx` — Update Lesson Content Renderer
- [ ] Change from receiving all content upfront to fetching on demand:
  - Call `GET /api/courses/{slug}/lessons/{lessonId}` when lesson is selected
  - Show loading skeleton while content loads
  - Cache fetched content in state to avoid re-fetching when navigating back
- [ ] Remove video type handling (no more `VideoPlaceholder`)
- [ ] Add image lesson rendering: display base64 image with caption and description
- [ ] Improve markdown rendering: handle inline images via `/api/images/{id}` URLs

#### `src/components/dashboard/QuizPlayer.tsx` — **NEW** Interactive Quiz Component
- [ ] Display quiz questions one-at-a-time or all-at-once (based on quiz settings)
- [ ] Multiple choice: radio buttons for single select
- [ ] Multi-select: checkboxes for multiple correct answers
- [ ] True/false: two radio buttons
- [ ] "Submit Quiz" button
- [ ] Grading: submit answers to `POST /api/enrollments/{id}/quiz`
- [ ] Results display: score, pass/fail, per-question results with explanations
- [ ] "Retry" button if failed
- [ ] If passed, auto-mark lesson as complete

#### `src/components/dashboard/ImageLesson.tsx` — **NEW** Image Lesson Display
- [ ] Display full-size image with responsive sizing
- [ ] Show caption and description (markdown rendered)
- [ ] Zoom/lightbox functionality (optional)
- [ ] "Mark as Complete" button

#### `src/app/dashboard/courses/[slug]/page.tsx` — Update Course Player Page
- [ ] Remove upfront loading of all lesson content
- [ ] Fetch lesson content on demand when lesson is selected
- [ ] Update sidebar to show content type icons (markdown=file, quiz=question-mark, image=picture, document=book)
- [ ] Handle quiz completion: update sidebar checkmark when quiz is passed

---

### 10.11 Migration & Cleanup

#### `src/lib/models/index.ts` — **NEW** Model Registry
- [ ] Create barrel export file for all models: User, Course, Enrollment, LessonContent, CourseImage
- [ ] Ensures all models are registered before any queries run

#### `scripts/migrate-content.ts` — **NEW** Content Migration Script
- [ ] For existing courses that have `content` directly in lesson subdocuments:
  - Read each lesson's `content` field
  - Create corresponding `LessonContent` document
  - Set `contentRef` on the lesson
  - Clear the inline `content` field (or leave as preview)
- [ ] Idempotent migration (skip if LessonContent already exists for a lesson)
- [ ] Dry-run mode: `--dry-run` flag to preview changes without writing

#### `src/data/sample-courses.ts` — Update Development Sample Data
- [ ] Remove `"video"` type lessons, replace with `"markdown"` or `"image"`
- [ ] Add `contentRef` field (as string placeholder ID) to lesson data
- [ ] Ensure sample data helper functions (`getPublishedCourses`, etc.) still work

#### `src/data/sample-enrollments.ts` — Update Enrollment Sample Data
- [ ] Add quiz attempt data for sample users
- [ ] Update `completedLessons` to reflect new lesson IDs if any changed

---

### 10.12 Constants & Configuration Updates

#### `src/lib/constants.ts` — Update Constants
- [ ] Update `LESSON_TYPES` array: remove `"video"`, add `"image"`
- [ ] Add `MAX_IMAGE_SIZE_BYTES = 2_097_152` (2MB)
- [ ] Add `ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]`
- [ ] Add `MAX_LESSON_CONTENT_SIZE = 512_000` (500KB for markdown content)
- [ ] Add `MAX_QUIZ_QUESTIONS = 50`
- [ ] Add `MAX_QUIZ_OPTIONS = 6`

---

### 10.13 Testing & Verification

#### Manual Testing Checklist
- [ ] Seed database with sample content: run `scripts/seed-content.ts`
- [ ] Admin: Create a new course with thumbnail upload (base64 image)
- [ ] Admin: Add modules and lessons (markdown, document, quiz, image types)
- [ ] Admin: Edit markdown lesson content with inline image embedding
- [ ] Admin: Build a quiz with 5+ questions (mix of MC, multi-select, true/false)
- [ ] Admin: Upload an image lesson with caption
- [ ] Admin: Publish the course
- [ ] Learner: Browse and enroll in the course
- [ ] Learner: View markdown lesson (loads on demand from MongoDB)
- [ ] Learner: View image lesson
- [ ] Learner: Take a quiz, verify grading works correctly
- [ ] Learner: Retry a failed quiz
- [ ] Learner: Verify progress tracking updates correctly after quiz pass
- [ ] Verify course thumbnails render via `/api/images/{id}` endpoint
- [ ] Verify inline images in markdown render correctly
- [ ] Test with 10+ lessons to ensure lazy loading performs well
- [ ] Test on mobile: content renders responsively

---

### Phase 10 — File Summary

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `src/lib/models/Course.ts` | Modify | Remove video type, add image type, add contentRef/thumbnailRef |
| 2 | `src/lib/models/LessonContent.ts` | **New** | Lesson content collection (markdown, quiz, image data) |
| 3 | `src/lib/models/QuizSchema.ts` | **New** | Quiz sub-schema (questions, options, grading) |
| 4 | `src/lib/models/CourseImage.ts` | **New** | Base64 image storage collection |
| 5 | `src/lib/models/index.ts` | **New** | Model barrel export/registry |
| 6 | `src/types/index.ts` | Modify | Add quiz, lesson content, image types; remove video type |
| 7 | `src/lib/validators.ts` | Modify | Add content, quiz, and image validation schemas |
| 8 | `src/lib/constants.ts` | Modify | Add content size limits, allowed image types |
| 9 | `src/app/api/courses/[slug]/lessons/[lessonId]/route.ts` | **New** | Lazy-load lesson content |
| 10 | `src/app/api/admin/courses/[id]/lessons/[lessonId]/content/route.ts` | **New** | Admin CRUD for lesson content |
| 11 | `src/app/api/admin/images/route.ts` | **New** | Admin image upload & listing |
| 12 | `src/app/api/admin/images/[imageId]/route.ts` | **New** | Admin get/delete individual image |
| 13 | `src/app/api/images/[imageId]/route.ts` | **New** | Public image serving endpoint |
| 14 | `src/app/api/enrollments/[id]/quiz/route.ts` | **New** | Quiz submission & grading |
| 15 | `src/app/api/courses/[slug]/route.ts` | Modify | Exclude full content, add thumbnailRef URL |
| 16 | `src/app/api/admin/courses/[id]/content/route.ts` | Modify | Handle LessonContent cleanup on restructure |
| 17 | `src/app/api/admin/courses/route.ts` | Modify | Support thumbnailRef |
| 18 | `src/app/api/courses/route.ts` | Modify | Replace thumbnail paths with image API URLs |
| 19 | `src/components/admin/MarkdownEditor.tsx` | **New** | Markdown editor with toolbar & preview |
| 20 | `src/components/admin/QuizBuilder.tsx` | **New** | Interactive quiz creation form |
| 21 | `src/components/admin/ImageUploader.tsx` | **New** | Image upload with base64 conversion |
| 22 | `src/components/admin/ImageLessonEditor.tsx` | **New** | Image lesson editor (upload + caption) |
| 23 | `src/components/admin/DocumentEditor.tsx` | **New** | Document/rich text editor |
| 24 | `src/app/admin/courses/[id]/content/page.tsx` | Modify | Add content editors, status indicators |
| 25 | `src/app/admin/courses/[id]/lessons/[lessonId]/edit/page.tsx` | **New** | Dedicated lesson content edit page |
| 26 | `src/components/admin/CourseForm.tsx` | Modify | Replace thumbnail input with ImageUploader |
| 27 | `src/components/dashboard/LessonContent.tsx` | Modify | Lazy load, remove video, add image/quiz |
| 28 | `src/components/dashboard/QuizPlayer.tsx` | **New** | Interactive quiz taking UI |
| 29 | `src/components/dashboard/ImageLesson.tsx` | **New** | Image lesson display component |
| 30 | `src/app/dashboard/courses/[slug]/page.tsx` | Modify | On-demand content loading |
| 31 | `src/data/sample-courses.ts` | Modify | Remove video types, update structure |
| 32 | `src/data/sample-lesson-content.ts` | Modify | Expand with all content types |
| 33 | `src/data/sample-quiz-data.ts` | **New** | Sample quiz data |
| 34 | `scripts/seed-content.ts` | **New** | DB seeding for content & images |
| 35 | `scripts/migrate-content.ts` | **New** | Migrate inline content to LessonContent |

> **Dependency:** Phase 10 requires Phases 1-5 to be complete. It can be done in parallel with Phases 6-9.
> **New collections:** `lessoncontent`, `courseimages` in the `nmmr-training` database.
> **No video support:** This phase intentionally removes video. Video streaming can be added as a future phase if needed.
