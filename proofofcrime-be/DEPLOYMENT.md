# Deployment Guide for Render.com with Supabase

This guide will help you deploy the Proof of Crime API backend to Render.com using Supabase as your PostgreSQL database.

## Prerequisites

- A Supabase account with a project created
- A Render.com account
- Your code pushed to a GitHub repository

## Step 1: Set Up Supabase Database

1. **Create/Access Your Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project or select your existing project
   - Wait for the project to finish setting up

2. **Get Database Connection String:**
   - Go to Project Settings → Database
   - Scroll to "Connection String" section
   - Copy the **URI** (Transaction or Session mode)
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password

3. **Save This Connection String** - You'll need it for Render.com

## Step 2: Deploy to Render.com

### Create Web Service

1. **Go to Render Dashboard:**
   - Visit [https://render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect Your Repository:**
   - Connect your GitHub account if not already connected
   - Select your `Proof-of-Crime` repository
   - Click "Connect"

3. **Configure Service:**
   
   **Name:** `proofofcrime-api` (or your preferred name)
   
   **Root Directory:** `proofofcrime-be`
   
   **Environment:** `Node`
   
   **Region:** Choose closest to your users
   
   **Branch:** `main` (or your default branch)
   
   **Build Command:**
   ```bash
   npm install && npm run db:generate && npm run build
   ```
   
   **Start Command:**
   ```bash
   npm run db:migrate && npm start
   ```
   
   **Plan:** Free (or upgrade as needed)

### Environment Variables

Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string from Step 1 |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://your-app.vercel.app`) |
| `PORT` | `5000` (Render will override this, but good to set) |

**Important:** Make sure to paste your actual Supabase DATABASE_URL with the real password!

4. **Create Web Service**
   - Click "Create Web Service"
   - Render will start deploying your application

## Step 3: Run Database Migrations

Once your service is deployed:

1. **Go to Shell:**
   - In your Render service dashboard
   - Click "Shell" tab
   - Wait for it to connect

2. **Run Migration:**
   ```bash
   npx prisma migrate deploy
   ```
   
   Or if you need to push schema directly:
   ```bash
   npx prisma db push
   ```

3. **Verify Connection:**
   ```bash
   npx prisma db pull
   ```

## Step 4: Verify Deployment

1. **Check Logs:**
   - Go to "Logs" tab in Render
   - Look for:
     ```
     🚀 Server running on port 5000
     ✅ Database connected successfully
     ```

2. **Test API:**
   - Your API URL will be: `https://your-service.onrender.com`
   - Test health endpoint: `https://your-service.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test API Endpoints:**
   ```bash
   # Get statistics
   curl https://your-service.onrender.com/api/statistics/dashboard
   
   # Get cases
   curl https://your-service.onrender.com/api/cases
   
   # Get bounties
   curl https://your-service.onrender.com/api/bounties
   ```

## Step 5: Update Frontend

Update your frontend to use the new API URL:

1. **Create/Update `.env.local` in proofofcrime-ui:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-service.onrender.com
   ```

2. **Update API calls in your frontend:**
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
   
   // Example fetch
   const response = await fetch(`${API_URL}/api/cases`)
   ```

## Troubleshooting

### Database Connection Fails

- **Check Supabase Connection String:** Make sure password is correct
- **Check Supabase IP Allowlist:** Supabase allows all IPs by default, but verify in Settings
- **Check Render Logs:** Look for specific error messages

### Migrations Fail

If migrations fail, you can run them manually from Render Shell:

```bash
# Reset and migrate
npx prisma migrate reset --force
npx prisma migrate deploy
```

Or push schema directly:
```bash
npx prisma db push --accept-data-loss
```

### Service Starts but Returns 500 Errors

- **Check Environment Variables:** Ensure all are set correctly
- **Check Logs:** Look for Prisma connection errors
- **Regenerate Prisma Client:**
  ```bash
  npx prisma generate
  npm run build
  ```

### CORS Issues

- Ensure `FRONTEND_URL` environment variable matches your frontend domain
- Check that your frontend is using `https://` in production

## Monitoring

1. **Render Metrics:**
   - Check CPU and Memory usage in Render dashboard
   - Monitor response times

2. **Supabase Metrics:**
   - Go to Supabase Dashboard → Reports
   - Monitor database connections and query performance

## Scaling

### Free Tier Limitations

Render free tier:
- Spins down after 15 minutes of inactivity
- First request after spin-down will be slow (~30s)

Supabase free tier:
- 500 MB database space
- 2 GB bandwidth per month

### Upgrading

To avoid spin-downs and get better performance:
- Upgrade Render to paid plan ($7/month+)
- Consider Supabase Pro for larger database needs

## Maintenance

### Updating Code

When you push to GitHub:
1. Render auto-deploys on push to main branch
2. Runs build command automatically
3. Migrations run on start

### Database Backups

Supabase automatically backs up your database daily (free tier).

### Monitoring Logs

Set up log monitoring in Render to catch errors early.

## Next Steps

- Set up custom domain in Render
- Enable auto-deploy on git push
- Set up monitoring/alerting
- Consider setting up CI/CD pipeline
- Add rate limiting for production

---

## Quick Reference

**Service URL:** `https://your-service.onrender.com`

**API Endpoints:**
- Health: `GET /health`
- Cases: `GET/POST/PUT/PATCH/DELETE /api/cases`
- Bounties: `GET/POST/PUT/PATCH/DELETE /api/bounties`
- Users: `GET/POST/PUT/PATCH /api/users`
- Companies: `GET/POST/PUT/DELETE /api/companies`
- Submissions: `GET/POST/PUT/DELETE /api/submissions`
- Statistics: `GET /api/statistics` and `GET /api/statistics/dashboard`

**Useful Commands:**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```
