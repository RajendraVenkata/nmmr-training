/**
 * Database Seeding Script for Lesson Content
 *
 * Seeds the LessonContent collection with sample content for all courses.
 * Idempotent: safe to run multiple times (uses upserts).
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs","paths":{"@/*":["./src/*"]}}' scripts/seed-content.ts
 * Or with tsx: npx tsx scripts/seed-content.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// We need to set up the models manually since we're outside Next.js
const MONGODB_URI = process.env.DATABASE_URL;
if (!MONGODB_URI) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

// Define schemas inline to avoid path alias issues
const OptionSchema = new mongoose.Schema(
  { text: String, isCorrect: Boolean, order: Number },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    questionText: String,
    questionType: String,
    options: [OptionSchema],
    explanation: String,
    order: Number,
  },
  { _id: true }
);

const QuizDataSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    passingScore: Number,
    shuffleQuestions: Boolean,
    questions: [QuestionSchema],
  },
  { _id: false }
);

const InlineImageSchema = new mongoose.Schema(
  { id: String, base64: String, mimeType: String, altText: String },
  { _id: false }
);

const ImageDataSchema = new mongoose.Schema(
  { base64: String, mimeType: String, altText: String, caption: String },
  { _id: false }
);

const LessonContentSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["markdown", "document", "quiz", "image"], required: true },
    markdownContent: String,
    quizData: QuizDataSchema,
    imageData: ImageDataSchema,
    inlineImages: [InlineImageSchema],
    version: { type: Number, default: 1 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
LessonContentSchema.index({ courseId: 1, lessonId: 1 }, { unique: true });

const LessonContent =
  mongoose.models.LessonContent ||
  mongoose.model("LessonContent", LessonContentSchema);

// Sample markdown content (same as sample-lesson-content.ts)
const MARKDOWN_CONTENT: Record<string, string> = {
  l3: `# Key Concepts and Terminology

## Large Language Models (LLMs)

A **Large Language Model** is a neural network trained on vast amounts of text data. These models learn patterns in language and can generate human-like text, answer questions, translate languages, and much more.

### How LLMs Are Trained

LLMs are trained in two main phases:

1. **Pre-training**: The model learns from billions of text documents
2. **Fine-tuning**: The model is refined for specific tasks using curated data

## Key Terms

| Term | Definition |
|------|-----------|
| **Token** | The basic unit of text that LLMs process |
| **Prompt** | The input text given to an LLM |
| **Inference** | The process of generating output from a model |
| **Context Window** | The maximum amount of text a model can process |
| **Temperature** | Controls randomness in model output |

## Summary

Understanding these key concepts is essential for working effectively with Generative AI.`,

  l7: `# Tokenization and Embeddings

## What is Tokenization?

Tokenization is the process of breaking text into smaller units called **tokens**. These tokens are the fundamental building blocks that language models process.

### Types of Tokenization

- **Word-level**: Splits text by spaces and punctuation
- **Subword-level**: Splits words into meaningful sub-units (BPE, WordPiece)
- **Character-level**: Each character is a token

## Understanding Embeddings

**Embeddings** are numerical representations of text in a high-dimensional vector space. Similar concepts are placed close together in this space.

### Why Embeddings Matter

Embeddings enable:
- **Semantic search**: Find documents by meaning, not just keywords
- **Clustering**: Group similar documents together
- **Classification**: Categorize text automatically
- **RAG systems**: Retrieve relevant context for LLM responses`,

  l15: `# Setting Up Your Development Environment

## Prerequisites

Before building AI agents, ensure you have the following installed:

- Python 3.10 or higher
- pip (Python package manager)
- A code editor (VS Code recommended)

## Installation

### Step 1: Create a Virtual Environment

\`\`\`bash
mkdir ai-agent-project && cd ai-agent-project
python -m venv venv
source venv/bin/activate  # macOS/Linux
\`\`\`

### Step 2: Install LangChain

\`\`\`bash
pip install langchain langchain-openai langchain-community python-dotenv
\`\`\`

### Step 3: Verify Installation

\`\`\`python
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()
llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke("Hello! Are you working?")
print(response.content)
\`\`\`

You're now ready to start building AI agents!`,

  l30: `# Common Prompt Patterns

## The CRISP Framework

A structured approach to crafting effective prompts:

- **C**ontext: Set the scene and provide background
- **R**ole: Define who the AI should act as
- **I**nstruction: State what you want clearly
- **S**pecifics: Add constraints, format, and details
- **P**urpose: Explain the end goal

## Pattern 1: Role-Based Prompting

Assign the AI a specific role to get domain-appropriate responses.

## Pattern 2: Few-Shot Examples

Provide examples of the desired input-output pattern before your actual request.

## Pattern 3: Step-by-Step Instructions

Break complex tasks into numbered steps for the AI to follow.

## Pattern 4: Output Formatting

Specify the exact format you want the response in (JSON, markdown, table, etc.).`,

  l52: `# ROI Framework for AI Automation

## Calculating Return on Investment for AI Projects

### The AI ROI Formula

\`\`\`
ROI = (Value Generated - Total Cost) / Total Cost x 100%
\`\`\`

### Value Generated Components

| Component | How to Measure |
|-----------|---------------|
| **Time Saved** | Hours saved per week x hourly cost |
| **Error Reduction** | Cost of errors before vs. after |
| **Throughput Increase** | Additional output capacity |
| **Customer Satisfaction** | NPS improvement, retention rate |

## Decision Framework

Use this decision matrix to prioritize AI automation projects:

1. **High Impact, Low Complexity** - Do first
2. **High Impact, High Complexity** - Plan carefully
3. **Low Impact, Low Complexity** - Quick wins
4. **Low Impact, High Complexity** - Avoid`,

  l62: `# AI Use Cases by Industry

## Healthcare
- Medical Image Analysis
- Drug Discovery
- Clinical Documentation
- Patient Triage

## Financial Services
- Fraud Detection
- Risk Assessment
- Document Processing
- Customer Service

## Retail & E-Commerce
- Personalization
- Inventory Management
- Customer Support
- Content Generation

## Manufacturing
- Quality Control
- Predictive Maintenance
- Supply Chain Optimization
- Process Automation

## Key Takeaway

Every industry has AI opportunities. The key is identifying which use cases deliver the highest ROI for your specific organization.`,
};

// Quiz data for l4
const QUIZ_DATA = {
  title: "AI Fundamentals Quiz",
  description: "Test your understanding of core Generative AI concepts.",
  passingScore: 70,
  shuffleQuestions: false,
  questions: [
    {
      questionText: "What is a Large Language Model (LLM)?",
      questionType: "multiple-choice",
      options: [
        { text: "A database for storing language data", isCorrect: false, order: 0 },
        { text: "A neural network trained on vast amounts of text data", isCorrect: true, order: 1 },
        { text: "A programming language for AI", isCorrect: false, order: 2 },
        { text: "A type of computer hardware", isCorrect: false, order: 3 },
      ],
      explanation: "An LLM is a neural network trained on billions of text documents.",
      order: 0,
    },
    {
      questionText: "Which of the following are phases of LLM training?",
      questionType: "multi-select",
      options: [
        { text: "Pre-training", isCorrect: true, order: 0 },
        { text: "Fine-tuning", isCorrect: true, order: 1 },
        { text: "Compiling", isCorrect: false, order: 2 },
        { text: "Indexing", isCorrect: false, order: 3 },
      ],
      explanation: "LLMs are trained in two phases: pre-training and fine-tuning.",
      order: 1,
    },
    {
      questionText: "A 'token' is the basic unit of text that LLMs process.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true, order: 0 },
        { text: "False", isCorrect: false, order: 1 },
      ],
      explanation: "Correct! Tokens can be words, subwords, or characters.",
      order: 2,
    },
    {
      questionText: "What does the 'temperature' parameter control?",
      questionType: "multiple-choice",
      options: [
        { text: "Speed of generation", isCorrect: false, order: 0 },
        { text: "Length of response", isCorrect: false, order: 1 },
        { text: "Randomness/creativity of output", isCorrect: true, order: 2 },
        { text: "Accuracy of facts", isCorrect: false, order: 3 },
      ],
      explanation: "Temperature controls randomness: lower = more deterministic, higher = more creative.",
      order: 3,
    },
    {
      questionText: "What is the 'context window' of an LLM?",
      questionType: "multiple-choice",
      options: [
        { text: "The screen where you type prompts", isCorrect: false, order: 0 },
        { text: "The max amount of text a model can process at once", isCorrect: true, order: 1 },
        { text: "The time limit for each API call", isCorrect: false, order: 2 },
        { text: "Number of simultaneous users", isCorrect: false, order: 3 },
      ],
      explanation: "The context window is the max tokens the model can handle in a single request.",
      order: 4,
    },
  ],
};

// Map sample lesson IDs to their content type
// (key = sample lesson id like "l3", value = lesson type)
const LESSON_ID_MAP: Record<string, string> = {
  l3: "markdown",
  l4: "quiz",
  l7: "markdown",
  l15: "markdown",
  l30: "markdown",
  l52: "markdown",
  l62: "markdown",
};

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!, { dbName: "nmmr-training", retryWrites: false });
  console.log("Connected.");

  // Get courses from DB
  const CourseModel = mongoose.model(
    "Course",
    new mongoose.Schema({}, { strict: false }),
    "courses"
  );

  const courses = await CourseModel.find({}).lean();
  console.log(`Found ${courses.length} courses in database.`);

  if (courses.length === 0) {
    console.log("No courses found. Please seed courses first.");
    await mongoose.disconnect();
    return;
  }

  let seeded = 0;

  for (const course of courses) {
    const modules = (course as Record<string, unknown>).modules as Array<{
      lessons: Array<{ _id: mongoose.Types.ObjectId; title: string; type: string }>;
    }>;

    if (!modules) continue;

    for (const mod of modules) {
      for (const lesson of mod.lessons || []) {
        const lessonIdStr = lesson._id.toString();

        // Check if we have sample content for this lesson type
        let contentPayload: Record<string, unknown> | null = null;

        if (lesson.type === "markdown" || lesson.type === "document") {
          // Use sample content if available, or generate placeholder
          const sampleKey = Object.keys(MARKDOWN_CONTENT).find(
            (k) => lesson.title.toLowerCase().includes("key concepts") && k === "l3"
              || lesson.title.toLowerCase().includes("tokenization") && k === "l7"
              || lesson.title.toLowerCase().includes("setting up") && k === "l15"
              || lesson.title.toLowerCase().includes("common prompt") && k === "l30"
              || lesson.title.toLowerCase().includes("roi framework") && k === "l52"
              || lesson.title.toLowerCase().includes("use cases by industry") && k === "l62"
          );

          const markdown = sampleKey
            ? MARKDOWN_CONTENT[sampleKey]
            : `# ${lesson.title}\n\nContent for this lesson is coming soon.\n\n## Overview\n\nThis lesson covers important concepts related to ${lesson.title.toLowerCase()}.\n`;

          contentPayload = {
            type: lesson.type,
            markdownContent: markdown,
          };
        } else if (lesson.type === "quiz") {
          contentPayload = {
            type: "quiz",
            quizData: QUIZ_DATA,
          };
        }

        if (contentPayload) {
          await LessonContent.findOneAndUpdate(
            {
              courseId: (course as Record<string, unknown>)._id,
              lessonId: lesson._id,
            },
            {
              ...(contentPayload as object),
              courseId: (course as Record<string, unknown>)._id,
              lessonId: lesson._id,
              version: 1,
            },
            { upsert: true, new: true }
          );
          seeded++;
        }
      }
    }
  }

  console.log(`Seeded ${seeded} lesson content documents.`);
  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
