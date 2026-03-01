/**
 * Database Seed Script
 *
 * Seeds the MongoDB database with sample courses and a default admin user.
 *
 * Usage:
 *   DATABASE_URL=mongodb://... npx tsx scripts/seed.ts
 *
 * Or set DATABASE_URL in .env.local and run:
 *   npx tsx scripts/seed.ts
 */

import mongoose from "mongoose";
import { hash } from "bcryptjs";

// ---------------------------------------------------------------------------
// Load env from .env.local if present
// ---------------------------------------------------------------------------
import { config } from "dotenv";
config({ path: ".env.local" });

// ---------------------------------------------------------------------------
// Mongoose Schemas (inline to avoid path alias issues in standalone script)
// ---------------------------------------------------------------------------

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["video", "document", "quiz", "markdown"],
    required: true,
  },
  content: { type: String, default: "" },
  duration: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [LessonSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    thumbnail: { type: String, default: "/images/placeholder-course.webp" },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    instructor: { type: String, default: "" },
    modules: [ModuleSchema],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    image: { type: String },
    role: { type: String, enum: ["learner", "admin"], default: "learner" },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ---------------------------------------------------------------------------
// Sample course data (condensed from src/data/sample-courses.ts)
// ---------------------------------------------------------------------------

const sampleCourses = [
  {
    slug: "introduction-to-generative-ai",
    title: "Introduction to Generative AI",
    description:
      "A comprehensive beginner course covering the fundamentals of Generative AI, including LLMs, transformers, and practical applications.",
    longDescription:
      "This course provides a thorough introduction to Generative AI.\n- Understand the fundamentals of Generative AI and LLMs\n- Learn how transformer architectures power modern AI\n- Explore real-world applications across industries\n- Get hands-on experience with AI APIs\n- Build your first AI-powered application\n- Beginners curious about AI and machine learning",
    price: 0,
    currency: "INR",
    category: "GenAI",
    difficulty: "beginner" as const,
    duration: "6 hours",
    status: "published" as const,
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "Getting Started with AI",
        order: 1,
        lessons: [
          { title: "What is Generative AI?", type: "video" as const, duration: "15 min", order: 1, isFree: true },
          { title: "History of AI: From Rule-Based to Generative", type: "video" as const, duration: "20 min", order: 2, isFree: true },
          { title: "Key Concepts and Terminology", type: "document" as const, duration: "10 min", order: 3, isFree: false },
          { title: "Module 1 Quiz", type: "quiz" as const, duration: "10 min", order: 4, isFree: false },
        ],
      },
      {
        title: "Understanding LLMs",
        order: 2,
        lessons: [
          { title: "How Large Language Models Work", type: "video" as const, duration: "25 min", order: 1, isFree: false },
          { title: "Transformer Architecture Explained", type: "video" as const, duration: "30 min", order: 2, isFree: false },
          { title: "Tokenization and Embeddings", type: "document" as const, duration: "15 min", order: 3, isFree: false },
          { title: "Module 2 Quiz", type: "quiz" as const, duration: "10 min", order: 4, isFree: false },
        ],
      },
      {
        title: "Practical Applications",
        order: 3,
        lessons: [
          { title: "Text Generation with AI APIs", type: "video" as const, duration: "20 min", order: 1, isFree: false },
          { title: "Building a Simple Chatbot", type: "markdown" as const, duration: "30 min", order: 2, isFree: false },
          { title: "Image Generation Overview", type: "video" as const, duration: "15 min", order: 3, isFree: false },
          { title: "Final Project: Your First AI App", type: "markdown" as const, duration: "45 min", order: 4, isFree: false },
        ],
      },
    ],
  },
  {
    slug: "building-ai-agents-with-langchain",
    title: "Building AI Agents with LangChain",
    description:
      "Learn to build autonomous AI agents using LangChain, including tool use, memory, and multi-agent orchestration.",
    longDescription:
      "Master the art of building AI agents.\n- Design and build autonomous AI agents\n- Implement tool-using agents with LangChain\n- Build multi-agent systems for complex tasks\n- Add persistent memory to your agents\n- Deploy agents in production environments\n- Developers with basic Python and AI knowledge",
    price: 2999,
    currency: "INR",
    category: "Agentic AI",
    difficulty: "intermediate" as const,
    duration: "10 hours",
    status: "published" as const,
    instructor: "Rajesh Kumar",
    modules: [
      {
        title: "Agent Fundamentals",
        order: 1,
        lessons: [
          { title: "What are AI Agents?", type: "video" as const, duration: "20 min", order: 1, isFree: true },
          { title: "LangChain Setup and Basics", type: "markdown" as const, duration: "25 min", order: 2, isFree: true },
          { title: "Your First Agent", type: "video" as const, duration: "30 min", order: 3, isFree: false },
        ],
      },
    ],
  },
  {
    slug: "prompt-engineering-masterclass",
    title: "Prompt Engineering Masterclass",
    description:
      "Master the art of prompt engineering with advanced techniques for ChatGPT, Claude, and other LLMs.",
    longDescription:
      "Become an expert prompt engineer.\n- Master core prompting techniques\n- Learn advanced strategies like chain-of-thought\n- Optimize prompts for different AI models\n- Build reusable prompt templates\n- Apply prompt engineering in real business scenarios\n- Anyone using AI tools in their work",
    price: 1999,
    currency: "INR",
    category: "Prompt Engineering",
    difficulty: "beginner" as const,
    duration: "5 hours",
    status: "published" as const,
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "Prompting Foundations",
        order: 1,
        lessons: [
          { title: "The Science of Prompting", type: "video" as const, duration: "15 min", order: 1, isFree: true },
          { title: "Prompt Anatomy: Structure and Components", type: "document" as const, duration: "20 min", order: 2, isFree: true },
        ],
      },
    ],
  },
  {
    slug: "rag-systems-production",
    title: "RAG Systems for Production",
    description:
      "Build production-grade Retrieval Augmented Generation systems with vector databases, embeddings, and evaluation frameworks.",
    longDescription:
      "Build enterprise-grade RAG systems.\n- Understand RAG architecture end-to-end\n- Work with vector databases (Pinecone, Chroma)\n- Implement embedding strategies\n- Build evaluation pipelines for RAG quality\n- Deploy RAG systems at scale\n- AI developers building knowledge-powered apps",
    price: 3999,
    currency: "INR",
    category: "AI Development",
    difficulty: "advanced" as const,
    duration: "12 hours",
    status: "published" as const,
    instructor: "Vikram Patel",
    modules: [
      {
        title: "RAG Foundations",
        order: 1,
        lessons: [
          { title: "What is RAG and Why It Matters", type: "video" as const, duration: "20 min", order: 1, isFree: true },
          { title: "Embeddings Deep Dive", type: "video" as const, duration: "30 min", order: 2, isFree: false },
        ],
      },
    ],
  },
  {
    slug: "ai-for-business-leaders",
    title: "AI for Business Leaders",
    description:
      "A strategic course for business leaders to understand AI capabilities, identify use cases, and drive AI adoption in their organizations.",
    longDescription:
      "Understand AI from a business perspective.\n- Understand AI capabilities and limitations\n- Identify high-impact AI use cases\n- Build an AI strategy and roadmap\n- Evaluate AI vendors and solutions\n- Manage AI projects and teams\n- Business leaders and managers",
    price: 4999,
    currency: "INR",
    category: "AI Consulting",
    difficulty: "beginner" as const,
    duration: "8 hours",
    status: "published" as const,
    instructor: "Dr. Priya Sharma",
    modules: [
      {
        title: "AI Landscape",
        order: 1,
        lessons: [
          { title: "The AI Revolution: Where We Are", type: "video" as const, duration: "20 min", order: 1, isFree: true },
          { title: "Types of AI: GenAI, Agentic AI, and More", type: "document" as const, duration: "15 min", order: 2, isFree: true },
        ],
      },
    ],
  },
  {
    slug: "multi-agent-systems-advanced",
    title: "Multi-Agent Systems: Advanced Patterns",
    description:
      "Advanced course on designing and building multi-agent systems with complex orchestration, shared memory, and inter-agent communication.",
    longDescription:
      "Master multi-agent architectures.\n- Design complex multi-agent architectures\n- Implement inter-agent communication protocols\n- Build shared memory and state management\n- Create supervisor and worker agent patterns\n- Deploy and monitor multi-agent systems\n- Experienced developers with agent-building experience",
    price: 0,
    currency: "INR",
    category: "Agentic AI",
    difficulty: "advanced" as const,
    duration: "15 hours",
    status: "draft" as const,
    instructor: "Rajesh Kumar",
    modules: [
      {
        title: "Multi-Agent Foundations",
        order: 1,
        lessons: [
          { title: "Why Multi-Agent Systems?", type: "video" as const, duration: "20 min", order: 1, isFree: true },
          { title: "Architecture Patterns Overview", type: "document" as const, duration: "25 min", order: 2, isFree: false },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("ERROR: DATABASE_URL environment variable is not set.");
    console.error(
      "Usage: DATABASE_URL=mongodb://... npx tsx scripts/seed.ts"
    );
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // --- Seed admin user ---
  const existingAdmin = await User.findOne({ email: "admin@nmmr.tech" });
  if (existingAdmin) {
    console.log("Admin user already exists, skipping.");
  } else {
    const passwordHash = await hash("Admin@123", 12);
    await User.create({
      name: "Admin User",
      email: "admin@nmmr.tech",
      passwordHash,
      role: "admin",
      provider: "credentials",
    });
    console.log("Created admin user: admin@nmmr.tech / Admin@123");
  }

  // --- Seed courses ---
  let created = 0;
  let skipped = 0;
  for (const courseData of sampleCourses) {
    const existing = await Course.findOne({ slug: courseData.slug });
    if (existing) {
      skipped++;
      continue;
    }
    await Course.create(courseData);
    created++;
  }
  console.log(
    `Courses: ${created} created, ${skipped} already existed.\n`
  );

  // --- Summary ---
  const userCount = await User.countDocuments();
  const courseCount = await Course.countDocuments();
  console.log(`Database now has ${userCount} users and ${courseCount} courses.`);

  await mongoose.disconnect();
  console.log("Done. Database connection closed.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
