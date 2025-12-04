import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all leaves with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            studentId, 
            status,
            roomNumber,
            search
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        
        const where = {};
        if (studentId) where.studentId = studentId;
        if (status) where.status = status;
        if (roomNumber) where.roomNumber = roomNumber;
        if (search) {
            where.OR = [
                { reason: { contains: search, mode: 'insensitive' } },
                { destination: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.leave.count({ where });
        
        const leaves = await prisma.leave.findMany({
            where,
            skip,
            take,
            include: {
                student: {
                    select: { name: true }
                }
            },
            orderBy: { [sortBy]: sortOrder }
        });
        
        const leavesWithStudentName = leaves.map(l => ({
            ...l,
            studentName: l.student.name
        }));
        
        res.json({ 
            success: true, 
            data: leavesWithStudentName,
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

// Get leave by ID
router.get('/:id', async (req, res) => {
    try {
        const leave = await prisma.leave.findUnique({
            where: { id: req.params.id },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }
        
        res.json({ success: true, data: { ...leave, studentName: leave.student.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create leave
router.post('/', async (req, res) => {
    try {
        const { studentId, roomNumber, startDate, endDate, reason, destination } = req.body;
        
        if (!studentId || !roomNumber || !startDate || !endDate || !reason || !destination) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const leave = await prisma.leave.create({
            data: {
                studentId,
                roomNumber,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                destination
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.status(201).json({ success: true, data: { ...leave, studentName: leave.student.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Approve leave
router.put('/:id/approve', async (req, res) => {
    try {
        const { approvedBy } = req.body;
        
        const leave = await prisma.leave.update({
            where: { id: req.params.id },
            data: {
                status: 'APPROVED',
                approvedBy
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.json({ success: true, data: { ...leave, studentName: leave.student.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject leave
router.put('/:id/reject', async (req, res) => {
    try {
        const { rejectionReason, approvedBy } = req.body;
        
        const leave = await prisma.leave.update({
            where: { id: req.params.id },
            data: {
                status: 'REJECTED',
                rejectionReason,
                approvedBy
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.json({ success: true, data: { ...leave, studentName: leave.student.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete leave
router.delete('/:id', async (req, res) => {
    try {
        await prisma.leave.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Leave deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
