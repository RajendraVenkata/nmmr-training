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

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Powered by {COMPANY.name}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {COMPANY.tagline}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              {COMPANY.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          title="What You'll Learn"
          subtitle="Explore our training tracks covering the most in-demand AI skills."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_CATEGORIES.map((category) => (
            <Link key={category.title} href={category.href}>
              <Card className="h-full transition-colors hover:border-accent/50 hover:shadow-md">
                <CardHeader>
                  <category.icon className="h-10 w-10 text-accent mb-2" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <SectionHeading
            title="Why Learn With Us"
            subtitle="We combine deep AI expertise with practical, project-based learning."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <prop.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-base font-semibold">{prop.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our platform and gain the AI skills that companies are hiring
              for. Start with a free account today.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
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
