import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all fee payments with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            studentId, 
            status,
            feeType,
            semester,
            academicYear,
            search
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        
        const where = {};
        if (studentId) where.studentId = studentId;
        if (status) where.status = status;
        if (feeType) where.feeType = feeType;
        if (semester) where.semester = semester;
        if (academicYear) where.academicYear = academicYear;
        if (search) {
            where.OR = [
                { transactionId: { contains: search, mode: 'insensitive' } },
                { remarks: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.feePayment.count({ where });
        
        const payments = await prisma.feePayment.findMany({
            where,
            skip,
            take,
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            },
            orderBy: { [sortBy]: sortOrder }
        });
        
        const paymentsWithStudentInfo = payments.map(p => ({
            ...p,
            studentName: p.student.name,
            studentEmail: p.student.email,
            roomNumber: p.student.roomNumber
        }));
        
        res.json({ 
            success: true, 
            data: paymentsWithStudentInfo,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get payment statistics
router.get('/stats', async (req, res) => {
    try {
        const { studentId, academicYear } = req.query;
        
        const where = {};
        if (studentId) where.studentId = studentId;
        if (academicYear) where.academicYear = academicYear;

        const [totalPaid, totalPending, totalOverdue, totalAmount, paidAmount] = await Promise.all([
            prisma.feePayment.count({ where: { ...where, status: 'PAID' } }),
            prisma.feePayment.count({ where: { ...where, status: 'PENDING' } }),
            prisma.feePayment.count({ where: { ...where, status: 'OVERDUE' } }),
            prisma.feePayment.aggregate({
                where,
                _sum: { amount: true }
            }),
            prisma.feePayment.aggregate({
                where: { ...where, status: 'PAID' },
                _sum: { amount: true }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalPaid,
                totalPending,
                totalOverdue,
                totalAmount: totalAmount._sum.amount || 0,
                paidAmount: paidAmount._sum.amount || 0,
                pendingAmount: (totalAmount._sum.amount || 0) - (paidAmount._sum.amount || 0)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get fee payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await prisma.feePayment.findUnique({
            where: { id: req.params.id },
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            }
        });
        
        if (!payment) {
            return res.status(404).json({ message: 'Fee payment not found' });
        }
        
        res.json({ 
            success: true, 
            data: { 
                ...payment, 
                studentName: payment.student.name,
                studentEmail: payment.student.email,
                roomNumber: payment.student.roomNumber
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create fee payment
router.post('/', async (req, res) => {
    try {
        const { 
            studentId, 
            feeType, 
            amount, 
            dueDate, 
            semester, 
            academicYear,
            remarks 
        } = req.body;
        
        if (!studentId || !feeType || !amount || !dueDate || !semester || !academicYear) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        
        const payment = await prisma.feePayment.create({
            data: {
                studentId,
                feeType,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                semester,
                academicYear,
                remarks
            },
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            }
        });
        
        res.status(201).json({ 
            success: true, 
            data: { 
                ...payment, 
                studentName: payment.student.name,
                studentEmail: payment.student.email,
                roomNumber: payment.student.roomNumber
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Mark payment as paid
router.put('/:id/pay', async (req, res) => {
    try {
        const { transactionId, paymentMethod, paidDate } = req.body;
        
        if (!transactionId || !paymentMethod) {
            return res.status(400).json({ message: 'Transaction ID and payment method are required' });
        }
        
        const payment = await prisma.feePayment.update({
            where: { id: req.params.id },
            data: {
                status: 'PAID',
                transactionId,
                paymentMethod,
                paidDate: paidDate ? new Date(paidDate) : new Date()
            },
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            }
        });
        
        res.json({ 
            success: true, 
            data: { 
                ...payment, 
                studentName: payment.student.name,
                studentEmail: payment.student.email,
                roomNumber: payment.student.roomNumber
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update payment status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, remarks } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        const updateData = { status };
        if (remarks) updateData.remarks = remarks;
        
        const payment = await prisma.feePayment.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            }
        });
        
        res.json({ 
            success: true, 
            data: { 
                ...payment, 
                studentName: payment.student.name,
                studentEmail: payment.student.email,
                roomNumber: payment.student.roomNumber
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update fee payment
router.put('/:id', async (req, res) => {
    try {
        const { 
            feeType, 
            amount, 
            dueDate, 
            semester, 
            academicYear,
            remarks 
        } = req.body;
        
        const updateData = {};
        if (feeType) updateData.feeType = feeType;
        if (amount) updateData.amount = parseFloat(amount);
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (semester) updateData.semester = semester;
        if (academicYear) updateData.academicYear = academicYear;
        if (remarks !== undefined) updateData.remarks = remarks;
        
        const payment = await prisma.feePayment.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                student: {
                    select: { name: true, email: true, roomNumber: true }
                }
            }
        });
        
        res.json({ 
            success: true, 
            data: { 
                ...payment, 
                studentName: payment.student.name,
                studentEmail: payment.student.email,
                roomNumber: payment.student.roomNumber
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete fee payment
router.delete('/:id', async (req, res) => {
    try {
        await prisma.feePayment.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Fee payment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
