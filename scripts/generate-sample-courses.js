/**
 * Script to generate src/data/sample-courses.ts from training content markdown files.
 * Usage: node scripts/generate-sample-courses.js
 */
const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.resolve("F:/projects/nmmr-training-content");
const OUTPUT_FILE = path.resolve("F:/projects/nmmr-training/src/data/sample-courses.ts");

// ── Course definitions ─────────────────────────────────────────────
const COURSES = [
  { id: "b1", file: "beginner/B1-foundations-of-ai-and-llms.md", cat: "AI Foundations", diff: "beginner", price: 0, order: 1, courseNumber: "B1" },
  { id: "b2", file: "beginner/B2-python-for-ai.md", cat: "AI Foundations", diff: "beginner", price: 0, order: 2, courseNumber: "B2" },
  { id: "b3", file: "beginner/B3-llm-api-keys-and-interaction-reference.md", cat: "LLM Providers", diff: "beginner", price: 0, order: 3, courseNumber: "B3" },
  { id: "b4", file: "beginner/B4-prompt-engineering-fundamentals.md", cat: "Prompt Engineering", diff: "beginner", price: 0, order: 4, courseNumber: "B4" },
  { id: "b5", file: "beginner/B5-introduction-to-ai-agents.md", cat: "Agentic AI", diff: "beginner", price: 0, order: 5, courseNumber: "B5" },
  { id: "b6", file: "beginner/B6-tool-calling.md", cat: "Agentic AI", diff: "beginner", price: 0, order: 6, courseNumber: "B6" },
  { id: "b7", file: "beginner/B7-building-your-first-agent-with-langchain.md", cat: "Agentic AI", diff: "beginner", price: 0, order: 7, courseNumber: "B7" },
  { id: "b8", file: "beginner/B8-introduction-to-rag.md", cat: "RAG & Retrieval", diff: "beginner", price: 0, order: 8, courseNumber: "B8" },
  { id: "b9", file: "beginner/B9-provider-abstraction.md", cat: "Agentic AI", diff: "beginner", price: 0, order: 9, courseNumber: "B9" },
  { id: "b10", file: "beginner/B10-beginner-capstone-project.md", cat: "Agentic AI", diff: "beginner", price: 0, order: 10, courseNumber: "B10" },
  { id: "i1", file: "intermediate/I1-deep-dive-into-agent-architectures.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 11, courseNumber: "I1" },
  { id: "i2", file: "intermediate/I2-langgraph-graph-based-agent-workflows.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 12, courseNumber: "I2" },
  { id: "i3", file: "intermediate/I3-human-in-the-loop-agents.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 13, courseNumber: "I3" },
  { id: "i4", file: "intermediate/I4-advanced-rag-patterns.md", cat: "RAG & Retrieval", diff: "intermediate", price: 4999, order: 14, courseNumber: "I4" },
  { id: "i5", file: "intermediate/I5-multi-agent-systems-with-crewai.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 15, courseNumber: "I5" },
  { id: "i6", file: "intermediate/I6-memory-systems-for-agents.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 16, courseNumber: "I6" },
  { id: "i7", file: "intermediate/I7-structured-outputs-and-reliable-responses.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 17, courseNumber: "I7" },
  { id: "i8", file: "intermediate/I8-agent-tools-building-complex-integrations.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 18, courseNumber: "I8" },
  { id: "i9", file: "intermediate/I9-agent-evaluation-and-testing.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 19, courseNumber: "I9" },
  { id: "i10", file: "intermediate/I10-intermediate-capstone-project.md", cat: "Agentic AI", diff: "intermediate", price: 4999, order: 20, courseNumber: "I10" },
  { id: "a1", file: "advanced/A1-production-architecture-for-agentic-systems.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 21, courseNumber: "A1" },
  { id: "a2", file: "advanced/A2-containerization-and-orchestration.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 22, courseNumber: "A2" },
  { id: "a3", file: "advanced/A3-cloud-deployment-azure.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 23, courseNumber: "A3" },
  { id: "a4", file: "advanced/A4-cloud-deployment-aws.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 24, courseNumber: "A4" },
  { id: "a5", file: "advanced/A5-cloud-deployment-gcp.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 25, courseNumber: "A5" },
  { id: "a6", file: "advanced/A6-scalability-performance-cost-optimization.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 26, courseNumber: "A6" },
  { id: "a7", file: "advanced/A7-security-compliance-guardrails.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 27, courseNumber: "A7" },
  { id: "a8", file: "advanced/A8-monitoring-observability-reliability.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 28, courseNumber: "A8" },
  { id: "a9", file: "advanced/A9-enterprise-document-processing.md", cat: "Agentic AI", diff: "advanced", price: 7999, order: 29, courseNumber: "A9" },
  { id: "a10", file: "advanced/A10-ai-powered-sales-crm-agent.md", cat: "Agentic AI", diff: "advanced", price: 7999, order: 30, courseNumber: "A10" },
  { id: "a11", file: "advanced/A11-autonomous-devops-agent.md", cat: "Agentic AI", diff: "advanced", price: 7999, order: 31, courseNumber: "A11" },
  { id: "a12", file: "advanced/A12-multi-tenant-ai-platform.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 32, courseNumber: "A12" },
  { id: "a13", file: "advanced/A13-advanced-capstone-project.md", cat: "Cloud & Production", diff: "advanced", price: 7999, order: 33, courseNumber: "A13" },
];

// ── Parse markdown file ────────────────────────────────────────────
function parseMdFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Extract title from first # heading
  const titleLine = lines.find((l) => l.startsWith("# "));
  let title = titleLine || "";
  // Remove "# Course B1: " or "# Course A13: " prefix
  title = title.replace(/^#\s+Course\s+[A-Z]\d+:\s*/, "").trim();

  // Extract description from > blockquote
  const descLine = lines.find((l) => l.startsWith("> "));
  let desc = descLine || "";
  desc = desc.replace(/^>\s*/, "").replace(/\*\*/g, "").trim();

  // Extract goal from ### heading
  const goalLine = lines.find((l) => l.startsWith("### Goal:"));
  let goal = goalLine ? goalLine.replace(/^###\s*Goal:\s*/, "").trim() : "";

  // Build long description
  const longDesc = `${desc}\n\n**Goal:** ${goal}`;

  // Extract modules and lessons
  const modules = [];
  let currentModule = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      // New module — extract title
      let modTitle = line.replace(/^##\s+/, "").trim();
      // Remove module prefix like "Module B1.1: " or "B3.1 " or "I1.1 " or "A1.1 "
      modTitle = modTitle.replace(/^(?:Module\s+)?[A-Z]\d+\.\d+[:\s]+/, "").trim();
      currentModule = { title: modTitle, lessons: [] };
      modules.push(currentModule);
    } else if (line.startsWith("- ") && currentModule) {
      let lessonText = line.replace(/^-\s+/, "").trim();
      let isLab = false;

      // Check for **Lab**: prefix
      if (lessonText.startsWith("**Lab**:")) {
        isLab = true;
        lessonText = lessonText.replace(/^\*\*Lab\*\*:\s*/, "").trim();
      }

      // Extract title (part before " — ")
      const dashIdx = lessonText.indexOf(" — ");
      const lessonTitle = dashIdx > 0 ? lessonText.substring(0, dashIdx).trim() : lessonText.trim();

      // Clean up any remaining markdown formatting
      const cleanTitle = lessonTitle.replace(/`/g, "").replace(/\*\*/g, "");

      currentModule.lessons.push({ title: cleanTitle, isLab });
    }
  }

  return { title, desc, longDesc, modules };
}

// ── Generate slug from title ───────────────────────────────────────
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Generate duration string ───────────────────────────────────────
function getDuration(totalLessons) {
  const hours = Math.max(1, Math.round((totalLessons * 15) / 60));
  return `${hours} hours`;
}

// ── Escape string for TypeScript ───────────────────────────────────
function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ── Main generation ────────────────────────────────────────────────
function generate() {
  let moduleId = 0;
  let lessonId = 0;
  let totalCourses = 0;
  let totalLessons = 0;

  const courseEntries = [];

  for (const courseDef of COURSES) {
    const filePath = path.join(CONTENT_DIR, courseDef.file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const parsed = parseMdFile(filePath);
    const slug = slugify(parsed.title);
    const lessonCount = parsed.modules.reduce((a, m) => a + m.lessons.length, 0);
    totalLessons += lessonCount;
    totalCourses++;

    // Build modules array
    const modulesCode = parsed.modules
      .map((mod, mi) => {
        moduleId++;
        const lessonsCode = mod.lessons
          .map((lesson, li) => {
            lessonId++;
            const type = lesson.isLab ? "document" : "markdown";
            const isFree = mi === 0 && li === 0;
            return `        { id: "l${lessonId}", title: "${esc(lesson.title)}", type: "${type}", duration: "15 min", order: ${li + 1}, isFree: ${isFree} }`;
          })
          .join(",\n");

        return `      {
        id: "m${moduleId}",
        title: "${esc(mod.title)}",
        order: ${mi + 1},
        lessons: [
${lessonsCode},
        ],
      }`;
      })
      .join(",\n");

    const courseCode = `  {
    id: "${courseDef.id}",
    slug: "${slug}",
    title: "${esc(parsed.title)}",
    description: "${esc(parsed.desc)}",
    longDescription: "${esc(parsed.longDesc)}",
    thumbnail: "/images/placeholder-course.webp",
    price: ${courseDef.price},
    currency: "INR",
    category: "${courseDef.cat}",
    difficulty: "${courseDef.diff}",
    duration: "${getDuration(lessonCount)}",
    status: "published",
    instructor: "NMMR Technologies",
    order: ${courseDef.order},
    courseNumber: "${courseDef.courseNumber}",
    modules: [
${modulesCode},
    ],
  }`;

    courseEntries.push(courseCode);
  }

  // Build full file
  const output = `import type { CourseCategory, CourseDifficulty } from "@/types";

export interface SampleCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  price: number;
  currency: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  duration: string;
  status: "draft" | "published" | "archived";
  instructor: string;
  order: number;
  courseNumber: string;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      type: "markdown" | "document" | "quiz" | "image";
      duration: string;
      order: number;
      isFree: boolean;
    }[];
  }[];
}

export const sampleCourses: SampleCourse[] = [
${courseEntries.join(",\n")},
];

export function getPublishedCourses() {
  return sampleCourses.filter((c) => c.status === "published");
}

export function getCourseBySlug(slug: string) {
  return sampleCourses.find((c) => c.slug === slug && c.status === "published");
}

export function getCoursesByCategory(category: string) {
  return getPublishedCourses().filter((c) => c.category === category);
}

export function searchCourses(query: string) {
  const q = query.toLowerCase();
  return getPublishedCourses().filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
  );
}

export function getLessonsCount(course: SampleCourse) {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`  ${totalCourses} courses, ${totalLessons} total lessons`);
  console.log(`  ${moduleId} modules, ${lessonId} lesson IDs`);
  console.log(`  File size: ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`);

  // ── Also generate JSON seed data for seed scripts ──────────────
  const SEED_JSON_FILE = path.resolve("F:/projects/nmmr-training/scripts/seed-data.json");

  // Reset counters for JSON
  let jModuleId = 0;
  let jLessonId = 0;
  const seedCourses = [];

  for (const courseDef of COURSES) {
    const filePath = path.join(CONTENT_DIR, courseDef.file);
    const parsed = parseMdFile(filePath);
    const slug = slugify(parsed.title);
    const lessonCount = parsed.modules.reduce((a, m) => a + m.lessons.length, 0);

    seedCourses.push({
      slug,
      title: parsed.title,
      description: parsed.desc,
      longDescription: parsed.longDesc,
      thumbnail: "/images/placeholder-course.webp",
      price: courseDef.price,
      currency: "INR",
      category: courseDef.cat,
      difficulty: courseDef.diff,
      duration: getDuration(lessonCount),
      status: "published",
      instructor: "NMMR Technologies",
      order: courseDef.order,
      courseNumber: courseDef.courseNumber,
      modules: parsed.modules.map((mod, mi) => ({
        title: mod.title,
        order: mi + 1,
        lessons: mod.lessons.map((lesson, li) => ({
          title: lesson.title,
          type: lesson.isLab ? "document" : "markdown",
          content: "",
          duration: "15 min",
          order: li + 1,
          isFree: mi === 0 && li === 0,
        })),
      })),
    });
  }

  fs.writeFileSync(SEED_JSON_FILE, JSON.stringify(seedCourses, null, 2), "utf-8");
  console.log(`Generated ${SEED_JSON_FILE} (${(Buffer.byteLength(JSON.stringify(seedCourses)) / 1024).toFixed(1)} KB)`);
}

generate();
