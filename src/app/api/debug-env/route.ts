import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test 1: DB connection
  try {
    await connectDB();
    results.db = "connected";
  } catch (err: unknown) {
    results.db = `failed: ${err instanceof Error ? err.message : String(err)}`;
    return NextResponse.json(results);
  }

  // Test 2: Check if user exists
  try {
    const user = await User.findOne({ email: "rajendra.venkata@gmail.com" });
    results.userFound = !!user;
    results.userHasPasswordHash = !!(user?.passwordHash);
    results.userProvider = user?.provider ?? "not set";
    results.userRole = user?.role ?? "not set";
  } catch (err: unknown) {
    results.userLookup = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  // Test 3: Test NextAuth CSRF endpoint
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    results.csrfStatus = csrfRes.status;
    if (csrfRes.ok) {
      const csrfData = await csrfRes.json();
      results.csrfTokenPresent = !!csrfData.csrfToken;
    } else {
      results.csrfBody = await csrfRes.text().then(t => t.substring(0, 200));
    }
  } catch (err: unknown) {
    results.csrfTest = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json(results);
}
