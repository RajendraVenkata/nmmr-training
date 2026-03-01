import type { Metadata } from "next";
import { SITE, COMPANY } from "@/lib/constants";

interface CreateMetadataOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const url = `${SITE.url}${path}`;

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.legalName,
    url: SITE.url,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: COMPANY.email,
      telephone: COMPANY.phone,
      contactType: "customer service",
    },
    sameAs: [
      COMPANY.social.linkedin,
      COMPANY.social.twitter,
      COMPANY.social.github,
    ],
  };
}

export function createCourseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  instructor: string;
  price: number;
  currency: string;
  category: string;
  difficulty: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${SITE.url}/courses/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: COMPANY.legalName,
      url: SITE.url,
    },
    instructor: {
      "@type": "Person",
      name: course.instructor,
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
    },
    coursePrerequisites: course.difficulty === "beginner" ? "None" : `${course.difficulty} level knowledge`,
    about: course.category,
  };
}
