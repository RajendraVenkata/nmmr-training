import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMPANY, SITE } from "@/lib/constants";
import { auth } from "@/lib/auth";

export const metadata: Metadata = createMetadata({
  title: SITE.title,
  description: SITE.description,
  path: "/",
});

const FEATURED_CATEGORIES = [
  {
    icon: BrainCircuit,
    title: "Generative AI",
    description:
      "Master LLMs, prompt engineering, and content generation with cutting-edge AI models.",
    href: "/courses?category=GenAI",
  },
  {
    icon: Bot,
    title: "Agentic AI",
    description:
      "Build autonomous AI agents that reason, plan, and execute complex multi-step tasks.",
    href: "/courses?category=Agentic+AI",
  },
  {
    icon: Sparkles,
    title: "Prompt Engineering",
    description:
      "Learn the art and science of crafting effective prompts for maximum AI output quality.",
    href: "/courses?category=Prompt+Engineering",
  },
  {
    icon: Zap,
    title: "AI Development",
    description:
      "Build production-ready AI applications with APIs, RAG systems, and custom integrations.",
    href: "/courses?category=AI+Development",
  },
];

const VALUE_PROPS = [
  {
    icon: Target,
    title: "Industry-Focused",
    description:
      "Courses designed by practitioners with real-world AI deployment experience.",
  },
  {
    icon: BookOpen,
    title: "Hands-On Projects",
    description:
      "Every course includes practical projects you can add to your portfolio.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description:
      "Learn from AI engineers and consultants who build production AI systems daily.",
  },
  {
    icon: GraduationCap,
    title: "Career-Ready Skills",
    description:
      "Gain the skills employers are actively hiring for in the AI industry.",
  },
];

export default async function Home() {
  const session = await auth();
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6">
              Powered by {COMPANY.name}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {COMPANY.tagline}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              {COMPANY.description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {session ? (
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-24">
          <SectionHeading
            title="What You'll Learn"
            subtitle="Explore our training tracks covering the most in-demand AI skills."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_CATEGORIES.map((category) => (
              <Link key={category.title} href={category.href}>
                <Card className="h-full transition-all hover:border-primary/30 hover:shadow-sm">
                  <CardHeader>
                    <category.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section>
        <div className="container mx-auto px-4 py-24">
          <SectionHeading
            title="Why Learn With Us"
            subtitle="We combine deep AI expertise with practical, project-based learning."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5">
                  <prop.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{prop.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Join our platform and gain the AI skills that companies are hiring
              for. Start your learning journey today.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {session ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/courses">
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
