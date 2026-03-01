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

> **Note:** Phase 9 (Payment Integration) is fully optional. Without it, all courses can be offered as free, or enrollment can be managed manually by admins. Payment can be added at any time after Phase 4 is complete.
