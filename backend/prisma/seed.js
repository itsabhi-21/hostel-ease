import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.announcement.deleteMany();
    await prisma.messMenu.deleteMany();
    await prisma.leave.deleteMany();
    await prisma.visitor.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@hostelease.com',
            password: hashedPassword,
            role: 'ADMIN',
            roomNumber: null,
        },
    });

    const warden = await prisma.user.create({
        data: {
            name: 'Warden Singh',
            email: 'warden@hostelease.com',
            password: hashedPassword,
            role: 'WARDEN',
            roomNumber: null,
        },
    });

    const students = [];
    for (let i = 1; i <= 15; i++) {
        const student = await prisma.user.create({
            data: {
                name: `Student ${i}`,
                email: `student${i}@hostelease.com`,
                password: hashedPassword,
                role: 'STUDENT',
                roomNumber: `R${100 + i}`,
            },
        });
        students.push(student);
    }
    console.log(`✅ Created ${students.length + 2} users (1 admin, 1 warden, ${students.length} students)\n`);

    // Create Rooms
    console.log('🏠 Creating rooms...');
    const rooms = [];
    const statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'];
    
    for (let floor = 1; floor <= 5; floor++) {
        for (let room = 1; room <= 10; room++) {
            const roomNumber = `R${floor}${room.toString().padStart(2, '0')}`;
            const capacity = Math.random() > 0.5 ? 4 : 2;
            const currentOccupancy = Math.floor(Math.random() * (capacity + 1));
            const status = currentOccupancy === 0 ? 'AVAILABLE' : 
                          currentOccupancy === capacity ? 'OCCUPIED' : 
                          Math.random() > 0.9 ? 'MAINTENANCE' : 'OCCUPIED';
            
            const createdRoom = await prisma.room.create({
                data: {
                    roomNumber,
                    floor,
                    capacity,
                    currentOccupancy,
                    status,
                },
            });
            rooms.push(createdRoom);
        }
    }
    console.log(`✅ Created ${rooms.length} rooms\n`);

    // Create Complaints
    console.log('📝 Creating complaints...');
    const complaintCategories = ['MAINTENANCE', 'CLEANLINESS', 'FOOD', 'SECURITY', 'OTHER'];
    const complaintStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
    const complaintTitles = {
        MAINTENANCE: ['Broken AC', 'Leaking Tap', 'Door Lock Issue', 'Window Broken', 'Fan Not Working'],
        CLEANLINESS: ['Dirty Bathroom', 'Garbage Not Collected', 'Pest Problem', 'Floor Needs Cleaning'],
        FOOD: ['Food Quality Poor', 'Insufficient Quantity', 'Cold Food Served', 'Menu Repetitive'],
        SECURITY: ['Gate Lock Broken', 'CCTV Not Working', 'Unauthorized Entry', 'Lost Key'],
        OTHER: ['Noise Complaint', 'Internet Issue', 'Power Outage', 'Water Supply Problem'],
    };

    const complaints = [];
    for (let i = 0; i < 30; i++) {
        const category = complaintCategories[Math.floor(Math.random() * complaintCategories.length)];
        const titles = complaintTitles[category];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const student = students[Math.floor(Math.random() * students.length)];
        const status = complaintStatuses[Math.floor(Math.random() * complaintStatuses.length)];
        
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description: `Detailed description of ${title.toLowerCase()} in room ${student.roomNumber}`,
                category,
                status,
                studentId: student.id,
                roomNumber: student.roomNumber,
                resolutionNotes: status === 'RESOLVED' ? 'Issue has been fixed' : null,
                resolvedBy: status === 'RESOLVED' ? warden.name : null,
            },
        });
        complaints.push(complaint);
    }
    console.log(`✅ Created ${complaints.length} complaints\n`);

    // Create Visitors
    console.log('👥 Creating visitors...');
    const visitorNames = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown', 
                          'Sarah Wilson', 'David Lee', 'Lisa Anderson', 'James Taylor', 'Mary Martinez'];
    const purposes = ['Family Visit', 'Friend Visit', 'Delivery', 'Maintenance', 'Official Work'];
    
    const visitors = [];
    for (let i = 0; i < 25; i++) {
        const student = students[Math.floor(Math.random() * students.length)];
        const hasExited = Math.random() > 0.3;
        const entryTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        const visitor = await prisma.visitor.create({
            data: {
                visitorName: visitorNames[Math.floor(Math.random() * visitorNames.length)],
                visitorContact: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                purpose: purposes[Math.floor(Math.random() * purposes.length)],
                studentId: student.id,
                roomNumber: student.roomNumber,
                entryTime,
                exitTime: hasExited ? new Date(entryTime.getTime() + Math.random() * 4 * 60 * 60 * 1000) : null,
                expectedDuration: Math.floor(Math.random() * 180) + 30,
            },
        });
        visitors.push(visitor);
    }
    console.log(`✅ Created ${visitors.length} visitors\n`);

    // Create Leaves
    console.log('🏖️  Creating leave applications...');
    const leaveStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    const reasons = ['Family Emergency', 'Medical Appointment', 'Wedding', 'Festival', 'Personal Work'];
    const destinations = ['Home', 'Hospital', 'Hometown', 'Relatives Place', 'City'];
    
    const leaves = [];
    for (let i = 0; i < 20; i++) {
        const student = students[Math.floor(Math.random() * students.length)];
        const status = leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];
        const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
        
        const leave = await prisma.leave.create({
            data: {
                studentId: student.id,
                roomNumber: student.roomNumber,
                startDate,
                endDate,
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                destination: destinations[Math.floor(Math.random() * destinations.length)],
                status,
                approvedBy: status !== 'PENDING' ? warden.name : null,
                rejectionReason: status === 'REJECTED' ? 'Insufficient reason provided' : null,
            },
        });
        leaves.push(leave);
    }
    console.log(`✅ Created ${leaves.length} leave applications\n`);

    // Create Mess Menu
    console.log('🍽️  Creating mess menu...');
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const mealTypes = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'];
    const menuItems = {
        BREAKFAST: [
            ['Idli', 'Sambar', 'Chutney', 'Tea'],
            ['Poha', 'Jalebi', 'Tea'],
            ['Paratha', 'Curd', 'Pickle', 'Tea'],
            ['Upma', 'Chutney', 'Tea'],
            ['Dosa', 'Sambar', 'Chutney', 'Coffee'],
        ],
        LUNCH: [
            ['Rice', 'Dal', 'Roti', 'Sabzi', 'Salad'],
            ['Rice', 'Rajma', 'Roti', 'Aloo Gobi', 'Curd'],
            ['Rice', 'Sambar', 'Roti', 'Paneer Curry', 'Papad'],
            ['Biryani', 'Raita', 'Salad'],
            ['Rice', 'Chole', 'Roti', 'Mix Veg', 'Pickle'],
        ],
        SNACKS: [
            ['Samosa', 'Chutney', 'Tea'],
            ['Pakora', 'Sauce', 'Tea'],
            ['Bread Pakora', 'Chutney', 'Tea'],
            ['Vada Pav', 'Chutney', 'Tea'],
            ['Sandwich', 'Chips', 'Tea'],
        ],
        DINNER: [
            ['Rice', 'Dal', 'Roti', 'Sabzi', 'Sweet'],
            ['Rice', 'Kadhi', 'Roti', 'Aloo Fry', 'Papad'],
            ['Rice', 'Dal Fry', 'Roti', 'Paneer Masala', 'Salad'],
            ['Pulao', 'Raita', 'Papad', 'Sweet'],
            ['Rice', 'Rajma', 'Roti', 'Cabbage Sabzi', 'Pickle'],
        ],
    };

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Start from Monday

    const messMenus = [];
    for (const day of days) {
        for (const mealType of mealTypes) {
            const items = menuItems[mealType][Math.floor(Math.random() * menuItems[mealType].length)];
            const menu = await prisma.messMenu.create({
                data: {
                    day,
                    mealType,
                    items: JSON.stringify(items),
                    weekStart,
                },
            });
            messMenus.push(menu);
        }
    }
    console.log(`✅ Created ${messMenus.length} mess menu items\n`);

    // Create Announcements
    console.log('📢 Creating announcements...');
    const priorities = ['NORMAL', 'IMPORTANT', 'URGENT'];
    const announcementData = [
        { title: 'Hostel Maintenance', content: 'Hostel will undergo maintenance on Sunday. Water supply will be affected.', priority: 'IMPORTANT' },
        { title: 'Mess Timing Change', content: 'Dinner timing changed to 8:00 PM from tomorrow.', priority: 'NORMAL' },
        { title: 'Security Alert', content: 'Please ensure all doors are locked. Report any suspicious activity.', priority: 'URGENT' },
        { title: 'Festival Celebration', content: 'Diwali celebration on Friday evening in the common room.', priority: 'NORMAL' },
        { title: 'Room Inspection', content: 'Room inspection will be conducted next week. Keep rooms clean.', priority: 'IMPORTANT' },
        { title: 'Internet Upgrade', content: 'WiFi speed will be upgraded this weekend. Service may be interrupted.', priority: 'NORMAL' },
        { title: 'Guest Policy Update', content: 'New guest policy: All visitors must register at reception.', priority: 'IMPORTANT' },
        { title: 'Power Outage', content: 'Scheduled power outage tomorrow 2-4 PM for electrical work.', priority: 'URGENT' },
    ];

    const announcements = [];
    for (const data of announcementData) {
        const announcement = await prisma.announcement.create({
            data: {
                ...data,
                createdBy: Math.random() > 0.5 ? admin.id : warden.id,
                createdByName: Math.random() > 0.5 ? admin.name : warden.name,
            },
        });
        announcements.push(announcement);
    }
    console.log(`✅ Created ${announcements.length} announcements\n`);

    // Summary
    console.log('═══════════════════════════════════');
    console.log('✅ DATABASE SEEDING COMPLETED!');
    console.log('═══════════════════════════════════');
    console.log(`👥 Users: ${students.length + 2}`);
    console.log(`   - Admin: 1 (admin@hostelease.com)`);
    console.log(`   - Warden: 1 (warden@hostelease.com)`);
    console.log(`   - Students: ${students.length} (student1@hostelease.com - student${students.length}@hostelease.com)`);
    console.log(`   - Password for all: password123`);
    console.log(`🏠 Rooms: ${rooms.length}`);
    console.log(`📝 Complaints: ${complaints.length}`);
    console.log(`👥 Visitors: ${visitors.length}`);
    console.log(`🏖️  Leaves: ${leaves.length}`);
    console.log(`🍽️  Mess Menu: ${messMenus.length}`);
    console.log(`📢 Announcements: ${announcements.length}`);
    console.log('═══════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
