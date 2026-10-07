# Portfolio OS — Production Deployment & Operational Runbook

## Overview

This guide details the step-by-step procedure for deploying **Portfolio OS Version 1.0.0** to production environments (Vercel, Netlify, or Node.js Standalone Docker containers).

---

## 1. Prerequisites & Required Secrets

Ensure the following production services are provisioned and environment variables configured in your deployment platform:

### Environment Variables

```env
# Node & Application Environment
NODE_ENV=production
PORT=3000

# MongoDB Atlas Production Cluster
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_os?retryWrites=true&w=majority

# Better Auth Session Security
BETTER_AUTH_SECRET=your_32_character_hex_secret_here
BETTER_AUTH_URL=https://your-domain.com

# Cloudinary Media Storage Adapter
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional Monitoring / Sentry DSN
SENTRY_DSN=https://your_sentry_dsn_here
```

---

## 2. Deployment Strategies

### Strategy A: Deployment on Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Select **Astro** as the framework preset.
3. Configure Environment Variables in the project settings dashboard.
4. Deploy the `main` branch.

### Strategy B: Node.js Standalone Docker Container
1. Build the production Docker image:
   ```bash
   docker build -t portfolio-os:1.0.0 .
   ```
2. Run container with environment file:
   ```bash
   docker run -d -p 3000:3000 --env-file .env.production portfolio-os:1.0.0
   ```

---

## 3. Database Indexes & Initialization

Ensure the following indexes are created on MongoDB Atlas:
- `projects`: `{ slug: 1 }` (unique), `{ featured: 1 }`
- `blogs`: `{ slug: 1 }` (unique), `{ status: 1, publishedAt: -1 }`
- `learning`: `{ slug: 1 }` (unique), `{ category: 1 }`
- `journey`: `{ slug: 1 }` (unique), `{ milestoneType: 1 }`
- `audit_logs`: `{ action: 1, actor: 1 }`, `{ createdAt: -1 }`

---

## 4. Operational Health Check Probes

Verify deployment health using the built-in REST endpoints:
- System Status: `GET https://your-domain.com/api/v1/health`
- Database Diagnostics: `GET https://your-domain.com/api/v1/health/db`

---

## 5. Rollback Procedure

If issues arise during deployment:
1. Trigger Vercel / Netlify Instant Rollback to the previous deployment commit tag.
2. MongoDB Atlas restores automatically using continuous point-in-time recovery.
