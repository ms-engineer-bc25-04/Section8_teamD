// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ユーザー追加
  await prisma.user.create({
    data: {
      id: 'user_001',
      name: 'あおぞら 太郎',
      accountNumber: '111122223333',
      beneficiaryBranchCode: 101
    }
  });

  // プロジェクト追加
  await prisma.project.createMany({
    data: [
      {
        id: 'project_001',
        name: '市民プールの修繕',
        goal_amount: 300000,
        deadline: new Date('2025-07-01T23:59:59'),
        current_amount: 120000,
        accountNumber: '222233334444',
        description: '老朽化した市民プールの補修工事',
        beneficiaryBranchCode: 201
      },
      {
        id: 'project_002',
        name: '駅前の花壇整備',
        goal_amount: 200000,
        deadline: new Date('2025-07-10T23:59:59'),
        current_amount: 180000,
        accountNumber: '222233334445',
        description: '駅前の花壇を新しく整備します',
        beneficiaryBranchCode: 202
      }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
