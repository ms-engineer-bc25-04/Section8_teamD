const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ユーザー追加
  await prisma.user.createMany({
    data: [
      {
      id: process.env.USER_001_ID,
      name: process.env.USER_001_NAME,
      accountNumber: process.env.USER_001_ACCOUNTNUMBER,
      beneficiaryBranchCode: Number(process.env.USER_001_BENEFICIARYBRANCHCODE),
      access_token: process.env.USER_001_ACCESS_TOKEN
      },
      {
        id: process.env.USER_002_ID,
        name: process.env.USER_002_NAME,
        accountNumber: process.env.USER_002_ACCOUNTNUMBER,
        beneficiaryBranchCode: Number(process.env.USER_002_BENEFICIARYBRANCHCODE),
        access_token: process.env.USER_002_ACCESS_TOKEN
      },
      {
        id: process.env.USER_003_ID,
        name: process.env.USER_003_NAME,
        accountNumber: process.env.USER_003_ACCOUNTNUMBER,
        beneficiaryBranchCode: Number(process.env.USER_003_BENEFICIARYBRANCHCODE),
        access_token: process.env.USER_003_ACCESS_TOKEN
      }
    ]
  });

  // プロジェクト追加
  await prisma.project.createMany({
    data: [
      {
        id: process.env.PROJECT_001_ID,
        name: process.env.PROJECT_001_NAME,
        name_kana: process.env.PROJECT_001_NAME_KANA,
        goal_amount: Number(process.env.PROJECT_001_GOAL_AMOUNT),
        current_amount: Number(process.env.PROJECT_001_CURRENT_AMOUNT),
        deadline: new Date(process.env.PROJECT_001_DEADLINE),
        description: process.env.PROJECT_001_DESCRIPTION,
        beneficiaryBranchCode: Number(process.env.PROJECT_001_BENEFICIARYBRANCHCODE),
        bank_code: Number(process.env.PROJECT_001_BANK_CODE),
        accountNumber: process.env.PROJECT_001_ACCOUNTNUMBER,
        access_token: process.env.PROJECT_001_ACCESS_TOKEN
      },
      {
        id: process.env.PROJECT_002_ID,
        name: process.env.PROJECT_002_NAME,
        name_kana: process.env.PROJECT_002_NAME_KANA,
        goal_amount: Number(process.env.PROJECT_002_GOAL_AMOUNT),
        current_amount: Number(process.env.PROJECT_002_CURRENT_AMOUNT),
        deadline: new Date(process.env.PROJECT_002_DEADLINE),
        description: process.env.PROJECT_002_DESCRIPTION,
        beneficiaryBranchCode: Number(process.env.PROJECT_002_BENEFICIARYBRANCHCODE),
        bank_code: Number(process.env.PROJECT_002_BANK_CODE),
        accountNumber: process.env.PROJECT_002_ACCOUNTNUMBER,
        access_token: process.env.PROJECT_002_ACCESS_TOKEN
      },
      {
        id: process.env.PROJECT_003_ID,
        name: process.env.PROJECT_003_NAME,
        name_kana: process.env.PROJECT_003_NAME_KANA,
        goal_amount: Number(process.env.PROJECT_003_GOAL_AMOUNT),
        current_amount: Number(process.env.PROJECT_003_CURRENT_AMOUNT),
        deadline: new Date(process.env.PROJECT_003_DEADLINE),
        description: process.env.PROJECT_003_DESCRIPTION,
        beneficiaryBranchCode: Number(process.env.PROJECT_003_BENEFICIARYBRANCHCODE),
        bank_code: Number(process.env.PROJECT_003_BANK_CODE),
        accountNumber: process.env.PROJECT_003_ACCOUNTNUMBER,
        access_token: process.env.PROJECT_003_ACCESS_TOKEN
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
