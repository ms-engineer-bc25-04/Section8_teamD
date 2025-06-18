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

// ユーザー残高API
app.get('/api/balance', async (req, res) => {
  const userId = req.query.user_id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    const result = await axios.get(
      `https://sandbox.sunabar.gmo-aozora.com/api/v1/accounts/${user.account_number}/balance`,
      { headers: { 'X-API-KEY': process.env.SUNABAR_API_KEY } }
    );
    res.json({ balance: result.data.balance });
  } catch (err) {
    res.status(500).json({ error: 'Bank API error', detail: err.message });
  }
});

// 投票API
app.post('/api/vote', async (req, res) => {
  const { userId, projectId, amount } = req.body;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!user || !project) return res.status(404).json({ error: 'User or Project not found' });

  const transferData = {
    debitAccountId: user.account_number,
    creditAccountId: project.project_account_number,
    amount: amount
  };

  try {
    const result = await axios.post(
      'https://sandbox.sunabar.gmo-aozora.com/api/v1/transfer',
      transferData,
      { headers: { 'X-API-KEY': process.env.SUNABAR_API_KEY } }
    );

    await prisma.project.update({
      where: { id: projectId },
      data: { current_amount: { increment: amount } }
    });

    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});