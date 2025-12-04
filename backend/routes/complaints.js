import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all complaints with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            studentId, 
            status, 
            category,
            search,
            roomNumber
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        
        const where = {};
        if (studentId) where.studentId = studentId;
        if (status) where.status = status;
        if (category) where.category = category;
        if (roomNumber) where.roomNumber = roomNumber;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.complaint.count({ where });
        
        const complaints = await prisma.complaint.findMany({
            where,
            skip,
            take,
            include: {
                student: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { [sortBy]: sortOrder }
        });
        
        const complaintsWithStudentName = complaints.map(c => ({
            ...c,
            studentName: c.student?.name || 'Unknown Student'
        }));
        
        res.json({ 
            success: true, 
            data: complaintsWithStudentName,
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

// Get complaint by ID
router.get('/:id', async (req, res) => {
    try {
        const complaint = await prisma.complaint.findUnique({
            where: { id: req.params.id },
            include: {
                student: {
                    select: { name: true, email: true }
                }
            }
        });
        
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        res.json({ success: true, data: { ...complaint, studentName: complaint.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create complaint
router.post('/', async (req, res) => {
    try {
        const { title, description, category, studentId, roomNumber } = req.body;
        
        if (!title || !description || !category || !studentId || !roomNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                category,
                studentId,
                roomNumber
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.status(201).json({ success: true, data: { ...complaint, studentName: complaint.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update complaint status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, resolutionNotes, resolvedBy } = req.body;
        
        const complaint = await prisma.complaint.update({
            where: { id: req.params.id },
            data: {
                status,
                ...(resolutionNotes && { resolutionNotes }),
                ...(resolvedBy && { resolvedBy })
            },
            include: {
                student: {
                    select: { name: true }
                }
            }
        });
        
        res.json({ success: true, data: { ...complaint, studentName: complaint.student?.name || 'Unknown Student' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete complaint
router.delete('/:id', async (req, res) => {
    try {
        await prisma.complaint.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Complaint deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
