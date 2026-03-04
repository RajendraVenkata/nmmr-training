import { NextResponse, NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const results: Record<string, unknown> = {};

  // Test: Call the NextAuth GET handler directly with a csrf request
  try {
    const csrfUrl = new URL("/api/auth/csrf", request.url);
    const fakeReq = new NextRequest(csrfUrl, {
      method: "GET",
      headers: request.headers,
    });
    const response = await handlers.GET(fakeReq);
    results.handlerStatus = response.status;
    const body = await response.text();
    results.handlerBody = body.substring(0, 500);
  } catch (err: unknown) {
    results.handlerError = err instanceof Error
      ? { message: err.message, stack: err.stack?.split("\n").slice(0, 5) }
      : String(err);
  }

  return NextResponse.json(results);
}
