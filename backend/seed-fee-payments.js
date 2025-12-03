import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function seedFeePayments() {
  try {
    console.log('🌱 Starting fee payments seeding...');

    // Get all students
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' }
    });

    if (students.length === 0) {
      console.log('⚠️  No students found. Please seed users first.');
      return;
    }

    console.log(`📚 Found ${students.length} students`);

    const feeTypes = ['HOSTEL_FEE', 'MESS_FEE', 'MAINTENANCE_FEE', 'SECURITY_DEPOSIT'];
    const semesters = ['Spring', 'Fall'];
    const academicYear = '2024';
    const statuses = ['PENDING', 'PAID', 'OVERDUE'];

    const feePayments = [];

    for (const student of students) {
      // Create 3-5 fee payments per student
      const numPayments = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numPayments; i++) {
        const feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
        const semester = semesters[Math.floor(Math.random() * semesters.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Generate amount based on fee type
        let amount;
        switch (feeType) {
          case 'HOSTEL_FEE':
            amount = 5000 + Math.floor(Math.random() * 3000);
            break;
          case 'MESS_FEE':
            amount = 3000 + Math.floor(Math.random() * 2000);
            break;
          case 'MAINTENANCE_FEE':
            amount = 1000 + Math.floor(Math.random() * 1000);
            break;
          case 'SECURITY_DEPOSIT':
            amount = 10000;
            break;
          default:
            amount = 2000;
        }

        // Generate dates
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30);

        const paymentData = {
          studentId: student.id,
          feeType,
          amount,
          dueDate,
          semester,
          academicYear,
          status,
          remarks: Math.random() > 0.7 ? `Payment for ${semester} ${academicYear}` : null,
        };

        // If paid, add payment details
        if (status === 'PAID') {
          paymentData.paidDate = new Date(dueDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000);
          paymentData.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
          paymentData.paymentMethod = ['UPI', 'CARD', 'NET_BANKING', 'CASH'][Math.floor(Math.random() * 4)];
        }

        feePayments.push(paymentData);
      }
    }

    // Create all fee payments
    console.log(`💰 Creating ${feePayments.length} fee payments...`);
    
    for (const payment of feePayments) {
      await prisma.feePayment.create({
        data: payment
      });
    }

    console.log('✅ Fee payments seeded successfully!');
    console.log(`📊 Created ${feePayments.length} fee payments`);

    // Show statistics
    const stats = await prisma.feePayment.groupBy({
      by: ['status'],
      _count: true
    });

    console.log('\n📈 Payment Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count}`);
    });

  } catch (error) {
    console.error('❌ Error seeding fee payments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFeePayments();
