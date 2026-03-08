import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { token, password } = result.data;

    await connectDB();

    // Find valid token
    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: resetToken.email });
    if (!user) {
      return NextResponse.json(
        { message: "Account not found." },
        { status: 400 }
      );
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 12);
    user.passwordHash = passwordHash;
    await user.save();

    // Delete used token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
