import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get menu by week
router.get('/', async (req, res) => {
    try {
        const { weekStart } = req.query;
        
        if (!weekStart) {
            return res.status(400).json({ message: 'weekStart parameter is required' });
        }
        
        const menu = await prisma.messMenu.findMany({
            where: {
                weekStart: new Date(weekStart)
            },
            orderBy: [
                { day: 'asc' },
                { mealType: 'asc' }
            ]
        });
        
        // Parse items from JSON string
        const menuWithParsedItems = menu.map(m => ({
            ...m,
            items: JSON.parse(m.items)
        }));
        
        res.json({ success: true, data: menuWithParsedItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update menu item
router.post('/', async (req, res) => {
    try {
        const { day, mealType, items, weekStart } = req.body;
        
        if (!day || !mealType || !items || !weekStart) {
            return res.status(400).json({ message: 'Day, mealType, items, and weekStart are required' });
        }
        
        const menu = await prisma.messMenu.upsert({
            where: {
                day_mealType_weekStart: {
                    day,
                    mealType,
                    weekStart: new Date(weekStart)
                }
            },
            update: {
                items: JSON.stringify(items)
            },
            create: {
                day,
                mealType,
                items: JSON.stringify(items),
                weekStart: new Date(weekStart)
            }
        });
        
        res.status(201).json({ 
            success: true, 
            data: { ...menu, items: JSON.parse(menu.items) } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
    try {
        await prisma.messMenu.delete({
            where: { id: req.params.id }
        });
        
        res.json({ success: true, message: 'Menu item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
