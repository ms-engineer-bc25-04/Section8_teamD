const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ユーザー追加
  await prisma.user.createMany({
    data: [
      {
      id: 'user_001',
      name: 'シオバラタカエ',
      accountNumber: '0010689',
      beneficiaryBranchCode: 302,
      access_token: 'OTU5ZGIxYTcxYjBhNjc0ZWE0MzgxMzEw'
      },
      {
        id: 'user_002',
        name: 'エガシラノリコ',
        accountNumber: '0010757',
        beneficiaryBranchCode: 301,
        access_token: 'NTE2NzJiNzg0Zjc5MTM2YjgwNzY5NmFj'
      },
      {
        id: 'user_003',
        name: 'シマダアユミ',
        accountNumber: '0010757',
        beneficiaryBranchCode: 302,
        access_token: 'ODBiOTdmN2I5MTllNDg1Mzk3MDcyMTI3'
      }
    ]
  });

  // プロジェクト追加
  await prisma.project.createMany({
    data: [
      {
        id: 'project_001',
        name: '市民プールの修繕',
        name_kana: 'スナバヒロユキ（カ',
        goal_amount: 5000000,
        current_amount: 2500000,
        deadline: new Date('2025-07-31T23:59:59'),
        description: '老朽化した市民プールの設備を修繕し、安全で快適な施設にリニューアルします。',
        beneficiaryBranchCode: 102,
        bank_code: 310,
        accountNumber: '0012010',
        access_token: 'dummy_token_001'   // ← 追加！
      },
      {
        id: 'project_002',
        name: '駅前の花壇整備',
        name_kana: 'スナバリアン（カ',
        goal_amount: 150000,
        current_amount: 10000,
        deadline: new Date('2025-07-31T23:59:59'),
        description: '駅前広場に季節の花を植え、美しい景観を作り出すプロジェクトです。',
        beneficiaryBranchCode: 102,
        bank_code: 310,
        accountNumber: '0012041',
        access_token: 'dummy_token_002'   // ← 追加！
      },
      {
        id: 'project_003',
        name: '子ども図書館の拡充',
        name_kana: 'スナバエイゾウ（カ',
        goal_amount: 200000,
        current_amount: 100000,
        deadline: new Date('2025-07-31T23:59:59'),
        description: '子ども向けの本を増やし、読書スペースを拡張して学習環境を向上させます。',
        beneficiaryBranchCode: 101,
        bank_code: 310,
        accountNumber: '0012058',
        access_token: 'dummy_token_003'   // ← 追加！
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
