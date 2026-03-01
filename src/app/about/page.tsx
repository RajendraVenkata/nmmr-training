import type { Metadata } from "next";
import { Target, Lightbulb, Heart, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { COMPANY } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: `Learn about ${COMPANY.legalName} and our mission to make AI education accessible.`,
  path: "/about",
});

const VALUES = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We stay at the cutting edge of AI, continuously updating our curriculum with the latest tools and techniques.",
  },
  {
    icon: Heart,
    title: "Learner-Centric",
    description: "Every course is designed with the learner in mind — practical, project-based, and immediately applicable.",
  },
  {
    icon: Target,
    title: "Industry-Relevant",
    description: "Our instructors are practitioners who build AI systems daily, bringing real-world experience to every lesson.",
  },
  {
    icon: Zap,
    title: "Accessible Learning",
    description: "We believe AI education should be affordable and accessible to everyone, from beginners to experts.",
  },
];

const TEAM = [
  {
    name: "Dr. Priya Sharma",
    role: "Head of AI Curriculum",
    bio: "PhD in Machine Learning with 10+ years of experience building AI systems. Previously led AI research at a Fortune 500 company.",
    initials: "PS",
  },
  {
    name: "Rajesh Kumar",
    role: "Lead Instructor — Agentic AI",
    bio: "Full-stack AI engineer specializing in autonomous agent systems. Has built production agent platforms serving millions of users.",
    initials: "RK",
  },
  {
    name: "Vikram Patel",
    role: "Lead Instructor — AI Development",
    bio: "Senior AI engineer with deep expertise in RAG systems, embeddings, and production ML infrastructure.",
    initials: "VP",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            About {COMPANY.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are on a mission to make AI skills accessible to everyone. Our
            hands-on training programs help professionals and organizations
            harness the power of Generative AI and Agentic AI.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                To empower professionals and organizations with practical AI
                skills through industry-relevant, hands-on training that
                bridges the gap between cutting-edge research and real-world
                application.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
              <p className="text-muted-foreground">
                To be the leading platform for AI skills training, where
                anyone — regardless of background — can learn to build,
                deploy, and manage AI systems that create meaningful business
                and societal impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-base font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            title="Meet Our Instructors"
            subtitle="Learn from AI practitioners who build production systems daily."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                    {member.initials}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-accent mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {[
              { label: "Courses", value: "6+" },
              { label: "Students", value: "500+" },
              { label: "Instructors", value: "3" },
              { label: "Hours of Content", value: "56+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
