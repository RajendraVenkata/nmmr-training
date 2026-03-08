/**
 * One-time script to add order/courseNumber to existing DB courses
 * and remove old courses that don't belong to the new curriculum.
 *
 * Usage: node scripts/update-order.js
 */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const seedData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "seed-data.json"), "utf-8")
);

// Build a map of slug -> { order, courseNumber }
const slugMap = {};
seedData.forEach((c) => {
  slugMap[c.slug] = { order: c.order, courseNumber: c.courseNumber };
});

async function run() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "nmmr-training" });
  const db = mongoose.connection.db;
  const col = db.collection("courses");

  // Update the 33 new courses with order and courseNumber
  let updated = 0;
  for (const [slug, meta] of Object.entries(slugMap)) {
    const result = await col.updateOne(
      { slug },
      { $set: { order: meta.order, courseNumber: meta.courseNumber } }
    );
    if (result.modifiedCount > 0) updated++;
  }
  console.log(`Updated ${updated} courses with order/courseNumber`);

  // Delete old courses that don't have a matching slug
  const validSlugs = Object.keys(slugMap);
  const deleteResult = await col.deleteMany({ slug: { $nin: validSlugs } });
  console.log(`Deleted ${deleteResult.deletedCount} old courses`);

  // Verify
  const total = await col.countDocuments();
  console.log(`Total courses in DB: ${total}`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
