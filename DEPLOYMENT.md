# NMMR Training — Deployment Guide

## Prerequisites

- Azure account (free tier is sufficient)
- GitHub repository with the codebase
- MongoDB Atlas account (free tier M0 cluster)
- Node.js 20+ installed locally
- Custom domain (optional)

---

## Step 1: Create Azure Static Web Apps Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **Static Web Apps** → **Create**
3. Settings:
   - **Plan**: Free
   - **Source**: GitHub
   - **Organization / Repository**: Select your repo
   - **Branch**: `main`
   - **Build Preset**: Custom
   - **App location**: `/`
   - **Output location**: `.next`
4. Click **Review + Create** → **Create**
5. Azure will auto-create a GitHub Actions workflow. If it conflicts with `.github/workflows/azure-static-web-apps.yml`, use the Azure-generated one and delete the template.

---

## Step 2: Set Environment Variables in Azure

Go to your Static Web App → **Configuration** → **Application settings**.

Add the following:

| Name | Value |
|------|-------|
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.azurestaticapps.net` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `NEXT_PUBLIC_CLARITY_ID` | From Microsoft Clarity dashboard |
| `NEXT_PUBLIC_CHAT_ENABLED` | `true` or `false` |
| `NEXT_PUBLIC_CHAT_API_URL` | Azure Function App URL (if chat enabled) |
| `FORMSPREE_ENDPOINT` | From Formspree dashboard |

> **Important**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in `NEXT_PUBLIC_` variables.

---

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user with password
4. Add `0.0.0.0/0` to IP Access List (or use Azure IP ranges)
5. Get the connection string: **Connect** → **Drivers** → **Node.js**
6. Replace `<password>` with your database user's password
7. Set as `DATABASE_URL` in Azure configuration

### Database Indexes

The Mongoose models create these indexes automatically:
- `users.email` — unique
- `courses.slug` — unique
- `enrollments.userId + courseId` — compound unique

---

## Step 4: Seed the Database

Run the seed script to populate initial courses and admin user:

```bash
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/nmmr-training" npx tsx scripts/seed.ts
```

This creates:
- 1 admin user (`admin@nmmr.tech` / `Admin@123`) — **change password immediately after first login**
- 6 sample courses (5 published, 1 draft)

---

## Step 5: Configure Custom Domain (Optional)

1. Go to Static Web App → **Custom domains** → **Add**
2. Choose **Custom domain on other DNS**
3. Enter your domain (e.g., `training.nmmr.tech`)
4. Add the CNAME record at your DNS provider:
   - **Type**: CNAME
   - **Name**: `training` (or your subdomain)
   - **Value**: `your-app.azurestaticapps.net`
5. Azure will auto-provision a free SSL certificate

---

## Step 6: Set Up Microsoft Clarity (Optional)

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Create a new project
3. Copy the Project ID
4. Set as `NEXT_PUBLIC_CLARITY_ID` in Azure configuration

---

## Step 7: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `https://your-app.azurestaticapps.net/api/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Azure

---

## Step 8: Production Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Course catalog displays published courses
- [ ] Course detail pages render with curriculum
- [ ] Registration with email works
- [ ] Google OAuth sign-in works
- [ ] Login/logout flow works
- [ ] Dashboard shows enrolled courses
- [ ] Admin panel accessible for admin user
- [ ] Contact form submits to Formspree
- [ ] Dark mode toggle works
- [ ] Sitemap.xml renders at `/sitemap.xml`
- [ ] Robots.txt renders at `/robots.txt`
- [ ] 404 page shows for invalid URLs
- [ ] SSL certificate is active (HTTPS)
- [ ] Privacy Policy and Terms of Service pages load

---

## Troubleshooting

### Build fails in GitHub Actions
- Check that all `NEXT_PUBLIC_*` vars are set in GitHub repo **Variables** (not Secrets) — they're needed at build time
- Server-side env vars go in Azure **Configuration**

### API routes return 500
- Check `DATABASE_URL` is set correctly in Azure Configuration
- Verify MongoDB Atlas IP access list includes Azure IPs (or `0.0.0.0/0`)

### Auth redirects to wrong URL
- Verify `NEXTAUTH_URL` matches your deployed domain exactly
- Check Google OAuth redirect URIs include your production domain

### Images not loading
- For Azure Blob Storage images, verify CORS is configured on the storage account
- The `next.config.mjs` already allows `*.blob.core.windows.net` remote images
