import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Test 1: Minimal NextAuth — no DB, no Google
  try {
    const minimalAuth = NextAuth({
      secret: process.env.AUTH_SECRET,
      providers: [
        Credentials({
          name: "test",
          credentials: {
            email: { label: "Email", type: "email" },
          },
          async authorize() {
            return null;
          },
        }),
      ],
      session: { strategy: "jwt" },
    });
    results.minimalInit = "ok";

    const csrfUrl = new URL("/api/auth/csrf", baseUrl);
    const req = new NextRequest(csrfUrl);
    const res = await minimalAuth.handlers.GET(req);
    results.minimalStatus = res.status;
    const body = await res.text();
    results.minimalBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.minimalError = err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 8) }
      : String(err);
  }

  // Test 2: Real auth config
  try {
    const { handlers } = await import("@/lib/auth");
    const csrfUrl = new URL("/api/auth/csrf", baseUrl);
    const req = new NextRequest(csrfUrl);
    const res = await handlers.GET(req);
    results.realStatus = res.status;
    const body = await res.text();
    results.realBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.realError = err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 8) }
      : String(err);
  }

  return NextResponse.json(results);
}
