import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function cleanupOrphanedVisitors() {
  try {
    console.log('🔍 Checking for orphaned visitors...');
    
    // Get all visitors
    const allVisitors = await prisma.visitor.findMany({
      select: {
        id: true,
        studentId: true,
        visitorName: true
      }
    });
    
    console.log(`📊 Found ${allVisitors.length} total visitors`);
    
    // Get all user IDs
    const allUsers = await prisma.user.findMany({
      select: {
        id: true
      }
    });
    
    const userIds = new Set(allUsers.map(u => u.id));
    console.log(`👥 Found ${userIds.size} users`);
    
    // Find orphaned visitors
    const orphanedVisitors = allVisitors.filter(v => !userIds.has(v.studentId));
    
    if (orphanedVisitors.length === 0) {
      console.log('✅ No orphaned visitors found!');
      return;
    }
    
    console.log(`⚠️  Found ${orphanedVisitors.length} orphaned visitors:`);
    orphanedVisitors.forEach(v => {
      console.log(`   - ${v.visitorName} (ID: ${v.id}, StudentID: ${v.studentId})`);
    });
    
    // Delete orphaned visitors
    console.log('\n🗑️  Deleting orphaned visitors...');
    const deleteResult = await prisma.visitor.deleteMany({
      where: {
        id: {
          in: orphanedVisitors.map(v => v.id)
        }
      }
    });
    
    console.log(`✅ Deleted ${deleteResult.count} orphaned visitors`);
    console.log('✨ Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedVisitors();
