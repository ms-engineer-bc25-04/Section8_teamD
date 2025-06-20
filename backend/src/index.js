const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const { authenticateFirebaseToken } = require('../middleware/authenticateFirebaseToken');
const voteRouter = require('../routes/vote');

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

// ユーザー残高取得API（認証付き：token必須）
app.get('/api/balance', authenticateFirebaseToken, async (req, res) => {
  // Firebase認証を通っていればreq.user.uidが存在
  const userId = req.user.uid;
  console.log("🔥 バックエンドで受け取ったFirebase UID:", userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log("🧾 対象ユーザー:", user);
  if (!user) return res.status(404).json({ error: 'User not found' });

  console.log("🔥 user.accountNumber:", user.accountNumber);
  console.log("🔐 user.access_token:", user.access_token);

   try {
    // Sunabar APIから口座残高取得
    const apiUrl = "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances";
    const result = await axios.get("https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances", {
      headers: {
        'x-access-token': user.access_token,
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    console.log("balances from bank API:", result.data.balances); // ←★ここ！
    // 取得したbalances配列をそのまま返す
    res.json({
      accountNumber: user.accountNumber,
      balance: result.data.balances?.[0]?.balance ?? 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Bank API error', detail: err.message });
  }
});

// --- 投票APIはvoteRouterに完全に任せる！ ---
// vote.ts内で「認証ミドルウェア・送金・金額加算」など全部実装されていればOK
app.use('/api/vote', voteRouter);


// サーバー起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
