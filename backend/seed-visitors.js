import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

const visitorNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
  'Anita Desai', 'Rahul Verma', 'Pooja Gupta', 'Sanjay Mehta', 'Kavita Joshi',
  'Arjun Nair', 'Deepika Iyer', 'Karan Malhotra', 'Neha Kapoor', 'Rohan Das',
  'Simran Kaur', 'Aditya Rao', 'Meera Pillai', 'Varun Chopra', 'Ritu Agarwal'
];

const purposes = [
  'Family visit',
  'Project discussion',
  'Delivering items',
  'Personal meeting',
  'Academic consultation',
  'Friend visit',
  'Relative visit',
  'Bringing study materials',
  'Family emergency',
  'Casual visit',
  'Birthday celebration',
  'Bringing home-cooked food',
  'Discussing project work',
  'Returning borrowed items',
  'Social visit'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPhone() {
  return `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

function getRandomDate(daysAgo, range = 30) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo - Math.floor(Math.random() * range));
  return date;
}

async function seedVisitors() {
  try {
    console.log('🔍 Fetching all students...');
    
    // Get all students
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        roomNumber: true
      }
    });
    
    console.log(`👥 Found ${students.length} students`);
    
    if (students.length === 0) {
      console.log('⚠️  No students found in database');
      return;
    }
    
    let totalCreated = 0;
    
    for (const student of students) {
      // Check existing visitors for this student
      const existingVisitors = await prisma.visitor.findMany({
        where: {
          studentId: student.id
        }
      });
      
      const visitorsToCreate = Math.max(0, 2 - existingVisitors.length);
      
      if (visitorsToCreate === 0) {
        console.log(`✓ ${student.name} already has ${existingVisitors.length} visitor records`);
        continue;
      }
      
      console.log(`📝 Creating ${visitorsToCreate} visitor records for ${student.name}...`);
      
      for (let i = 0; i < visitorsToCreate; i++) {
        const entryTime = getRandomDate(0, 30); // Random date within last 30 days
        const hasExited = Math.random() > 0.3; // 70% chance visitor has exited
        const expectedDuration = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        
        let exitTime = null;
        if (hasExited) {
          exitTime = new Date(entryTime);
          exitTime.setHours(exitTime.getHours() + expectedDuration + Math.floor(Math.random() * 2));
        }
        
        const visitorData = {
          visitorName: getRandomElement(visitorNames),
          visitorContact: getRandomPhone(),
          purpose: getRandomElement(purposes),
          studentId: student.id,
          roomNumber: student.roomNumber || 'N/A',
          entryTime,
          exitTime,
          expectedDuration
        };
        
        await prisma.visitor.create({
          data: visitorData
        });
        
        totalCreated++;
      }
    }
    
    console.log(`\n✅ Successfully created ${totalCreated} visitor records`);
    console.log('✨ Seeding complete!');
    
    // Show summary
    const totalVisitors = await prisma.visitor.count();
    const activeVisitors = await prisma.visitor.count({ where: { exitTime: null } });
    const exitedVisitors = await prisma.visitor.count({ where: { exitTime: { not: null } } });
    
    console.log('\n📊 Visitor Records Summary:');
    console.log(`   Total: ${totalVisitors}`);
    console.log(`   Active (not exited): ${activeVisitors}`);
    console.log(`   Exited: ${exitedVisitors}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedVisitors();
