# Multi-Environment Setup

Three environments — **Dev**, **Staging**, **Production** — each with its own Azure Static Web App and database.

## Architecture

| | Dev | Staging | Production |
|---|---|---|---|
| **Branch** | `develop` | `staging` | `main` |
| **SWA Resource** | nmmr-training-dev | nmmr-training-staging | nmmr-training |
| **Database** | nmmr-training-dev | nmmr-training-staging | nmmr-training |
| **Workflow** | azure-swa-dev.yml | azure-swa-staging.yml | azure-static-web-apps.yml |
| **Deploy Token Secret** | `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` | `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` | `AZURE_STATIC_WEB_APPS_API_TOKEN` |

All environments share the same Cosmos DB account — only the database name differs.

## Git Flow

```
feature-branch → develop → staging → main
                   (dev)     (stage)   (prod)
```

## Azure Setup (One-time)

### Step 1 — Create SWA Resources

Create two new Azure Static Web Apps (Free tier):

1. Go to **Azure Portal → Static Web Apps → Create**
2. Create `nmmr-training-dev`:
   - Plan: Free
   - Source: GitHub → `RajendraVenkata/nmmr-training` → branch `develop`
   - Build preset: Custom
   - App location: `/`
   - Skip the auto-generated workflow (we already have ours)
3. Repeat for `nmmr-training-staging` → branch `staging`

### Step 2 — Get Deployment Tokens

For each new SWA resource:

1. Go to **SWA resource → Overview → Manage deployment token**
2. Copy the token

### Step 3 — Configure GitHub Secrets & Environments

In your GitHub repo → **Settings → Environments**:

1. Create environment **`dev`**:
   - Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` = (token from dev SWA)
   - Add secret: `DATABASE_URL` = (same Cosmos connection string)
   - Add secret: `AUTH_SECRET` = (generate a new one: `openssl rand -base64 32`)
   - Add variable: `NEXTAUTH_URL` = (dev SWA URL)
   - Add variable: `NEXT_PUBLIC_SITE_URL` = (dev SWA URL)
   - Other `NEXT_PUBLIC_*` vars as needed

2. Create environment **`staging`**:
   - Same as above with staging tokens/URLs
   - Secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING`

3. Create environment **`production`** (if not already):
   - Keep existing `AZURE_STATIC_WEB_APPS_API_TOKEN` secret
   - Move existing repo-level secrets/vars here

> **Note**: The `DATABASE_URL` can be the same Cosmos connection string for all environments.
> Each environment uses a different database name via the `DB_NAME` env var set in the workflow.

### Step 4 — Configure SWA Application Settings

For each SWA resource, go to **Configuration → Application settings** and add:

| Setting | Dev | Staging | Production |
|---|---|---|---|
| `DATABASE_URL` | (Cosmos connection string) | (same) | (same) |
| `DB_NAME` | `nmmr-training-dev` | `nmmr-training-staging` | `nmmr-training` |
| `AUTH_SECRET` | (unique per env) | (unique per env) | (existing) |
| `NEXTAUTH_URL` | (dev URL) | (staging URL) | (prod URL) |

### Step 5 — Seed Each Database

```bash
# Generate seed data first
node scripts/generate-sample-courses.js

# Seed dev database
node scripts/seed-env.js dev

# Seed staging database
node scripts/seed-env.js staging

# Seed production (if needed)
node scripts/seed-env.js prod
```

## How It Works

- **`src/lib/db.ts`** reads `DB_NAME` env var (defaults to `nmmr-training`)
- Each GitHub Actions workflow sets `DB_NAME` for its environment
- The same Cosmos DB account is used; only the database name changes
- Each SWA resource gets its own deployment token

## Daily Workflow

1. Create feature branch from `develop`
2. Push to `develop` → auto-deploys to **Dev** environment
3. Merge `develop` → `staging` → auto-deploys to **Staging**
4. After QA approval, merge `staging` → `main` → auto-deploys to **Production**
