import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { COMPANY, SITE } from "@/lib/constants";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${SITE.name}. Read our terms and conditions for using the platform.`,
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
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
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 1, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using {SITE.name} (the &quot;Platform&quot;),
            operated by {COMPANY.legalName}, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Account Registration</h2>
          <p className="text-muted-foreground leading-relaxed">
            To access course content, you must create an account with accurate
            and complete information. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account. You must notify us immediately of any
            unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Course Content & Access</h2>
          <p className="text-muted-foreground leading-relaxed">
            Upon purchasing or enrolling in a course, you are granted a
            personal, non-transferable, non-exclusive license to access the
            course content for your own educational purposes. Course content may
            not be reproduced, distributed, or shared with third parties without
            explicit written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Payments & Refunds</h2>
          <p className="text-muted-foreground leading-relaxed">
            All prices are displayed in the currency indicated on the course
            page. Payments are processed securely through third-party payment
            providers. Refund requests may be submitted within 7 days of
            purchase if less than 25% of the course has been completed. Refunds
            are processed at our discretion and typically take 5-10 business
            days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All course content, platform design, logos, and materials are the
            intellectual property of {COMPANY.legalName} or its content
            creators. You may not copy, modify, distribute, or create derivative
            works from any Platform content without prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. User Conduct</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Share your account credentials with others</li>
            <li>Download or redistribute course materials</li>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Platform</li>
            <li>Interfere with the proper functioning of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            {COMPANY.legalName} provides the Platform and course content on an
            &quot;as is&quot; basis. We make no warranties regarding the
            completeness, accuracy, or reliability of any content. In no event
            shall {COMPANY.legalName} be liable for any indirect, incidental, or
            consequential damages arising from your use of the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Modifications</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will
            be posted on this page with an updated date. Continued use of the
            Platform after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent hover:underline"
            >
              {COMPANY.email}
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
