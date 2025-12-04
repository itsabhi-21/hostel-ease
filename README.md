# 🏨 HostelEase - Hostel Management System

A comprehensive hostel management system built with Next.js and Express.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd HostelEase
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

**Backend** (`backend/.env`):
```env
DATABASE_URL="your-mongodb-connection-string"
JWT_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret-key"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. **Generate Prisma Client**
```bash
cd backend
npx prisma generate
```

5. **Start development servers**

**Option A: Start both servers with one command (Recommended)**
```bash
npm run dev
```

**Option B: Start servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option C: Use the shell script**
```bash
./start-dev.sh
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📦 Project Structure

```
HostelEase/
├── backend/                 # Express.js backend
│   ├── routes/             # API routes
│   ├── prisma/             # Database schema
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   ├── hooks/         # Custom hooks
│   │   └── constants/     # Constants & configs
│   └── public/            # Static assets
│
└── package.json           # Root package.json for scripts
```

## ✨ Features

### Core Modules
- 🏠 **Room Management** - Manage hostel rooms and assignments
- 📝 **Complaints** - Submit and track maintenance complaints
- 👥 **Visitor Management** - Register and track visitors
- 📅 **Leave Applications** - Apply for and manage leave requests
- 💳 **Fee Payments** - Track and manage fee payments
- 🍽️ **Mess Menu** - View weekly mess menu
- 📢 **Announcements** - Important hostel announcements
- 👤 **User Profiles** - Manage user information

### User Roles
- **Student** - View and manage personal data
- **Warden** - Manage hostel operations
- **Admin** - Full system access

### Technical Features
- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Real-time data updates
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ Form validation

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run install:all` - Install all dependencies

**Backend:**
- `npm start` - Start backend server
- `npx prisma generate` - Generate Prisma client
- `node seed-*.js` - Run seed scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Seeding Sample Data

```bash
cd backend

# Seed complaints
node seed-complaints.js

# Seed visitors
node seed-visitors.js

# Seed leave applications
node seed-leave-applications.js

# Seed fee payments
node seed-fee-payments.js
```

## 🔧 Troubleshooting

### Issue: "Cannot load complaints/data"

**Cause:** Backend server is not running

**Solution:** Make sure both servers are running:
```bash
# Check if backend is running
curl http://localhost:4000

# If not, start it
cd backend
npm start
```

### Issue: "Network Error" or "Failed to fetch"

**Cause:** Frontend can't connect to backend

**Solution:** 
1. Verify backend is running on port 4000
2. Check `frontend/.env.local` has correct API URL
3. Restart both servers

### Issue: "Prisma Client not found"

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue: "Module not found"

**Solution:**
```bash
# Reinstall all dependencies
npm run install:all
```

## 📚 Documentation

- [Fee Payments System](README_FEE_PAYMENTS.md)
- [API Documentation](backend/API_DOCUMENTATION.md)
- [Quick Start Guide](backend/QUICK_START.md)

## 🔐 Default Credentials

After seeding, you can use these credentials:

**Admin:**
- Email: admin@hostelease.com
- Password: admin123

**Warden:**
- Email: warden@hostelease.com
- Password: warden123

**Student:**
- Email: student1@hostelease.com
- Password: student123

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Run `npx prisma generate`
3. Deploy to Heroku, Railway, or AWS

### Frontend Deployment
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy to Vercel, Netlify, or any Node.js hosting

## 📝 Important Notes

### Always Start Both Servers

⚠️ **The application requires BOTH servers to be running:**

1. **Backend (Port 4000)** - Handles all data and API requests
2. **Frontend (Port 3000)** - Serves the user interface

If you only start the frontend, you'll see errors when trying to load data.

### Recommended Workflow

1. Open project in your IDE
2. Run `npm run dev` in the root directory
3. Wait for both servers to start
4. Open http://localhost:3000 in your browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All contributors

---

**Need Help?** Check the troubleshooting section or open an issue.

**Happy Coding! 🎉**
