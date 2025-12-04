import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

const leaveReasons = [
  'Family emergency',
  'Medical appointment',
  'Attending wedding ceremony',
  'Home visit for festival',
  'Personal work',
  'Attending family function',
  'Medical checkup',
  'Going home for vacation',
  'Attending cousin\'s wedding',
  'Family member is sick',
  'Important family event',
  'Medical treatment',
  'Visiting relatives',
  'Festival celebration at home',
  'Personal emergency'
];

const destinations = [
  'Home Town',
  'City Hospital',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Ahmedabad',
  'Chandigarh',
  'Kochi',
  'Indore'
];

const statuses = ['PENDING', 'APPROVED', 'REJECTED'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysFromNow, range = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * range));
  return date;
}

async function seedLeaveApplications() {
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
      // Check existing leaves for this student
      const existingLeaves = await prisma.leave.findMany({
        where: {
          studentId: student.id
        }
      });
      
      const leavesToCreate = Math.max(0, 2 - existingLeaves.length);
      
      if (leavesToCreate === 0) {
        console.log(`✓ ${student.name} already has ${existingLeaves.length} leave applications`);
        continue;
      }
      
      console.log(`📝 Creating ${leavesToCreate} leave applications for ${student.name}...`);
      
      for (let i = 0; i < leavesToCreate; i++) {
        const startDate = getRandomDate(-30, 60); // Random date within last 30 to next 30 days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days duration
        
        const status = getRandomElement(statuses);
        const isPast = startDate < new Date();
        
        const leaveData = {
          studentId: student.id,
          roomNumber: student.roomNumber || 'N/A',
          startDate,
          endDate,
          reason: getRandomElement(leaveReasons),
          destination: getRandomElement(destinations),
          status: isPast ? (Math.random() > 0.3 ? 'APPROVED' : 'REJECTED') : status,
          approvedBy: (status === 'APPROVED' || status === 'REJECTED') ? 'Warden' : null,
          rejectionReason: status === 'REJECTED' ? 'Not approved due to academic schedule' : null
        };
        
        await prisma.leave.create({
          data: leaveData
        });
        
        totalCreated++;
      }
    }
    
    console.log(`\n✅ Successfully created ${totalCreated} leave applications`);
    console.log('✨ Seeding complete!');
    
    // Show summary
    const totalLeaves = await prisma.leave.count();
    const pendingLeaves = await prisma.leave.count({ where: { status: 'PENDING' } });
    const approvedLeaves = await prisma.leave.count({ where: { status: 'APPROVED' } });
    const rejectedLeaves = await prisma.leave.count({ where: { status: 'REJECTED' } });
    
    console.log('\n📊 Leave Applications Summary:');
    console.log(`   Total: ${totalLeaves}`);
    console.log(`   Pending: ${pendingLeaves}`);
    console.log(`   Approved: ${approvedLeaves}`);
    console.log(`   Rejected: ${rejectedLeaves}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLeaveApplications();
