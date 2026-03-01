# NMMR Training Platform - Project Requirements

## Project Overview

Build and deploy a modern training/e-learning platform for **NMMR Technologies Private Limited**. The platform allows users to browse, purchase, and consume training courses on Generative AI and Agentic AI topics. Administrators can create and manage training content. Hosted as an Azure Static Web App with a serverless backend.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14 (App Router) | SSG/SSR, API routes, great DX |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Styling** | Tailwind CSS | Utility-first, rapid UI development |
| **UI Components** | shadcn/ui | Free, accessible, copy-paste components |
| **Icons** | Lucide React | Lightweight, consistent icon set |
| **Authentication** | NextAuth.js (Auth.js v5) | Credentials + Google OAuth SSO, session management |
| **Database** | Azure Cosmos DB (Free tier) or MongoDB Atlas (Free tier) | User data, course metadata, enrollment records |
| **File Storage** | Azure Blob Storage | Course videos, PDFs, images |
| **Hosting** | Azure Static Web Apps (Free tier) + Azure Functions | Static frontend + serverless API |
| **Payment** | Razorpay or Stripe (Optional) | Course purchases, Indian payment methods |
| **Email** | Formspree (Free tier) or Azure Communication Services | Transactional emails |
| **Analytics** | Microsoft Clarity (Free) | User behavior tracking |

---

## User Roles

### 1. Visitor (Unauthenticated)
- Browse course catalog
- View course details (title, description, curriculum outline, pricing)
- View public pages (Home, About, Contact)
- Register / Login

### 2. Learner (Authenticated User)
- Everything a Visitor can do, plus:
- Purchase courses (or enroll in free courses)
- Access purchased course content (videos, documents, quizzes)
- Track learning progress (lessons completed, percentage)
- View purchase history and certificates
- Manage profile (name, avatar, password)

### 3. Admin
- Everything a Learner can do, plus:
- Create, edit, publish, unpublish, and delete courses
- Upload course content (videos, PDFs, markdown lessons)
- Manage course modules and lesson ordering
- View all enrolled users per course
- View platform analytics (enrollments, revenue)
- Manage user roles (promote user to admin)

---

## Site Structure & Pages

### Public Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, featured courses, value props, CTA |
| `/courses` | Course Catalog | Browsable/searchable list of all published courses |
| `/courses/[slug]` | Course Detail | Full course info, curriculum, pricing, enroll button |
| `/about` | About | Platform and company information |
| `/contact` | Contact | Contact form |
| `/login` | Login | Email/password login + Google SSO button |
| `/register` | Register | New user registration |

### Authenticated Pages (Learner)
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Learner Dashboard | Enrolled courses, progress, recent activity |
| `/dashboard/courses` | My Courses | List of enrolled courses with progress |
| `/dashboard/courses/[slug]` | Course Player | Video/content player, lesson navigation |
| `/dashboard/profile` | Profile Settings | Edit name, email, avatar, password |
| `/dashboard/purchases` | Purchase History | Past transactions and receipts |

### Admin Pages
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Admin Dashboard | Overview stats (users, courses, revenue) |
| `/admin/courses` | Manage Courses | List all courses, create/edit/delete |
| `/admin/courses/new` | Create Course | Course creation form |
| `/admin/courses/[id]/edit` | Edit Course | Edit course details, modules, lessons |
| `/admin/courses/[id]/content` | Manage Content | Upload/arrange lessons within a course |
| `/admin/users` | Manage Users | View users, change roles |

---

## Data Models

### User
```
{
  id: string
  name: string
  email: string
  passwordHash?: string        // null for SSO-only users
  image?: string
  role: "learner" | "admin"
  provider: "credentials" | "google"
  createdAt: Date
  updatedAt: Date
}
```

### Course
```
{
  id: string
  slug: string
  title: string
  description: string
  longDescription: string      // Rich text / markdown
  thumbnail: string            // URL to image
  price: number                // 0 for free courses
  currency: "INR"
  category: string             // "GenAI", "Agentic AI", "Prompt Engineering", etc.
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string             // "8 hours", "12 hours"
  status: "draft" | "published" | "archived"
  instructor: string
  modules: Module[]
  createdAt: Date
  updatedAt: Date
}
```

### Module
```
{
  id: string
  title: string
  order: number
  lessons: Lesson[]
}
```

### Lesson
```
{
  id: string
  title: string
  type: "video" | "document" | "quiz" | "markdown"
  content: string              // URL for video/doc, or markdown content
  duration: string             // "15 min"
  order: number
  isFree: boolean              // Allow preview without purchase
}
```

### Enrollment
```
{
  id: string
  userId: string
  courseId: string
  status: "active" | "completed"
  progress: number             // percentage 0-100
  completedLessons: string[]   // lesson IDs
  enrolledAt: Date
  completedAt?: Date
}
```

### Transaction (Optional - Payment Phase)
```
{
  id: string
  userId: string
  courseId: string
  amount: number
  currency: "INR"
  status: "pending" | "completed" | "failed" | "refunded"
  paymentProvider: "razorpay" | "stripe"
  paymentId: string            // Provider's transaction ID
  createdAt: Date
}
```

---

## Authentication Requirements

### Email/Password Login
- Registration with name, email, password
- Password hashing (bcrypt)
- Email validation
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)

### Google SSO
- OAuth 2.0 via Google
- Auto-create account on first SSO login
- Link SSO to existing account if email matches
- No password required for SSO-only users

### Session Management
- JWT-based sessions via NextAuth.js
- Session expiry: 30 days
- Secure httpOnly cookies
- CSRF protection

---

## Course Content Delivery

### Supported Content Types
1. **Video Lessons**: Uploaded to Azure Blob Storage, streamed via signed URLs
2. **Document Lessons**: PDF files viewable in-browser
3. **Markdown Lessons**: Rich text content stored as markdown, rendered in-browser
4. **Quiz Lessons**: Simple multiple-choice quizzes with immediate feedback

### Content Protection
- Signed/time-limited URLs for video and document access
- Content only accessible to enrolled users
- No direct download links exposed in client-side code

---

## API Routes (Azure Functions / Next.js API Routes)

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handler (login, SSO, session)

### Courses (Public)
- `GET /api/courses` - List published courses (with filters)
- `GET /api/courses/[slug]` - Get course details

### Courses (Admin)
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/[id]` - Update course
- `DELETE /api/admin/courses/[id]` - Delete course
- `POST /api/admin/courses/[id]/content` - Upload lesson content

### Enrollments (Authenticated)
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments` - Get user's enrollments
- `PUT /api/enrollments/[id]/progress` - Update lesson progress

### Payments (Optional)
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment completion
- `GET /api/payments/history` - User's payment history

---

## Design Guidelines

### Color Palette
- **Primary**: Deep Blue (#1e3a5f) - Trust, professionalism
- **Secondary**: Electric Blue (#3b82f6) - Interactive elements
- **Accent**: Teal (#06b6d4) - CTAs, highlights
- **Success**: Green (#10b981) - Completed, success states
- **Warning**: Amber (#f59e0b) - Warnings, pending states
- **Error**: Red (#ef4444) - Errors, destructive actions
- **Dark BG**: (#0f172a) - Dark mode background
- **Light BG**: (#f8fafc) - Light mode background

### Typography
- **Headings**: Inter (Google Fonts)
- **Body**: Inter
- **Code**: JetBrains Mono (for code snippets in course content)

### Design Principles
- Clean, modern, learning-focused UI
- Mobile-first responsive design
- Dark mode support
- Consistent spacing and component sizing
- Accessible (WCAG 2.1 AA)
- Fast loading (<3s on 3G)

---

## Environment Variables

```env
# App
NEXT_PUBLIC_SITE_URL=https://training.nmmr.tech
NEXT_PUBLIC_APP_NAME="NMMR Training Platform"

# Auth
NEXTAUTH_URL=https://training.nmmr.tech
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>

# Database
DATABASE_URL=<cosmos-db-or-mongodb-connection-string>

# Storage
AZURE_STORAGE_CONNECTION_STRING=<blob-storage-connection>
AZURE_STORAGE_CONTAINER=training-content

# Analytics
NEXT_PUBLIC_CLARITY_ID=<microsoft-clarity-id>

# Contact Form
FORMSPREE_ENDPOINT=https://formspree.io/f/<form-id>

# Payment (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
# OR
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-pub-key>
STRIPE_SECRET_KEY=<stripe-secret-key>
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Lighthouse SEO | > 95 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Bundle Size | < 250KB (gzipped) |

---

## Security Requirements

- All API routes protected with authentication middleware
- Admin routes require admin role verification
- Input validation on all forms and API endpoints
- CSRF protection via NextAuth.js
- Rate limiting on auth endpoints
- Content URLs are signed and time-limited
- No secrets in client-side code
- XSS prevention (React's built-in escaping + CSP headers)
- SQL/NoSQL injection prevention via parameterized queries

---

## Deployment

- **Frontend**: Azure Static Web Apps (Free tier)
- **API**: Azure Functions (Consumption plan, free tier)
- **CI/CD**: GitHub Actions (auto-deploy on push to `main`)
- **Preview**: PR-based preview deployments via Azure Static Web Apps
- **Domain**: Custom domain with free SSL via Azure

---

## Development Commands

```bash
npm run dev          # Local development server (port 3000)
npm run build        # Production build
npm run start        # Start production server locally
npm run lint         # ESLint check
npm run db:seed      # Seed database with sample data
npm run db:migrate   # Run database migrations
```
