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
| **Phase 11** | **Remote Command Execution (Azure VM)** | **Phase 10** | **Feature** |
| **Phase 12** | **Migrate Docker Host to On-Premise** | **Phase 11** | **Migration** |

> **Note:** Phase 9 (Payment Integration) is fully optional. Without it, all courses can be offered as free, or enrollment can be managed manually by admins. Payment can be added at any time after Phase 4 is complete.
>
> **Note:** Phase 11 sets up interactive terminal labs using an Azure VM for Docker containers. Phase 12 migrates the Docker host from Azure VM to an on-premise server to save costs. See `remote-cmd.md` for detailed architecture design.

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

---

## Phase 11: Remote Command Execution — Azure VM with Docker

> **Goal:** Allow learners to run Linux commands and test programs in isolated Docker containers directly from lesson pages. In this phase, Docker containers run on an **Azure VM** (all infrastructure stays in Azure). Phase 12 migrates the Docker host to an on-premise server.
>
> **Architecture reference:** See `remote-cmd.md` for detailed diagrams and design.

---

### 11.1 Azure VM Setup & Docker Installation

#### Azure VM Provisioning
- [ ] Create an Azure Virtual Machine (Ubuntu 22.04 LTS):
  - Size: `Standard_B2s` (2 vCPU, 4 GB RAM) — sufficient for ~8 concurrent containers
  - Disk: 30 GB SSD (Standard_LRS)
  - Region: Same as other Azure resources (minimize latency)
  - Networking: Create Virtual Network and Network Security Group (NSG)
- [ ] Configure NSG inbound rules:
  - SSH (port 22) — restricted to your IP only (for management)
  - HTTPS (port 443) — for WebSocket relay service (behind reverse proxy)
  - Deny all other inbound traffic
- [ ] Set up SSH key-based authentication (disable password login)
- [ ] Create a DNS record: `terminal.nmmr.tech` → Azure VM public IP (A record)

#### Docker Installation on Azure VM
- [ ] SSH into Azure VM
- [ ] Install Docker Engine (latest stable):
  - `apt update && apt install -y docker.io`
  - `systemctl enable docker && systemctl start docker`
- [ ] Install Docker Compose v2:
  - `apt install -y docker-compose-plugin`
- [ ] Create a non-root user for the relay service:
  - `useradd -m -s /bin/bash nmmr-relay`
  - `usermod -aG docker nmmr-relay`
- [ ] Install Node.js 20 LTS:
  - `curl -fsSL https://deb.nodesource.com/setup_20.x | bash -`
  - `apt install -y nodejs`
- [ ] Install PM2 for process management:
  - `npm install -g pm2`
- [ ] Install Nginx as reverse proxy (for SSL termination):
  - `apt install -y nginx`
- [ ] Install Certbot for Let's Encrypt SSL:
  - `apt install -y certbot python3-certbot-nginx`
  - `certbot --nginx -d terminal.nmmr.tech`

#### Build Docker Lab Images
- [ ] Create `nmmr/python-lab` Docker image:
  - Base: `python:3.12-slim`
  - Add: pip, common packages (numpy, pandas, requests, flask)
  - User: non-root `learner` user
  - Workdir: `/home/learner`
  - Entrypoint: `/bin/bash`
- [ ] Create `nmmr/node-lab` Docker image:
  - Base: `node:20-slim`
  - Add: npm, yarn, common packages
  - User: non-root `learner` user
- [ ] Create `nmmr/linux-lab` Docker image:
  - Base: `ubuntu:22.04`
  - Add: gcc, make, vim, git, curl, wget, common CLI tools
  - User: non-root `learner` user
- [ ] Build and test all images on the Azure VM:
  - `docker build -t nmmr/python-lab:latest ./docker/python-lab/`
  - `docker build -t nmmr/node-lab:latest ./docker/node-lab/`
  - `docker build -t nmmr/linux-lab:latest ./docker/linux-lab/`
- [ ] Test each image manually: `docker run --rm -it nmmr/python-lab bash`

---

### 11.2 Terminal Relay Service (nmmr-terminal)

#### Create `nmmr-terminal` Repository
- [ ] Initialize new repository: `nmmr-terminal`
- [ ] Set up Node.js project with TypeScript:
  - `npm init -y`
  - Install: `typescript ws dockerode jsonwebtoken dotenv`
  - Install dev: `@types/ws @types/jsonwebtoken @types/node ts-node`
- [ ] Create `tsconfig.json` with strict mode

#### Core Service Files
- [ ] Create `src/config.ts` — configuration:
  - `PORT` (default 8080)
  - `JWT_SECRET` (must match nmmr-training's AUTH_SECRET)
  - `MAX_CONTAINERS_PER_USER` (default 1)
  - `MAX_CONTAINERS_TOTAL` (default 20)
  - `CONTAINER_IDLE_TIMEOUT_MS` (default 30 minutes)
  - `CONTAINER_CPU_LIMIT` (default 0.5 cores)
  - `CONTAINER_MEMORY_LIMIT` (default 256m)
  - `NMMR_API_URL` (Azure Functions URL for fetching lab configs)
  - `NMMR_API_KEY` (optional API key for nmmr-api access)

- [ ] Create `src/auth.ts` — JWT authentication:
  - `validateToken(token: string): Promise<UserPayload>` — verify JWT, extract userId, role
  - `validateEnrollment(userId: string, courseId: string): Promise<boolean>` — check enrollment via nmmr-api
  - Reject expired tokens
  - Reject non-enrolled users (unless lesson is free)

- [ ] Create `src/container-manager.ts` — Docker container lifecycle:
  - `createContainer(userId, labId, labConfig): Promise<ContainerInfo>` — create isolated container
    - Set resource limits (CPU, memory, disk)
    - Set security options (no-new-privileges, seccomp, drop capabilities)
    - Disable network by default
    - Mount tmpfs for writable areas
    - Inject preloaded files from lab config
  - `attachToContainer(containerId): Promise<ExecStream>` — attach stdin/stdout/stderr
  - `getContainer(userId, labId): ContainerInfo | null` — find existing container
  - `destroyContainer(containerId): Promise<void>` — stop and remove container
  - `destroyAllUserContainers(userId): Promise<void>` — cleanup for a user
  - `getActiveContainerCount(): number` — for capacity checks

- [ ] Create `src/session-store.ts` — active session tracking:
  - In-memory Map: `userId:labId → { containerId, wsConnection, lastActivity, createdAt }`
  - `createSession(userId, labId, containerId)` — register new session
  - `getSession(userId, labId)` — lookup active session
  - `updateActivity(userId, labId)` — reset idle timer
  - `removeSession(userId, labId)` — cleanup on disconnect
  - `getAllSessions()` — for monitoring

- [ ] Create `src/lab-cache.ts` — lab configuration cache:
  - Fetch lab definitions from `GET {NMMR_API_URL}/api/labs/{labId}`
  - Cache in memory with 5-minute TTL
  - Fallback to defaults if API unreachable
  - `getLabConfig(labId): Promise<LabConfig>`

- [ ] Create `src/server.ts` — main WebSocket server:
  - Start `ws` WebSocket server on configured port
  - On connection:
    1. Extract JWT from query params or headers
    2. Validate token via `auth.validateToken()`
    3. Parse `labId` and `courseId` from connection URL or message
    4. Validate enrollment via `auth.validateEnrollment()`
    5. Fetch lab config via `lab-cache.getLabConfig()`
    6. Check capacity (`getActiveContainerCount < MAX_CONTAINERS_TOTAL`)
    7. Reuse existing container or create new one via `container-manager`
    8. Attach to container's exec stream
    9. Pipe: WebSocket messages → container stdin, container stdout → WebSocket messages
  - On message: pipe user input to container stdin, update last activity
  - On close: detach from container, start idle timer
  - On idle timeout: destroy container, remove session
  - Error handling: send error messages to client, cleanup on crash

- [ ] Create `src/cleanup.ts` — periodic cleanup:
  - Run every 5 minutes
  - Find sessions exceeding `CONTAINER_IDLE_TIMEOUT_MS`
  - Destroy idle containers
  - Log cleanup actions
  - Remove orphaned containers (not tracked in session store)

#### Deployment on Azure VM
- [ ] Create `docker-compose.yml` for the relay service itself (optional, can run directly):
  ```yaml
  version: "3.8"
  services:
    relay:
      build: .
      ports:
        - "8080:8080"
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock
      environment:
        - JWT_SECRET=${JWT_SECRET}
        - NMMR_API_URL=${NMMR_API_URL}
      restart: unless-stopped
  ```
- [ ] Configure Nginx reverse proxy with SSL:
  - Proxy `wss://terminal.nmmr.tech` → `ws://localhost:8080`
  - WebSocket upgrade headers
  - Proxy timeouts (increase for long-lived connections)
- [ ] Set up PM2 ecosystem config for auto-restart:
  - `pm2 start dist/server.js --name nmmr-terminal`
  - `pm2 startup` — auto-start on VM reboot
  - `pm2 save`
- [ ] Create `.env` file on VM with production secrets:
  - `JWT_SECRET=<same as nmmr-training AUTH_SECRET>`
  - `NMMR_API_URL=https://<nmmr-api>.azurewebsites.net/api`
- [ ] Test WebSocket connection: `wscat -c wss://terminal.nmmr.tech?token=<jwt>`

---

### 11.3 Lab Management API (nmmr-api additions)

#### `src/functions/labs.ts` — **NEW** Lab CRUD Endpoints (Azure Functions)
- [ ] `GET /api/labs` — list all lab definitions:
  - Returns: `[{ labId, name, dockerImage, description, resources }]`
  - Admin only for full list; relay service uses API key auth
- [ ] `GET /api/labs/:labId` — get specific lab config:
  - Returns full lab definition including preloadFiles and resource limits
  - Called by on-premise/VM relay service when a learner connects
  - Supports API key auth (for relay service) or JWT (for admin)
- [ ] `POST /api/labs` — create new lab definition:
  - Admin only
  - Validate: labId unique, dockerImage non-empty, valid resource limits
- [ ] `PUT /api/labs/:labId` — update lab definition:
  - Admin only
- [ ] `DELETE /api/labs/:labId` — delete lab definition:
  - Admin only
  - Check if any lessons reference this labId before deleting

#### `src/lib/models/Lab.ts` — **NEW** Lab Mongoose Model (in nmmr-training)
- [ ] Create Lab model for MongoDB:
  - `labId: string` (unique, e.g., "python-basics")
  - `name: string` (display name)
  - `dockerImage: string` (e.g., "nmmr/python-lab:latest")
  - `description: string`
  - `resources: { cpuLimit, memoryLimit, diskLimit, timeoutMinutes }`
  - `preloadFiles: [{ path, content }]` (files to create in container)
  - `startupCommand: string | null`
  - `networkEnabled: boolean` (default false)
  - `isActive: boolean` (default true)
  - `createdAt, updatedAt` (timestamps)
- [ ] Seed initial lab definitions:
  - `python-basics` → `nmmr/python-lab:latest`
  - `node-basics` → `nmmr/node-lab:latest`
  - `linux-basics` → `nmmr/linux-lab:latest`

---

### 11.4 Frontend — Terminal Components (nmmr-training)

#### Terminal Widget Components
- [ ] Install xterm.js dependencies:
  - `npm install xterm @xterm/addon-fit @xterm/addon-web-links`
  - `npm install -D @types/xterm` (if needed)

- [ ] Create `src/components/terminal/TerminalWidget.tsx`:
  - Initialize xterm.js terminal instance
  - Connect to WebSocket: `wss://terminal.nmmr.tech?token={jwt}&labId={labId}&courseId={courseId}`
  - Handle WebSocket events:
    - `onopen`: show "Connected" status, focus terminal
    - `onmessage`: write data to xterm
    - `onclose`: show "Disconnected" status, offer reconnect button
    - `onerror`: show error message
  - Pipe xterm key events → WebSocket send
  - Auto-resize terminal on window resize (xterm-addon-fit)
  - Clickable URLs in terminal output (xterm-addon-web-links)
  - Theme: match dark/light mode of website
  - Props: `labId: string`, `courseId: string`

- [ ] Create `src/components/terminal/TerminalBlock.tsx`:
  - Wrapper component rendered from markdown `:::terminal labId:::` blocks
  - Shows lab name, description, connection status
  - "Connect" button to establish WebSocket (lazy — don't connect until user clicks)
  - "Disconnect" button to close connection
  - Fullscreen toggle button
  - Renders `TerminalWidget` inside a styled container

- [ ] Create `src/components/terminal/TerminalConnectionStatus.tsx`:
  - Visual indicator: green dot (connected), yellow dot (connecting), red dot (disconnected)
  - Connection time elapsed
  - "Reconnect" button when disconnected

#### Markdown Integration
- [ ] Update `src/components/dashboard/LessonContent.tsx`:
  - Add custom ReactMarkdown renderer for `:::terminal <labId>:::` blocks
  - When markdown parser encounters `:::terminal`, render `<TerminalBlock labId={labId} />`
  - Handle multiple terminal blocks in a single lesson

- [ ] Update `src/components/admin/MarkdownEditor.tsx`:
  - Add "Insert Terminal" toolbar button
  - Opens a dialog to select a lab from available labs (fetched from `/api/labs`)
  - Inserts `:::terminal <labId>:::` at cursor position
  - Preview shows a placeholder terminal block (not connected)

#### Environment Variables
- [ ] Add to `.env.local` and Azure Static Web Apps config:
  - `NEXT_PUBLIC_TERMINAL_WS_URL=wss://terminal.nmmr.tech`
  - `NEXT_PUBLIC_TERMINAL_ENABLED=true` (feature flag)

---

### 11.5 Admin UI — Lab Management

#### Lab Management Pages
- [ ] Create `src/app/admin/labs/page.tsx` — Lab listing page:
  - Table: Lab ID, Name, Docker Image, CPU/Memory limits, Active status, Actions
  - "Create New Lab" button
  - Edit / Delete actions per row
  - Show number of lessons using each lab

- [ ] Create `src/app/admin/labs/new/page.tsx` — Create lab page:
  - Form fields: Lab ID (slug), Name, Docker Image, Description
  - Resource limits: CPU (slider 0.25-2.0), Memory (dropdown 128m-1g), Disk (dropdown 50m-500m), Timeout (slider 10-60 min)
  - Preloaded files editor: add/remove file entries (path + content textarea)
  - Startup command (optional)
  - Network enabled toggle
  - Save → POST /api/labs

- [ ] Create `src/app/admin/labs/[labId]/edit/page.tsx` — Edit lab page:
  - Same form as create, pre-populated with existing values
  - Save → PUT /api/labs/:labId

- [ ] Add "Labs" link to admin sidebar navigation

---

### 11.6 Security & Monitoring

#### Security Hardening on Azure VM
- [ ] Configure Docker daemon security:
  - Enable user namespaces: `userns-remap` in `/etc/docker/daemon.json`
  - Set default seccomp profile
  - Set storage driver limits
  - Disable raw socket access in containers
- [ ] Configure Nginx rate limiting:
  - `limit_conn_zone` — max 5 WebSocket connections per IP
  - `limit_req_zone` — max 10 connection attempts per minute per IP
- [ ] Set up fail2ban for SSH brute-force protection
- [ ] Enable Azure VM auto-shutdown schedule (if used for dev/testing only)
- [ ] Configure firewall (ufw):
  - Allow SSH (22) from specific IPs
  - Allow HTTPS (443) from anywhere
  - Deny everything else

#### Monitoring & Logging
- [ ] Set up PM2 monitoring: `pm2 monit`
- [ ] Configure PM2 log rotation: `pm2 install pm2-logrotate`
- [ ] Create health check endpoint in relay service:
  - `GET /health` — returns `{ status, activeContainers, uptime, memoryUsage }`
- [ ] Set up Azure VM metrics alerts:
  - CPU usage > 80% sustained for 10 minutes
  - Memory usage > 85%
  - Disk usage > 80%
- [ ] Add relay service metrics logging:
  - Container creation/destruction events
  - Active session count (periodic log every minute)
  - WebSocket connection/disconnection events
  - Error rates

---

### 11.7 Testing & Verification

#### Manual Testing Checklist
- [ ] Docker images: verify all 3 images build and run correctly on Azure VM
- [ ] Relay service: verify it starts and accepts WebSocket connections
- [ ] JWT auth: verify valid tokens are accepted, invalid/expired tokens are rejected
- [ ] Container lifecycle: verify containers are created, attached, and destroyed correctly
- [ ] Idle timeout: verify containers are destroyed after idle period
- [ ] Resource limits: verify CPU and memory limits are enforced (run a stress test inside container)
- [ ] Network isolation: verify containers cannot reach the internet (when networkEnabled=false)
- [ ] Admin: create a lab definition, verify it appears in lab list
- [ ] Admin: insert terminal block into a lesson markdown, verify it saves
- [ ] Learner: open a lesson with terminal block, verify terminal connects
- [ ] Learner: type commands in terminal, verify output appears in real time
- [ ] Learner: disconnect and reconnect, verify container is reused (within timeout)
- [ ] Learner: verify terminal is not available for non-enrolled users
- [ ] Multiple users: verify 2+ concurrent terminal sessions work independently
- [ ] SSL: verify `wss://terminal.nmmr.tech` works with valid certificate
- [ ] Mobile: verify terminal renders and is usable on mobile (keyboard input)

---

### Phase 11 — File Summary

| # | Repo | File | Action | Description |
|---|------|------|--------|-------------|
| 1 | nmmr-terminal | `src/server.ts` | **New** | WebSocket server — main entry point |
| 2 | nmmr-terminal | `src/auth.ts` | **New** | JWT validation, enrollment checking |
| 3 | nmmr-terminal | `src/container-manager.ts` | **New** | Docker container lifecycle (dockerode) |
| 4 | nmmr-terminal | `src/session-store.ts` | **New** | In-memory active session tracking |
| 5 | nmmr-terminal | `src/lab-cache.ts` | **New** | Cache lab configs from Azure API |
| 6 | nmmr-terminal | `src/config.ts` | **New** | Configuration and environment variables |
| 7 | nmmr-terminal | `src/cleanup.ts` | **New** | Periodic idle container cleanup |
| 8 | nmmr-terminal | `docker/python-lab/Dockerfile` | **New** | Python 3.12 lab image |
| 9 | nmmr-terminal | `docker/node-lab/Dockerfile` | **New** | Node.js 20 lab image |
| 10 | nmmr-terminal | `docker/linux-lab/Dockerfile` | **New** | Ubuntu CLI lab image |
| 11 | nmmr-terminal | `docker-compose.yml` | **New** | Relay service container config |
| 12 | nmmr-terminal | `nginx/terminal.conf` | **New** | Nginx reverse proxy + SSL config |
| 13 | nmmr-api | `src/functions/labs.ts` | **New** | Lab CRUD Azure Function endpoints |
| 14 | nmmr-training | `src/lib/models/Lab.ts` | **New** | Lab Mongoose model |
| 15 | nmmr-training | `src/components/terminal/TerminalWidget.tsx` | **New** | xterm.js terminal with WebSocket |
| 16 | nmmr-training | `src/components/terminal/TerminalBlock.tsx` | **New** | Markdown-embedded terminal wrapper |
| 17 | nmmr-training | `src/components/terminal/TerminalConnectionStatus.tsx` | **New** | Connection status indicator |
| 18 | nmmr-training | `src/components/dashboard/LessonContent.tsx` | Modify | Add :::terminal::: markdown renderer |
| 19 | nmmr-training | `src/components/admin/MarkdownEditor.tsx` | Modify | Add "Insert Terminal" toolbar button |
| 20 | nmmr-training | `src/app/admin/labs/page.tsx` | **New** | Admin lab listing page |
| 21 | nmmr-training | `src/app/admin/labs/new/page.tsx` | **New** | Admin create lab page |
| 22 | nmmr-training | `src/app/admin/labs/[labId]/edit/page.tsx` | **New** | Admin edit lab page |

> **Dependency:** Phase 11 requires Phase 10 to be complete (lesson content system must be in place).
> **Infrastructure:** Azure VM (`Standard_B2s`), Docker Engine, Nginx, Let's Encrypt SSL.
> **New repo:** `nmmr-terminal` — deployed on Azure VM.
> **Cost:** Azure VM `Standard_B2s` ~$30-40/month (can be deallocated when not in use).

---

## Phase 12: Migrate Docker Host from Azure VM to On-Premise Server

> **Goal:** Move the Docker container execution from the Azure VM to your own on-premise server to eliminate VM costs (~$30-40/month). Everything else (frontend, API, database) stays on Azure. The on-premise server connects outbound via Cloudflare Tunnel — no inbound ports needed.
>
> **Architecture reference:** See `remote-cmd.md` — "What Lives Where" section.

---

### 12.1 On-Premise Server Setup

#### Hardware & OS Preparation
- [ ] Identify on-premise server hardware:
  - Minimum: 4 cores, 8 GB RAM, 50 GB SSD, stable internet
  - Recommended: 8 cores, 16 GB RAM for ~16 concurrent learners
- [ ] Install Ubuntu 22.04 LTS (or Debian 12) server edition
- [ ] Configure static LAN IP or DHCP reservation
- [ ] Ensure internet connectivity is stable (for Cloudflare Tunnel outbound)
- [ ] Set hostname: `nmmr-docker-host`

#### Docker Installation (On-Premise)
- [ ] Install Docker Engine:
  - `apt update && apt install -y docker.io`
  - `systemctl enable docker && systemctl start docker`
- [ ] Install Docker Compose v2:
  - `apt install -y docker-compose-plugin`
- [ ] Create relay service user:
  - `useradd -m -s /bin/bash nmmr-relay && usermod -aG docker nmmr-relay`
- [ ] Install Node.js 20 LTS
- [ ] Install PM2: `npm install -g pm2`

#### Transfer Docker Lab Images
- [ ] Export images from Azure VM:
  - `docker save nmmr/python-lab:latest | gzip > python-lab.tar.gz`
  - `docker save nmmr/node-lab:latest | gzip > node-lab.tar.gz`
  - `docker save nmmr/linux-lab:latest | gzip > linux-lab.tar.gz`
- [ ] Transfer images to on-premise server (via SCP or USB):
  - `scp *.tar.gz nmmr-relay@on-premise-server:/home/nmmr-relay/images/`
- [ ] Load images on on-premise server:
  - `docker load < python-lab.tar.gz`
  - `docker load < node-lab.tar.gz`
  - `docker load < linux-lab.tar.gz`
- [ ] Verify images: `docker images | grep nmmr`
- [ ] Alternative: rebuild images from Dockerfiles on on-premise server (if source is available)

---

### 12.2 Cloudflare Tunnel Setup

#### Cloudflare Account & Tunnel Configuration
- [ ] Create Cloudflare account (free tier) if not already done
- [ ] Add your domain to Cloudflare (or use existing Cloudflare DNS setup)
- [ ] Install `cloudflared` on on-premise server:
  - `curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg`
  - `echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | tee /etc/apt/sources.list.d/cloudflared.list`
  - `apt update && apt install -y cloudflared`
- [ ] Authenticate cloudflared:
  - `cloudflared tunnel login` (opens browser to authorize with Cloudflare account)
- [ ] Create a named tunnel:
  - `cloudflared tunnel create nmmr-terminal`
  - Note the tunnel ID and credentials file path
- [ ] Create tunnel config `/etc/cloudflared/config.yml`:
  ```yaml
  tunnel: <TUNNEL_ID>
  credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

  ingress:
    - hostname: terminal.nmmr.tech
      service: ws://localhost:8080
      originRequest:
        connectTimeout: 10s
        noTLSVerify: false
    - service: http_status:404
  ```
- [ ] Create DNS CNAME record:
  - `cloudflared tunnel route dns nmmr-terminal terminal.nmmr.tech`
  - This creates: `terminal.nmmr.tech → <TUNNEL_ID>.cfargotunnel.com`
- [ ] Test tunnel: `cloudflared tunnel run nmmr-terminal`
- [ ] Install cloudflared as a system service:
  - `cloudflared service install`
  - `systemctl enable cloudflared`
  - `systemctl start cloudflared`

#### Remove Azure VM DNS Record
- [ ] Update DNS: `terminal.nmmr.tech` now points to Cloudflare Tunnel (CNAME), not Azure VM IP (A record)
- [ ] Verify: `dig terminal.nmmr.tech` shows CNAME to cfargotunnel.com

---

### 12.3 Deploy Terminal Relay Service on On-Premise

#### Clone and Configure
- [ ] Clone `nmmr-terminal` repo on on-premise server:
  - `git clone https://github.com/<org>/nmmr-terminal.git /opt/nmmr-terminal`
- [ ] Install dependencies:
  - `cd /opt/nmmr-terminal && npm install`
- [ ] Build TypeScript:
  - `npm run build`
- [ ] Create `.env` on on-premise server:
  - `JWT_SECRET=<same as nmmr-training AUTH_SECRET>`
  - `NMMR_API_URL=https://<nmmr-api>.azurewebsites.net/api`
  - `PORT=8080`
  - Same values as were used on Azure VM

#### Process Management
- [ ] Start relay service with PM2:
  - `pm2 start dist/server.js --name nmmr-terminal`
  - `pm2 startup` — auto-start on server reboot
  - `pm2 save`
- [ ] Verify relay service is running: `pm2 status`
- [ ] Verify WebSocket accepts connections via tunnel:
  - `wscat -c wss://terminal.nmmr.tech?token=<valid-jwt>`

#### Nginx (Optional — Not needed with Cloudflare Tunnel)
- [ ] With Cloudflare Tunnel, Nginx is NOT required on on-premise (Cloudflare handles SSL)
- [ ] The relay service runs plain `ws://` on port 8080, Cloudflare terminates SSL
- [ ] If you want local Nginx for additional request filtering, install and configure:
  - Proxy `ws://localhost:8080`
  - No SSL needed (Cloudflare handles it)

---

### 12.4 Frontend Updates (nmmr-training)

#### Update WebSocket URL (if changed)
- [ ] Verify `NEXT_PUBLIC_TERMINAL_WS_URL` still points to `wss://terminal.nmmr.tech`
  - This should NOT change — the domain stays the same, only the backend moves
- [ ] No frontend code changes required if the URL stays the same
- [ ] Deploy to Azure Static Web Apps (if env var changed):
  - Update environment variable in Azure portal
  - Trigger redeployment

---

### 12.5 Decommission Azure VM

#### Verify On-Premise is Fully Operational
- [ ] Run full end-to-end test:
  - Learner opens lesson with terminal → connects via tunnel → runs commands → sees output
  - Admin creates lab → learner can use it
  - Multiple concurrent users work independently
  - Idle timeout and cleanup work correctly
- [ ] Monitor for 24-48 hours — check for disconnects, latency issues, tunnel stability
- [ ] Verify Cloudflare Tunnel auto-reconnects after network interruptions

#### Shut Down Azure VM
- [ ] Stop the relay service on Azure VM:
  - SSH into VM: `pm2 stop nmmr-terminal && pm2 delete nmmr-terminal`
- [ ] Stop Docker containers on Azure VM:
  - `docker stop $(docker ps -q) && docker system prune -af`
- [ ] Deallocate the Azure VM (stop billing):
  - Azure Portal → VM → Stop (Deallocated)
  - Or: `az vm deallocate --resource-group <rg> --name <vm-name>`
- [ ] After 2 weeks of successful on-premise operation, delete the Azure VM:
  - Delete VM, disk, NIC, public IP, NSG (if no longer needed)
  - `az vm delete --resource-group <rg> --name <vm-name> --yes`
  - `az network nsg delete --resource-group <rg> --name <nsg-name>`
- [ ] Delete old DNS A record for `terminal.nmmr.tech` (Azure VM IP) — now using Cloudflare CNAME

---

### 12.6 On-Premise Maintenance & Operations

#### Automated Maintenance
- [ ] Set up Docker image cleanup cron job:
  - `0 3 * * 0 docker system prune -f` (weekly Sunday 3 AM)
- [ ] Set up log rotation for relay service logs:
  - PM2 log rotation: `pm2 install pm2-logrotate`
  - Set max size: `pm2 set pm2-logrotate:max_size 50M`
  - Set retention: `pm2 set pm2-logrotate:retain 7`
- [ ] Set up automatic OS security updates:
  - `apt install -y unattended-upgrades`
  - `dpkg-reconfigure unattended-upgrades`
- [ ] Set up Cloudflare Tunnel health monitoring:
  - Check systemd service: `systemctl status cloudflared`
  - Set up email/Slack alert if tunnel goes down (use a simple cron script)

#### Updating Lab Images
- [ ] Document the process for updating Docker lab images:
  1. Update Dockerfile in `nmmr-terminal/docker/<lab>/`
  2. Build new image: `docker build -t nmmr/<lab>:latest ./docker/<lab>/`
  3. Existing containers use old image until they're destroyed
  4. New containers automatically use the new image
  5. Force refresh: restart relay service (`pm2 restart nmmr-terminal`)

#### Backup & Recovery
- [ ] Document recovery procedure if on-premise server fails:
  1. Re-provision Azure VM (Phase 11 steps)
  2. Update DNS: point `terminal.nmmr.tech` back to Azure VM IP
  3. Deploy relay service and images on Azure VM
  4. Labs operational within ~30 minutes
- [ ] Keep Azure VM deployment scripts/notes for quick re-provisioning
- [ ] Store Docker lab image tarballs in Azure Blob Storage as backup

---

### 12.7 Testing & Verification

#### Migration Verification Checklist
- [ ] Cloudflare Tunnel: verify `cloudflared tunnel info nmmr-terminal` shows active connection
- [ ] DNS: verify `terminal.nmmr.tech` resolves to Cloudflare (not Azure VM IP)
- [ ] SSL: verify `wss://terminal.nmmr.tech` has valid certificate (Cloudflare manages this)
- [ ] WebSocket: verify connection through tunnel works (wscat test)
- [ ] Latency: compare latency (Azure VM vs on-premise) — should be acceptable (<200ms roundtrip)
- [ ] Container lifecycle: create, use, idle-timeout, destroy — all work on on-premise
- [ ] Concurrent users: test 3+ simultaneous terminal sessions
- [ ] Tunnel resilience: disconnect internet briefly, verify tunnel auto-reconnects
- [ ] Server reboot: reboot on-premise server, verify cloudflared + PM2 auto-start relay service
- [ ] Azure VM deallocated: verify everything still works without the Azure VM
- [ ] Cost verification: Azure bill shows no VM charges after deallocation

---

### Phase 12 — File Summary

| # | Location | File/Action | Description |
|---|----------|-------------|-------------|
| 1 | On-premise | Docker Engine install | Docker + Compose on physical server |
| 2 | On-premise | Lab image transfer | Move python-lab, node-lab, linux-lab images |
| 3 | On-premise | `cloudflared` install & config | Cloudflare Tunnel daemon + config.yml |
| 4 | On-premise | `nmmr-terminal` deploy | Clone repo, npm install, PM2 start |
| 5 | Cloudflare | DNS CNAME | `terminal.nmmr.tech → tunnel CNAME` |
| 6 | Azure | VM decommission | Stop, deallocate, eventually delete VM |
| 7 | Azure SWA | Env var check | Verify TERMINAL_WS_URL unchanged |
| 8 | On-premise | Cron jobs | Docker cleanup, log rotation, OS updates |
| 9 | Azure Blob | Image backups | Store Docker image tarballs as disaster recovery |

> **Dependency:** Phase 12 requires Phase 11 to be fully complete and tested.
> **No code changes:** This phase is purely infrastructure migration. No application code changes needed (same WebSocket URL, same API).
> **Cost savings:** Eliminates ~$30-40/month Azure VM cost. Replaced by $0 on-premise + $0 Cloudflare Tunnel.
> **Rollback:** If on-premise fails, re-provision Azure VM and restore DNS A record within 30 minutes.
