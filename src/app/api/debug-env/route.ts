import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Test 1: Environment variables
  const envCheck = {
    hasAuthSecret: !!process.env.AUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 15) ?? "NOT SET",
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL ?? "NOT SET",
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) ?? "NOT SET",
    nodeEnv: process.env.NODE_ENV ?? "NOT SET",
  };

  // Test 2: Database connection
  let dbStatus = "not tested";
  try {
    await connectDB();
    dbStatus = "connected";
  } catch (err: unknown) {
    dbStatus = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  // Test 3: NextAuth import
  let authStatus = "not tested";
  try {
    const { auth } = await import("@/lib/auth");
    authStatus = auth ? "initialized" : "null";
  } catch (err: unknown) {
    authStatus = `failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    envCheck,
    dbStatus,
    authStatus,
  });
}
