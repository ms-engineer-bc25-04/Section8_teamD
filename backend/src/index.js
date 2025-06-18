const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ユーザー一覧API（デバッグ・選択用）
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

// プロジェクト一覧API＋状態判定
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    const now = new Date();

    // 状態判定ロジックを追加
    const withStatus = projects.map((p) => {
      let status = "募集中";
      if (p.current_amount >= p.goal_amount) {
        status = "成立";
      } else if (now > p.deadline) {
        status = "終了";
      }
      return { ...p, status };
    });
    res.json(withStatus);
  } catch (err) {
    res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

// ユーザー残高取得API（Sunabar本番連携）
app.get('/api/balance', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'user_id is required' });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    // Sunabar APIから口座残高取得
    const result = await axios.get(
      `https://sandbox.sunabar.gmo-aozora.com/api/v1/accounts/${user.accountNumber}/balance`,
      { headers: { 'X-API-KEY': process.env.SUNABAR_API_KEY } }
    );
    res.json({ accountNumber: user.accountNumber, balance: result.data.balance });
  } catch (err) {
    res.status(500).json({ error: 'Bank API error', detail: err.message });
  }
});

// 投票API（ユーザー→プロジェクトへ送金＆current_amount加算）
app.post('/api/vote', async (req, res) => {
  const { userId, projectId, amount } = req.body;
  if (!userId || !projectId || !amount)
    return res.status(400).json({ error: 'userId, projectId, amountは必須' });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!user || !project)
    return res.status(404).json({ error: 'User or Project not found' });

  const transferData = {
    debitAccountId: user.accountNumber,
    creditAccountId: project.accountNumber, // ←ここはプロジェクトテーブルの口座番号
    amount: amount
  };

  try {
    // Sunabar APIで送金実行
    const result = await axios.post(
      'https://sandbox.sunabar.gmo-aozora.com/api/v1/transfer',
      transferData,
      { headers: { 'X-API-KEY': process.env.SUNABAR_API_KEY } }
    );

    // プロジェクトの現在金額を加算
    await prisma.project.update({
      where: { id: projectId },
      data: { current_amount: { increment: amount } }
    });

    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
