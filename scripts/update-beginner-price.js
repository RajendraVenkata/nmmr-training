/**
 * One-time script to update beginner course prices from 0 to 2999.
 * Usage: node scripts/update-beginner-price.js
 */
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function run() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "nmmr-training" });
  const db = mongoose.connection.db;
  const col = db.collection("courses");

  const result = await col.updateMany(
    { difficulty: "beginner" },
    { $set: { price: 2999 } }
  );
  console.log(`Updated ${result.modifiedCount} beginner courses to price 2999`);

  // Verify
  const beginnerCourses = await col.find({ difficulty: "beginner" }).project({ title: 1, price: 1 }).toArray();
  beginnerCourses.forEach(c => console.log(`  ${c.title}: ₹${c.price}`));

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
