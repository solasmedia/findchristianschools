# FindChristianSchools.com - Railway Deployment Guide

**Version:** 8720ba22  
**Date:** May 14, 2026  
**Status:** Production Ready  

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
4. [Step 2: Create Railway Account](#step-2-create-railway-account)
5. [Step 3: Deploy to Railway](#step-3-deploy-to-railway)
6. [Step 4: Configure Domain](#step-4-configure-domain)
7. [Step 5: Verify Deployment](#step-5-verify-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance & Updates](#maintenance--updates)

---

## 🚀 Quick Start

**Timeline:** 30-45 minutes  
**Cost:** $10-20/month

### What You'll Have After This:
- ✅ Live website on Railway
- ✅ Automatic deployments from GitHub
- ✅ Professional hosting
- ✅ Custom domain (findchristianschools.org)
- ✅ Database backups
- ✅ Admin panel fully functional

---

## ✅ Prerequisites

Before starting, make sure you have:

- [ ] GitHub account (solasmedia) - ✅ You have this
- [ ] GitHub repository created (findchristianschools) - ✅ You have this
- [ ] Railway account (create during Step 2)
- [ ] Domain (findchristianschools.org) - ✅ You have this
- [ ] Email: dworiordan@icloud.com - ✅ You have this

---

## Step 1: Push Code to GitHub

### Option A: Using GitHub Desktop (Easiest - Recommended)

1. **Download GitHub Desktop**
   - Go to: https://desktop.github.com
   - Install and open

2. **Clone Your Repository**
   - Click "File" → "Clone Repository"
   - Enter: `solasmedia/findchristianschools`
   - Choose local path: `/home/ubuntu/copy-of-findchristianschools.com`
   - Click "Clone"

3. **Push Code**
   - GitHub Desktop will detect changes
   - Click "Commit to main"
   - Add message: "Initial commit: Production-ready code"
   - Click "Push origin"

### Option B: Using Command Line with Token

1. **Generate GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: "Railway Deployment"
   - Select permissions:
     - ✅ `repo` (full control)
     - ✅ `workflow`
   - Click "Generate token"
   - **Copy the token** (save it somewhere safe)

2. **Push Code Using Token**
   ```bash
   cd /home/ubuntu/copy-of-findchristianschools.com
   git push -u origin main
   # When prompted for password, paste your token
   ```

3. **Verify Push**
   - Go to: https://github.com/solasmedia/findchristianschools
   - You should see all your code files

---

## Step 2: Create Railway Account

1. **Go to Railway**
   - Visit: https://railway.app

2. **Sign Up**
   - Click "Start a Project"
   - Sign up with GitHub (solasmedia)
   - Authorize Railway to access your GitHub

3. **Verify Email**
   - Check dworiordan@icloud.com for verification email
   - Click the link to verify

---

## Step 3: Deploy to Railway

### 3.1: Create New Project

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. **Select Repository**
   - Find: `solasmedia/findchristianschools`
   - Click "Deploy"

### 3.2: Configure Environment Variables

Railway will ask for environment variables. Here's what you need:

```
DATABASE_URL=mysql://user:password@host:3306/findchristianschools
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_APP_TITLE=Find Christian Schools
VITE_APP_LOGO=your-logo-url
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
NODE_ENV=production
```

**Where to get these values:**
- See `.env.example` in the repository
- Most values are already configured in Manus
- Copy from your current Manus environment

### 3.3: Add Database

1. **In Railway Dashboard**
   - Click "Add Service"
   - Select "MySQL"
   - Railway will create a MySQL instance

2. **Get Connection String**
   - Railway shows: `DATABASE_URL`
   - Copy this value
   - Paste into environment variables above

### 3.4: Deploy

1. **Click "Deploy"**
   - Railway builds your app
   - Takes 3-5 minutes
   - You'll see logs in real-time

2. **Wait for Success**
   - You should see: "Deployment successful"
   - Your app is now live!

---

## Step 4: Configure Domain

### 4.1: Get Railway Domain

1. **In Railway Dashboard**
   - Click your project
   - Go to "Settings"
   - Find "Domains"
   - You'll see a Railway domain: `findchristianschools-xxx.railway.app`

### 4.2: Connect findchristianschools.org

1. **Go to Your Domain Registrar**
   - Where you bought findchristianschools.org
   - Usually: GoDaddy, Namecheap, etc.

2. **Update DNS Settings**
   - Create CNAME record:
     - **Name:** `@` (or leave blank)
     - **Value:** `findchristianschools-xxx.railway.app`
   - Create another CNAME for www:
     - **Name:** `www`
     - **Value:** `findchristianschools-xxx.railway.app`

3. **In Railway Settings**
   - Add custom domain: `findchristianschools.org`
   - Add: `www.findchristianschools.org`
   - Railway auto-configures SSL

4. **Wait for DNS Propagation**
   - Takes 5-30 minutes
   - Check: https://findchristianschools.org
   - Should load your site!

---

## Step 5: Verify Deployment

### 5.1: Test Website

- [ ] Visit https://findchristianschools.org
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Search functionality works
- [ ] School profiles display

### 5.2: Test Admin Panel

- [ ] Log in to admin panel
- [ ] View dashboard
- [ ] Check analytics
- [ ] Verify schools display
- [ ] Test job listings

### 5.3: Test Key Features

- [ ] Search schools
- [ ] View school details
- [ ] Check job board
- [ ] Test feedback form
- [ ] Verify payments (test mode)

### 5.4: Check Logs

In Railway Dashboard:
- Click "Logs"
- Look for any errors
- Should see: "Server running on port 3000"

---

## 🔧 Troubleshooting

### Issue: "Deployment Failed"

**Solution:**
1. Check Railway logs for error message
2. Common causes:
   - Missing environment variables
   - Database connection failed
   - Port already in use

### Issue: "Database Connection Error"

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check MySQL service is running
3. Ensure database exists

### Issue: "Domain Not Working"

**Solution:**
1. Wait 30 minutes for DNS propagation
2. Clear browser cache
3. Check DNS records are correct
4. Use: https://dns.google to check DNS

### Issue: "Admin Panel Not Loading"

**Solution:**
1. Check environment variables
2. Verify OAuth credentials
3. Check browser console for errors
4. Clear cookies and try again

---

## 🔄 Maintenance & Updates

### Making Code Changes

1. **Edit Code Locally**
   - Make changes on your computer
   - Test locally

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

3. **Railway Auto-Deploys**
   - Railway detects push
   - Automatically rebuilds
   - New version live in 2-3 minutes

### Database Backups

**Automatic:**
- Railway backs up MySQL daily
- Kept for 7 days

**Manual Backup:**
1. In Railway Dashboard
2. Go to MySQL service
3. Click "Backups"
4. Click "Create Backup"

### Monitoring

**Check Status:**
- Railway Dashboard shows:
  - CPU usage
  - Memory usage
  - Requests/second
  - Error rate

**Set Up Alerts:**
- Railway can email if service goes down
- Configure in "Settings" → "Notifications"

---

## 📞 Support

### If Something Goes Wrong

1. **Check Railway Logs**
   - Dashboard → Logs
   - Look for error messages

2. **Check GitHub Actions**
   - https://github.com/solasmedia/findchristianschools/actions
   - See build logs

3. **Railway Support**
   - https://railway.app/support
   - Email: support@railway.app

4. **Common Issues**
   - See Troubleshooting section above

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] MySQL database created
- [ ] App deployed successfully
- [ ] Domain DNS configured
- [ ] Website loads at findchristianschools.org
- [ ] Admin panel works
- [ ] All features tested
- [ ] Backups configured
- [ ] Monitoring enabled

---

## 🎉 You're Done!

Your site is now live on Railway with:
- ✅ Professional hosting ($10-20/month)
- ✅ Automatic deployments from GitHub
- ✅ Custom domain
- ✅ SSL/TLS encryption
- ✅ Database backups
- ✅ Monitoring and alerts
- ✅ Easy maintenance

**Next Steps:**
1. Monitor the site for the first week
2. Collect user feedback
3. Plan Phase 2: Supabase migration (next month)

---

## 📊 Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Railway (App) | $5-10/month | Scales automatically |
| Railway (MySQL) | $5-10/month | Includes backups |
| Domain | $12/year | findchristianschools.org |
| **Total** | **$10-20/month** | Very affordable |

---

**Questions?** Refer to the Railway docs: https://docs.railway.app
