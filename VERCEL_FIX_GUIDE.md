# 🔧 Vercel Deployment Fix Guide

## 🚨 Problem

Vercel build is failing with "module-not-found" errors for fee-payments pages.

**Error:**
```
Module not found: Can't resolve '@/components/ui/card'
Module not found: Can't resolve '@/components/common/LoadingSpinner'
```

## 🎯 Root Cause

Vercel is trying to build from the **root directory** instead of the **frontend directory**.

---

## ✅ Solution: Configure Vercel to Use Frontend Directory

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click on your project: **hostel-ease-phi** (or similar)
3. Go to: **Settings**

### Step 2: Update Root Directory

1. In Settings, find **"Root Directory"** section
2. Click **"Edit"**
3. Set Root Directory to: `frontend`
4. Click **"Save"**

### Step 3: Verify Build Settings

Still in Settings, check **"Build & Development Settings"**:

**Framework Preset:** Next.js (should be auto-detected)

**Build Command:** (leave as default)
```
npm run build
```

**Output Directory:** (leave as default)
```
.next
```

**Install Command:** (leave as default)
```
npm install
```

### Step 4: Update Environment Variables

1. Go to: **Settings** → **Environment Variables**
2. Make sure you have:
   ```
   NEXT_PUBLIC_API_URL=https://hostel-ease.onrender.com
   ```
3. If not, add it:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://hostel-ease.onrender.com`
   - Environment: **Production**, **Preview**, **Development** (check all)
4. Click **"Save"**

### Step 5: Redeploy

1. Go to: **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Wait for build to complete (2-5 minutes)

---

## 🧪 Alternative: Deploy from Frontend Directory Only

If the above doesn't work, you can:

### Option A: Change GitHub Repository Structure

Move everything from `frontend/` to root:
```bash
# DON'T DO THIS YET - Only if above solution fails
mv frontend/* .
mv frontend/.* . 2>/dev/null
rm -rf frontend
```

### Option B: Create Separate Repository for Frontend

1. Create new repo: `hostelease-frontend`
2. Copy only frontend code
3. Deploy that repo to Vercel

---

## 📋 Vercel Configuration Summary

**Correct Settings:**

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Node Version | 18.x or higher |

**Environment Variables:**

| Name | Value |
|------|-------|
| NEXT_PUBLIC_API_URL | https://hostel-ease.onrender.com |

---

## 🔍 Verify Build Locally

Before redeploying, test the build locally:

```bash
cd frontend
npm run build
```

If this works locally, it should work on Vercel with correct settings.

---

## 🚨 Common Issues

### Issue 1: "Module not found" errors

**Cause:** Root directory not set to `frontend`

**Solution:** Set Root Directory to `frontend` in Vercel settings

### Issue 2: "Environment variable not found"

**Cause:** `NEXT_PUBLIC_API_URL` not set

**Solution:** Add environment variable in Vercel settings

### Issue 3: Build succeeds but app doesn't work

**Cause:** Wrong API URL or backend not running

**Solution:** 
1. Check backend is running: `curl https://hostel-ease.onrender.com`
2. Verify environment variable is correct

---

## ✅ Success Checklist

After fixing:

- [ ] Root Directory set to `frontend` in Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set
- [ ] Build completes successfully
- [ ] Deployment shows "Ready"
- [ ] Can access https://hostel-ease-phi.vercel.app
- [ ] Can sign up/login
- [ ] Can view complaints
- [ ] No console errors

---

## 🎯 Quick Fix Steps

1. **Vercel Dashboard** → Your Project → **Settings**
2. **Root Directory** → Edit → Set to `frontend` → Save
3. **Environment Variables** → Add `NEXT_PUBLIC_API_URL`
4. **Deployments** → **Redeploy**
5. Wait and test

---

## 📞 Still Having Issues?

### Check Build Logs

1. Go to Vercel Dashboard
2. Click on failed deployment
3. Click "View Build Logs"
4. Look for the exact error

### Test Locally

```bash
cd frontend
rm -rf .next
npm install
npm run build
npm start
```

If it works locally, the issue is Vercel configuration.

---

## 🔗 Helpful Links

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Monorepo Setup:** https://vercel.com/docs/concepts/monorepos

---

**After fixing, your deployment should work! 🎉**
