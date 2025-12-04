import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all visitors with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'entryTime', 
            sortOrder = 'desc',
            studentId,
            roomNumber,
            search,
            hasExited
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        
        const where = {};
        if (studentId) where.studentId = studentId;
        if (roomNumber) where.roomNumber = roomNumber;
        if (hasExited === 'true') where.exitTime = { not: null };
        if (hasExited === 'false') where.exitTime = null;
        if (search) {
            where.OR = [
                { visitorName: { contains: search, mode: 'insensitive' } },
                { visitorContact: { contains: search, mode: 'insensitive' } },
                { purpose: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.visitor.count({ where });
        
        const visitors = await prisma.visitor.findMany({
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
        
        const visitorsWithStudentName = visitors.map(v => ({
            ...v,
            studentName: v.student?.name || 'Unknown Student'
        }));
        
        res.json({ 
            success: true, 
            data: visitorsWithStudentName,
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

// Get visitor by ID
router.get('/:id', async (req, res) => {
    try {
        const visitor = await prisma.visitor.findUnique({
            where: { id: req.params.id },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }
        
        res.json({ success: true, data: { ...visitor, studentName: visitor.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create visitor
router.post('/', async (req, res) => {
    try {
        const { visitorName, visitorContact, purpose, studentId, roomNumber, expectedDuration } = req.body;
        
        if (!visitorName || !visitorContact || !purpose || !studentId || !roomNumber || !expectedDuration) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const visitor = await prisma.visitor.create({
            data: {
                visitorName,
                visitorContact,
                purpose,
                studentId,
                roomNumber,
                expectedDuration: parseInt(expectedDuration)
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.status(201).json({ success: true, data: { ...visitor, studentName: visitor.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Mark visitor exit
router.put('/:id/exit', async (req, res) => {
    try {
        const visitor = await prisma.visitor.update({
            where: { id: req.params.id },
            data: {
                exitTime: new Date()
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.json({ success: true, data: { ...visitor, studentName: visitor.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete visitor
router.delete('/:id', async (req, res) => {
    try {
        await prisma.visitor.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Visitor deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
