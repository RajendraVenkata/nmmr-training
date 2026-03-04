import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";

/**
 * POST /api/terminal/token
 * Generate a short-lived JWT token for WebSocket terminal connections.
 * This token is passed as a query param to the terminal relay service.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create a short-lived JWT (15 minutes) for terminal access
    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        role: (session.user as { role?: string }).role || "learner",
        purpose: "terminal",
      },
      secret,
      { expiresIn: "15m" }
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error("POST /api/terminal/token error:", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
