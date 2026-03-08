/**
 * Database Seed Script
 *
 * Seeds the MongoDB database with all 33 Agentic AI courses and a default admin user.
 *
 * Before running, generate the seed data:
 *   node scripts/generate-sample-courses.js
 *
 * Usage:
 *   DATABASE_URL=mongodb://... npx tsx scripts/seed.ts
 *
 * Or set DATABASE_URL in .env.local and run:
 *   npx tsx scripts/seed.ts
 */

import mongoose from "mongoose";
import { hash } from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

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
    enum: ["markdown", "document", "quiz", "image"],
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
    order: { type: Number, default: 0 },
    courseNumber: { type: String, default: "" },
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
// Load course data from generated JSON
// ---------------------------------------------------------------------------

const seedDataPath = resolve(__dirname, "seed-data.json");
let sampleCourses: Record<string, unknown>[];

try {
  const raw = readFileSync(seedDataPath, "utf-8");
  sampleCourses = JSON.parse(raw);
  console.log(`Loaded ${sampleCourses.length} courses from seed-data.json`);
} catch {
  console.error(
    "ERROR: seed-data.json not found. Run 'node scripts/generate-sample-courses.js' first."
  );
  process.exit(1);
}

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
  await mongoose.connect(uri, { dbName: "nmmr-training" });
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
