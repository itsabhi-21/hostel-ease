# 🚀 HostelEase Startup Guide

## ⚠️ IMPORTANT: Always Start Backend First!

The most common issue is **forgetting to start the backend server**. Without it, the frontend cannot load any data.

## ✅ Correct Startup Procedure

### Option 1: One Command (Recommended)
```bash
npm run dev
```
This starts both servers automatically.

### Option 2: Manual Start (Two Terminals)

**Step 1 - Start Backend (MUST DO FIRST):**
```bash
cd backend
npm start
```
Wait for: `✅ Server running on port 4000`

**Step 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

### Option 3: Shell Script
```bash
./start-dev.sh
```

## 🔍 How to Verify Everything is Working

### 1. Check Backend is Running
```bash
curl http://localhost:4000
```
Should return: `HostelEase Backend Server is Running`

### 2. Check API is Working
```bash
curl http://localhost:4000/api/complaints
```
Should return JSON data with complaints.

### 3. Check Frontend is Running
Open browser: http://localhost:3000

## 🐛 Common Problems & Solutions

### Problem 1: "Cannot load complaints" or blank dashboard

**Cause:** Backend is not running

**Solution:**
```bash
# Check if backend is running
lsof -ti:4000

# If nothing shows, start backend
cd backend
npm start
```

### Problem 2: "Network Error" on all pages

**Cause:** Frontend can't reach backend

**Solution:**
1. Verify backend is on port 4000: `curl http://localhost:4000`
2. Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:4000`
3. Restart both servers

### Problem 3: Dashboard shows all zeros

**Cause:** Backend is running but database is empty

**Solution:**
```bash
cd backend
node seed-fee-payments.js
# Run other seed scripts as needed
```

### Problem 4: "Prisma Client not found"

**Solution:**
```bash
cd backend
npx prisma generate
```

## 📋 Pre-Flight Checklist

Before starting development, ensure:

- [ ] MongoDB is running (local or Atlas connection works)
- [ ] `.env` files are configured in both backend and frontend
- [ ] Dependencies are installed (`npm run install:all`)
- [ ] Prisma client is generated (`cd backend && npx prisma generate`)
- [ ] Backend starts successfully on port 4000
- [ ] Frontend starts successfully on port 3000

## 🎯 Quick Test

After starting both servers:

1. Open http://localhost:3000
2. Login with test credentials
3. Navigate to Dashboard
4. You should see:
   - Complaint counts
   - Leave counts
   - Announcements
   - Fee payment counts

If you see zeros or errors, backend is not running or database is empty.

## 💡 Pro Tips

1. **Always check backend logs** - They show API errors
2. **Use browser console** - Shows frontend errors
3. **Keep both terminals visible** - Easy to spot issues
4. **Use `npm run dev`** - Easiest way to start everything

## 🔄 Restart Procedure

If something breaks:

1. Stop both servers (Ctrl+C)
2. Start backend first
3. Wait for "Server running" message
4. Start frontend
5. Refresh browser

## 📞 Still Having Issues?

1. Check both terminal outputs for errors
2. Check browser console (F12) for errors
3. Verify MongoDB connection
4. Try restarting both servers
5. Check the main [README.md](README.md)

---

**Remember: Backend (4000) MUST be running before Frontend (3000) can work! 🎯**
