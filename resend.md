# Resend Setup Guide

Password reset emails use [Resend](https://resend.com). Follow these steps to get it working.

## Free Tier

- 100 emails/day
- 1 custom domain
- 1-day data retention

More than enough for password resets.

---

## 1. Create an Account

1. Go to [resend.com/signup](https://resend.com/signup)
2. Sign up with GitHub, Google, or email
3. Verify your email if prompted

## 2. Add & Verify Your Domain

> You can skip this step and use the default `onboarding@resend.dev` sender for testing, but emails will look unprofessional and may land in spam.

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain (e.g., `nmmr.tech`) — Resend recommends a subdomain like `mail.nmmr.tech` to isolate sending reputation
4. Add the DNS records Resend provides to your domain registrar/DNS provider:

   | Type | Name                  | Value                        | Purpose |
   |------|-----------------------|------------------------------|---------|
   | TXT  | (provided by Resend)  | `v=spf1 include:...`         | SPF     |
   | TXT  | (provided by Resend)  | `p=MIGfMA0GCSq...`           | DKIM    |
   | MX   | (provided by Resend)  | (provided by Resend)         | Bounces |

5. Click **Verify** — status will move from `pending` to `verified` (can take a few minutes, up to 72 hours)
6. Optionally add the DMARC record Resend suggests for better deliverability

## 3. Generate an API Key

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Give it a name (e.g., `nmmr-training-password-reset`)
4. Permission: select **Sending access** (least privilege — only needs to send emails)
5. Restrict to your verified domain if prompted
6. Click **Create**
7. **Copy the key immediately** — it is only shown once

The key looks like: `re_abcdefgh_123456789...`

## 4. Configure Environment Variables

Add these to your `.env` (or `.env.local` for local development):

```env
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=noreply@nmmr.tech
```

- `RESEND_API_KEY` — the API key from step 3
- `EMAIL_FROM` — must match your verified domain (e.g., `noreply@nmmr.tech` or `noreply@mail.nmmr.tech`)

For Azure Static Web Apps, add these in the Azure Portal under **Configuration > Application settings**.

## 5. Test

1. Start the app locally: `npm run dev`
2. Go to `/login` and click **Forgot password?**
3. Enter an email address that has an account
4. Check the inbox for the reset email
5. Click the link and set a new password

If emails don't arrive, check:
- API key is correct
- `EMAIL_FROM` domain matches your verified domain in Resend
- Check the [Resend Logs](https://resend.com/emails) dashboard for delivery status
