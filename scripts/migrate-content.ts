/**
 * Content Migration Script
 *
 * Migrates inline lesson content from Course documents to the LessonContent collection.
 * For existing courses that have `content` directly in lesson subdocuments.
 *
 * Idempotent: skips lessons that already have a LessonContent document.
 *
 * Usage:
 *   npx tsx scripts/migrate-content.ts           # Execute migration
 *   npx tsx scripts/migrate-content.ts --dry-run  # Preview only
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.DATABASE_URL;
if (!MONGODB_URI) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const DRY_RUN = process.argv.includes("--dry-run");

// Schema for LessonContent
const LessonContentSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["markdown", "document", "quiz", "image"], required: true },
    markdownContent: String,
    quizData: mongoose.Schema.Types.Mixed,
    imageData: mongoose.Schema.Types.Mixed,
    inlineImages: [mongoose.Schema.Types.Mixed],
    version: { type: Number, default: 1 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
LessonContentSchema.index({ courseId: 1, lessonId: 1 }, { unique: true });

async function migrate() {
  console.log(DRY_RUN ? "=== DRY RUN MODE ===" : "=== EXECUTING MIGRATION ===");
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI!, { dbName: "nmmr-training", retryWrites: false });
  console.log("Connected.");

  const LessonContent =
    mongoose.models.LessonContent ||
    mongoose.model("LessonContent", LessonContentSchema);

  // Use raw collection access for courses
  const db = mongoose.connection.db;
  if (!db) {
    console.error("Failed to get database reference");
    process.exit(1);
  }

  const coursesCollection = db.collection("courses");
  const courses = await coursesCollection.find({}).toArray();
  console.log(`Found ${courses.length} courses.`);

  let migrated = 0;
  let skipped = 0;
  let empty = 0;

  for (const course of courses) {
    const modules = course.modules || [];

    for (const mod of modules) {
      for (const lesson of mod.lessons || []) {
        const lessonId = lesson._id;
        const content = lesson.content || "";

        // Skip if content is empty
        if (!content.trim()) {
          empty++;
          continue;
        }

        // Check if LessonContent already exists
        const existing = await LessonContent.findOne({
          courseId: course._id,
          lessonId: lessonId,
        });

        if (existing) {
          skipped++;
          continue;
        }

        const lessonType = lesson.type || "markdown";

        console.log(
          `  ${DRY_RUN ? "[DRY]" : "[MIGRATE]"} Course "${course.title}" > Lesson "${lesson.title}" (${lessonType}, ${content.length} chars)`
        );

        if (!DRY_RUN) {
          // Only migrate markdown/document types that have inline content
          if (lessonType === "markdown" || lessonType === "document") {
            await LessonContent.create({
              courseId: course._id,
              lessonId: lessonId,
              type: lessonType,
              markdownContent: content,
              version: 1,
            });

            // Update the lesson to set contentRef and clear inline content
            await coursesCollection.updateOne(
              { _id: course._id, "modules.lessons._id": lessonId },
              {
                $set: {
                  "modules.$[].lessons.$[lesson].content":
                    content.substring(0, 200) + (content.length > 200 ? "..." : ""),
                },
              },
              { arrayFilters: [{ "lesson._id": lessonId }] }
            );
          }
        }

        migrated++;
      }
    }
  }

  console.log("\n=== Migration Summary ===");
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Empty content: ${empty}`);

  if (DRY_RUN) {
    console.log("\nThis was a dry run. No changes were made.");
    console.log("Run without --dry-run to execute the migration.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
