import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function cleanupOrphanedComplaints() {
  try {
    console.log('🔍 Checking for orphaned complaints...');
    
    // Get all complaints
    const allComplaints = await prisma.complaint.findMany({
      select: {
        id: true,
        studentId: true,
        title: true
      }
    });
    
    console.log(`📊 Found ${allComplaints.length} total complaints`);
    
    // Get all user IDs
    const allUsers = await prisma.user.findMany({
      select: {
        id: true
      }
    });
    
    const userIds = new Set(allUsers.map(u => u.id));
    console.log(`👥 Found ${userIds.size} users`);
    
    // Find orphaned complaints
    const orphanedComplaints = allComplaints.filter(c => !userIds.has(c.studentId));
    
    if (orphanedComplaints.length === 0) {
      console.log('✅ No orphaned complaints found!');
      return;
    }
    
    console.log(`⚠️  Found ${orphanedComplaints.length} orphaned complaints:`);
    orphanedComplaints.forEach(c => {
      console.log(`   - ${c.title} (ID: ${c.id}, StudentID: ${c.studentId})`);
    });
    
    // Delete orphaned complaints
    console.log('\n🗑️  Deleting orphaned complaints...');
    const deleteResult = await prisma.complaint.deleteMany({
      where: {
        id: {
          in: orphanedComplaints.map(c => c.id)
        }
      }
    });
    
    console.log(`✅ Deleted ${deleteResult.count} orphaned complaints`);
    console.log('✨ Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedComplaints();
