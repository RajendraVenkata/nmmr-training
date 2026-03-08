import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { COMPANY, SITE } from "@/lib/constants";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE.name}. Learn how we collect, use, and protect your personal information.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 1, 2026
      </p>

      <div className="prose prose-neutral max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you create an account on {SITE.name}, we collect the following
            information:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Name and email address</li>
            <li>Account credentials (password is stored encrypted)</li>
            <li>Course enrollment and progress data</li>
            <li>Payment information (processed securely by third-party providers)</li>
            <li>Usage data and analytics (via Microsoft Clarity)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Provide and maintain your account</li>
            <li>Track your course progress and issue certificates</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send course updates and important notifications</li>
            <li>Improve our platform and course content</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Cookies & Analytics</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to maintain your session,
            remember your preferences (such as dark mode), and collect anonymous
            usage analytics through Microsoft Clarity. Clarity may record
            session replays and heatmaps to help us understand how users
            interact with our platform. No personally identifiable information
            is shared with third-party analytics providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your
            personal information. Passwords are hashed using bcrypt. All data
            transmission is encrypted via HTTPS. We regularly review our
            security practices and update them as needed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may use third-party services for authentication (Google OAuth),
            payment processing, email delivery, and analytics. Each of these
            services has its own privacy policy governing the use of your
            information. We only share the minimum data necessary for these
            services to function.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to access, update, or delete your personal
            information at any time through your account settings. You may also
            request a copy of your data or ask us to stop processing your
            information by contacting us at{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-primary hover:underline"
            >
              {COMPANY.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-primary hover:underline"
            >
              {COMPANY.email}
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
