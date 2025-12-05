import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import complaintRoutes from './routes/complaints.js';
import visitorRoutes from './routes/visitors.js';
import leaveRoutes from './routes/leaves.js';
import messMenuRoutes from './routes/messMenu.js';
import announcementRoutes from './routes/announcements.js';
import feePaymentRoutes from './routes/feePayments.js';

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:5000',
    process.env.FRONTEND_URL, // Dynamic frontend URL from environment variable
    'https://hostel-ease-phi.vercel.app', // Keep existing as fallback
    'https://hostel-ease.onrender.com' // Keep existing as fallback
].filter(Boolean); // Remove undefined/null values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('HostelEase Backend Server is Running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/mess-menu', messMenuRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/fee-payments', feePaymentRoutes);

app.listen(port, (err) => {
    if (!err) {
        console.log(`✅ Server running on port ${port}`);
        console.log(`📍 API available at http://localhost:${port}`);
    }
});
