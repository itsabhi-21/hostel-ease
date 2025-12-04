import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all rooms with pagination, filtering, sorting, and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'roomNumber', 
            sortOrder = 'asc',
            status,
            floor,
            search,
            minCapacity,
            maxCapacity
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = {};
        if (status) where.status = status;
        if (floor) where.floor = parseInt(floor);
        if (minCapacity) where.capacity = { ...where.capacity, gte: parseInt(minCapacity) };
        if (maxCapacity) where.capacity = { ...where.capacity, lte: parseInt(maxCapacity) };
        if (search) {
            where.roomNumber = { contains: search, mode: 'insensitive' };
        }

        // Get total count
        const total = await prisma.room.count({ where });

        // Get rooms
        const rooms = await prisma.room.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder }
        });

        res.json({ 
            success: true, 
            data: rooms,
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

// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const room = await prisma.room.findUnique({
            where: { id: req.params.id }
        });
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.json({ success: true, data: room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create room
router.post('/', async (req, res) => {
    try {
        const { roomNumber, floor, capacity, status } = req.body;
        
        if (!roomNumber || !floor || !capacity) {
            return res.status(400).json({ message: 'Room number, floor, and capacity are required' });
        }
        
        const room = await prisma.room.create({
            data: {
                roomNumber,
                floor: parseInt(floor),
                capacity: parseInt(capacity),
                status: status || 'AVAILABLE'
            }
        });
        
        res.status(201).json({ success: true, data: room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update room
router.put('/:id', async (req, res) => {
    try {
        const { roomNumber, floor, capacity, status, currentOccupancy } = req.body;
        
        const room = await prisma.room.update({
            where: { id: req.params.id },
            data: {
                ...(roomNumber && { roomNumber }),
                ...(floor && { floor: parseInt(floor) }),
                ...(capacity && { capacity: parseInt(capacity) }),
                ...(status && { status }),
                ...(currentOccupancy !== undefined && { currentOccupancy: parseInt(currentOccupancy) })
            }
        });
        
        res.json({ success: true, data: room });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete room
router.delete('/:id', async (req, res) => {
    try {
        await prisma.room.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Room deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
