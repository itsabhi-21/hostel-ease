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

// CORS configuration for production
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://hostel-ease-phi.vercel.app',
        'https://hostel-ease.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
