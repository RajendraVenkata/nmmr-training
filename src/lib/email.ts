import { Resend } from "resend";

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const emailFrom = process.env.EMAIL_FROM || "noreply@nmmr.tech";
  await getResend().emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your NMMR Training password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a1a; margin-bottom: 16px;">Reset Your Password</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">
          We received a request to reset the password for your NMMR Training account.
          Click the button below to set a new password.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a
            href="${resetUrl}"
            style="background-color: #0f172a; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;"
          >
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
