import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all announcements with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            priority,
            search
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        
        const where = {};
        if (priority) where.priority = priority;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        const total = await prisma.announcement.count({ where });
        
        const announcements = await prisma.announcement.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder }
        });
        
        res.json({ 
            success: true, 
            data: announcements,
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

// Get announcement by ID
router.get('/:id', async (req, res) => {
    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: req.params.id }
        });
        
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        
        res.json({ success: true, data: announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create announcement
router.post('/', async (req, res) => {
    try {
        const { title, content, priority, createdBy, createdByName } = req.body;
        
        if (!title || !content || !createdBy || !createdByName) {
            return res.status(400).json({ message: 'Title, content, createdBy, and createdByName are required' });
        }
        
        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                priority: priority || 'NORMAL',
                createdBy,
                createdByName
            }
        });
        
        res.status(201).json({ success: true, data: announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update announcement
router.put('/:id', async (req, res) => {
    try {
        const { title, content, priority } = req.body;
        
        const announcement = await prisma.announcement.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(priority && { priority })
            }
        });
        
        res.json({ success: true, data: announcement });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        await prisma.announcement.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Announcement deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
