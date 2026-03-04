import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test: Create a minimal NextAuth instance to isolate the error
  try {
    // Test 1: Bare minimum — just secret + credentials provider
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

    // Test 2: Call the minimal handler
    const csrfUrl = new URL("/api/auth/csrf", process.env.NEXTAUTH_URL || "http://localhost:3000");
    const req = new Request(csrfUrl.toString(), { method: "GET" });
    const res = await minimalAuth.handlers.GET(req);
    results.minimalHandlerStatus = res.status;
    const body = await res.text();
    results.minimalHandlerBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.minimalError = err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 8) }
      : String(err);
  }

  // Test 3: Now test with the actual auth config (DB-dependent)
  try {
    const { handlers } = await import("@/lib/auth");
    const csrfUrl = new URL("/api/auth/csrf", process.env.NEXTAUTH_URL || "http://localhost:3000");
    const req = new Request(csrfUrl.toString(), { method: "GET" });
    const res = await handlers.GET(req);
    results.realHandlerStatus = res.status;
    const body = await res.text();
    results.realHandlerBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.realError = err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 8) }
      : String(err);
  }

  return NextResponse.json(results);
}
