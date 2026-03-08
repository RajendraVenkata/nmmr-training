/**
 * Database Seeding Script for Lesson Content
 *
 * Seeds the LessonContent collection with placeholder content for all courses.
 * Idempotent: safe to run multiple times (uses upserts).
 *
 * Usage: npx tsx scripts/seed-content.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

// Sample quiz data for AI Fundamentals
const QUIZ_DATA = {
  title: "AI Fundamentals Quiz",
  description: "Test your understanding of core AI and LLM concepts.",
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
      questionText: "What does the 'context window' refer to?",
      questionType: "multiple-choice",
      options: [
        { text: "The screen where you type prompts", isCorrect: false, order: 0 },
        { text: "The max amount of text a model can process at once", isCorrect: true, order: 1 },
        { text: "The time limit for each API call", isCorrect: false, order: 2 },
        { text: "Number of simultaneous users", isCorrect: false, order: 3 },
      ],
      explanation: "The context window is the max tokens the model can handle in a single request.",
      order: 1,
    },
    {
      questionText: "What does 'temperature' control in LLM output?",
      questionType: "multiple-choice",
      options: [
        { text: "Speed of generation", isCorrect: false, order: 0 },
        { text: "Length of response", isCorrect: false, order: 1 },
        { text: "Randomness/creativity of output", isCorrect: true, order: 2 },
        { text: "Accuracy of facts", isCorrect: false, order: 3 },
      ],
      explanation: "Temperature controls randomness: lower = more deterministic, higher = more creative.",
      order: 2,
    },
    {
      questionText: "Which are components of the ReAct agent pattern?",
      questionType: "multi-select",
      options: [
        { text: "Thought (reasoning)", isCorrect: true, order: 0 },
        { text: "Action (calling a tool)", isCorrect: true, order: 1 },
        { text: "Observation (tool results)", isCorrect: true, order: 2 },
        { text: "Compilation (building code)", isCorrect: false, order: 3 },
      ],
      explanation: "ReAct interleaves Thought → Action → Observation in a loop.",
      order: 3,
    },
    {
      questionText: "RAG lets LLMs answer using private data without retraining.",
      questionType: "true-false",
      options: [
        { text: "True", isCorrect: true, order: 0 },
        { text: "False", isCorrect: false, order: 1 },
      ],
      explanation: "RAG retrieves documents at query time and includes them in the prompt.",
      order: 4,
    },
  ],
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
    console.log("No courses found. Please seed courses first (npx tsx scripts/seed.ts).");
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
        let contentPayload: Record<string, unknown> | null = null;

        if (lesson.type === "markdown" || lesson.type === "document") {
          const markdown = `# ${lesson.title}\n\nContent for this lesson is coming soon.\n\n## Overview\n\nThis lesson covers important concepts related to ${lesson.title.toLowerCase()}.\n`;

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
