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
const port = 4000;

app.use(cors());
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
