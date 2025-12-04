# 🚀 HostelEase Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (closest to you)
6. Name your cluster: `hostelease-cluster`
7. Click "Create"

### Step 2: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hostelease_user`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Whitelist IP Addresses

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `myFirstDatabase` with `hostelease`

**Example:**
```
mongodb+srv://hostelease_user:YOUR_PASSWORD@hostelease-cluster.xxxxx.mongodb.net/hostelease?retryWrites=true&w=majority
```

---

## Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend

1. Make sure your code is pushed to GitHub
2. Ensure `backend/package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### Step 3: Configure Service

**Basic Settings:**
- Name: `hostelease-backend`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install && npx prisma generate`
- Start Command: `npm start`

**Plan:**
- Select **Free** tier

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables:

```
DATABASE_URL=mongodb+srv://hostelease_user:YOUR_PASSWORD@hostelease-cluster.xxxxx.mongodb.net/hostelease?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this

NODE_ENV=production

PORT=4000
```

**Generate secure secrets:**
```bash
# On your terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://hostelease-backend.onrender.com`
4. Test it: `https://hostelease-backend.onrender.com/` should show "HostelEase Backend Server is Running"

### Step 6: Update CORS

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app', // Add your Vercel URL here
  ],
  credentials: true
}));
```

Commit and push to trigger redeployment.

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure code is pushed to GitHub
2. Check `frontend/package.json` has build script:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select your repository

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `.next` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variables

Click "Environment Variables"

Add:
```
NEXT_PUBLIC_API_URL=https://hostelease-backend.onrender.com
```

(Use your actual Render backend URL)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. You'll get a URL like: `https://hostelease-xxxxx.vercel.app`

### Step 6: Test Deployment

1. Visit your Vercel URL
2. Try to sign up / log in
3. Test creating a complaint
4. Test all features

---

## Part 4: Post-Deployment Configuration

### Update Backend CORS

Now that you have your Vercel URL, update backend CORS:

1. Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://hostelease-xxxxx.vercel.app', // Your actual Vercel URL
  ],
  credentials: true
}));
```

2. Commit and push
3. Render will auto-redeploy

### Seed Database (Optional)

If you want sample data:

1. Go to Render dashboard
2. Click on your service
3. Go to "Shell" tab
4. Run:
```bash
node seed-fee-payments.js
node seed-visitors.js
node seed-leave-applications.js
```

---

## Part 5: Custom Domain (Optional)

### For Frontend (Vercel)

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### For Backend (Render)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### Backend Issues

**Problem:** "Cannot connect to database"
- Check DATABASE_URL is correct
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials

**Problem:** "Prisma Client not found"
- Ensure build command includes `npx prisma generate`
- Check Render logs for build errors

**Problem:** "CORS error"
- Add your Vercel URL to CORS origins
- Redeploy backend after updating

### Frontend Issues

**Problem:** "Failed to fetch"
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check browser console for exact error

**Problem:** "Build failed"
- Check all dependencies are in package.json
- Verify no TypeScript errors
- Check Vercel build logs

**Problem:** "Environment variable not found"
- Ensure NEXT_PUBLIC_API_URL is set in Vercel
- Redeploy after adding env vars

---

## Monitoring

### Vercel
- Go to your project → Analytics
- View page views, performance, errors

### Render
- Go to your service → Logs
- View real-time logs
- Check for errors

### MongoDB Atlas
- Go to your cluster → Metrics
- View database performance
- Check connection count

---

## Maintenance

### Update Code

**Backend:**
1. Push to GitHub
2. Render auto-deploys

**Frontend:**
1. Push to GitHub
2. Vercel auto-deploys

### Database Backups

MongoDB Atlas (Free tier):
- Automatic backups (limited)
- Manual export via MongoDB Compass

### Logs

**Backend logs:** Render dashboard → Logs (last 7 days on free tier)
**Frontend logs:** Vercel dashboard → Functions logs

---

## Cost Breakdown

### Free Tier Limits

**Vercel (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

**Render (Free):**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold starts (slow first request)
- ✅ Automatic HTTPS

**MongoDB Atlas (Free):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Good for development/small apps

### Upgrade Recommendations

For production with real users:
- **Render:** $7/month (no sleep, faster)
- **MongoDB Atlas:** $9/month (more storage, backups)
- **Vercel:** Free tier is usually sufficient

---

## Security Checklist

- [ ] Changed default JWT secrets
- [ ] MongoDB user has strong password
- [ ] CORS configured for specific domains
- [ ] Environment variables not in code
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Database IP whitelist configured
- [ ] No sensitive data in logs

---

## Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can create complaint
- [ ] Can view all pages
- [ ] Filters work
- [ ] Pagination works
- [ ] Mobile responsive

---

## Support

If you encounter issues:

1. Check Render logs (backend)
2. Check Vercel logs (frontend)
3. Check browser console (frontend errors)
4. Verify environment variables
5. Test API endpoints directly

---

**Congratulations! Your app is now live! 🎉**

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.onrender.com
