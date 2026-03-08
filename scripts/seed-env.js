/**
 * Seed courses into a specific environment database.
 *
 * Usage:
 *   node scripts/seed-env.js dev       # Seeds nmmr-training-dev database
 *   node scripts/seed-env.js staging   # Seeds nmmr-training-staging database
 *   node scripts/seed-env.js prod      # Seeds nmmr-training database (production)
 *
 * Prerequisites:
 *   1. Run `node scripts/generate-sample-courses.js` to generate seed-data.json
 *   2. Set DATABASE_URL in .env.local (base Cosmos DB connection string)
 *
 * The script uses the same Cosmos DB account but different database names:
 *   - dev:     nmmr-training-dev
 *   - staging: nmmr-training-staging
 *   - prod:    nmmr-training
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Try loading .env.local
try {
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv not installed
}

const ENV_MAP = {
  dev: "nmmr-training-dev",
  staging: "nmmr-training-staging",
  prod: "nmmr-training",
};

const env = process.argv[2];
if (!env || !ENV_MAP[env]) {
  console.error("Usage: node scripts/seed-env.js <dev|staging|prod>");
  console.error("");
  console.error("  dev     → nmmr-training-dev database");
  console.error("  staging → nmmr-training-staging database");
  console.error("  prod    → nmmr-training database");
  process.exit(1);
}

const dbName = ENV_MAP[env];
const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error("ERROR: DATABASE_URL not set. Add it to .env.local");
  process.exit(1);
}

// Load seed data
const seedDataPath = path.resolve(__dirname, "seed-data.json");
if (!fs.existsSync(seedDataPath)) {
  console.error(
    "ERROR: seed-data.json not found. Run 'node scripts/generate-sample-courses.js' first."
  );
  process.exit(1);
}

const courses = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

// Define a minimal Course schema for seeding
const CourseSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Course = mongoose.model("Course", CourseSchema);

async function run() {
  console.log(`\nSeeding environment: ${env.toUpperCase()}`);
  console.log(`Database: ${dbName}`);
  console.log(`Courses to seed: ${courses.length}`);
  console.log("---");

  await mongoose.connect(uri, { dbName });
  console.log("Connected to Cosmos DB");

  // Check existing courses
  const existing = await Course.countDocuments();
  if (existing > 0) {
    console.log(`Found ${existing} existing courses. Dropping collection...`);
    await Course.collection.drop();
    console.log("Collection dropped.");
  }

  // Insert all courses
  const result = await Course.insertMany(courses);
  console.log(`Inserted ${result.length} courses.`);

  const totalLessons = courses.reduce(
    (a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0),
    0
  );
  console.log(`Total lessons: ${totalLessons}`);

  // Verify
  const count = await Course.countDocuments();
  console.log(`Verification: ${count} courses in ${dbName}`);

  await mongoose.disconnect();
  console.log(`\nDone seeding ${env.toUpperCase()} environment.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
