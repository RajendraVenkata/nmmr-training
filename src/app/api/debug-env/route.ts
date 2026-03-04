import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Test 1: With trustHost: true
  try {
    const authWithTrust = NextAuth({
      secret: process.env.AUTH_SECRET,
      trustHost: true,
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

    const csrfUrl = new URL("/api/auth/csrf", baseUrl);
    const req = new NextRequest(csrfUrl);
    const res = await authWithTrust.handlers.GET(req);
    results.trustHostStatus = res.status;
    const body = await res.text();
    results.trustHostBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.trustHostError = err instanceof Error
      ? { name: err.name, message: err.message }
      : String(err);
  }

  // Test 2: Without trustHost (current behavior)
  try {
    const authWithout = NextAuth({
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

    const csrfUrl = new URL("/api/auth/csrf", baseUrl);
    const req = new NextRequest(csrfUrl);
    const res = await authWithout.handlers.GET(req);
    results.noTrustStatus = res.status;
    const body = await res.text();
    results.noTrustBody = body.substring(0, 300);
  } catch (err: unknown) {
    results.noTrustError = err instanceof Error
      ? { name: err.name, message: err.message }
      : String(err);
  }

  return NextResponse.json(results);
}
