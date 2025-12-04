# HostelEase Backend API

Complete backend API for the Hostel Management System.

## Features

- ✅ User Authentication (Login/Signup with JWT)
- ✅ Room Management
- ✅ Complaint System
- ✅ Visitor Management
- ✅ Leave Applications
- ✅ Mess Menu
- ✅ Announcements

## Tech Stack

- Node.js + Express
- Prisma ORM
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
DATABASE_URL="your_mysql_connection_string"
JWT_SECRET="your_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_secret"
PORT=4000
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Complaints
- `GET /api/complaints` - Get all complaints (filter by studentId, status, category)
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id/status` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint

### Visitors
- `GET /api/visitors` - Get all visitors (filter by studentId)
- `GET /api/visitors/:id` - Get visitor by ID
- `POST /api/visitors` - Register visitor
- `PUT /api/visitors/:id/exit` - Mark visitor exit
- `DELETE /api/visitors/:id` - Delete visitor

### Leave Applications
- `GET /api/leaves` - Get all leaves (filter by studentId, status)
- `GET /api/leaves/:id` - Get leave by ID
- `POST /api/leaves` - Create leave application
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave
- `DELETE /api/leaves/:id` - Delete leave

### Mess Menu
- `GET /api/mess-menu?weekStart=YYYY-MM-DD` - Get menu by week
- `POST /api/mess-menu` - Create/Update menu item
- `DELETE /api/mess-menu/:id` - Delete menu item

### Announcements
- `GET /api/announcements` - Get all announcements (filter by priority)
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

## Database Schema

The database includes the following models:
- User (with roles: ADMIN, WARDEN, STUDENT)
- Room
- Complaint
- Visitor
- Leave
- MessMenu
- Announcement

See `prisma/schema.prisma` for complete schema details.

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Notes

- All API responses follow the format: `{ success: boolean, data?: any, message?: string }`
- Authentication uses JWT tokens
- CORS is enabled for all origins (configure for production)
- Port default is 4000 (configurable via .env)
