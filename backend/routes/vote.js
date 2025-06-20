const express = require("express");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateFirebaseToken, async (req, res) => {
  // デバッグ用ログ
  console.log("vote.js: POST /api/vote呼び出し！");

  const userId = req.user.uid; // Firebase認証済みユーザー
  const { projectId, amount } = req.body; // POST body

  console.log("userId:", userId);      // ← これをif文の前に追加
  console.log("projectId:", projectId);
  console.log("amount:", amount);

  // 必須パラメータチェック
  if (!userId || !projectId || !amount) {
    return res.status(400).json({ error: "userId, parojectId, amountは必須" });
  }

  // DBからユーザー・プロジェクト取得
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!user || !project) {
    return res.status(404).json({ error: "User or Project not found" });
  }

  // サンドボックス送金API用データ組み立て（※必要なだけ足してOK）
  const transferData = {
    accountId: user.accountNumber,             // 送金元口座
    remitterName: user.name,                   // 振込依頼人名（任意、なければ口座名義）
    transferDesignatedDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    transferDateHolidayCode: "1",              // 1=通常扱い
    totalCount: 1,                             // 1件
    totalAmount: amount,                       // 合計金額
    transfers: [
      {
        itemId: 1, // 任意の番号
        transferAmount: amount,
        beneficiaryBankCode: project.bank_code,
        beneficiaryBranchCode: project.beneficiaryBranchCode,
        accountTypeCode: "1", // 普通
        accountNumber: project.accountNumber,
        beneficiaryName: project.name_kana, // カナ名
      }
    ]
  };

  try {
    // 送金APIリクエスト
    const apiUrl = "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request";
    const apiHeaders = {
      "x-access-token": user.access_token, // ※ユーザー側トークン
      "Accept": "application/json;charset=UTF-8",
      "Content-Type": "application/json;charset=UTF-8"
    };

   const result = await axios.post(apiUrl, transferData, { headers: apiHeaders });

    // DBのプロジェクト合計金額を加算
    await prisma.project.update({
      where: { id: projectId },
      data: { current_amount: { increment: amount } }
    });

    // 送金APIの返却内容をそのまま返す
    res.json({ success: true, data: result.data });
  } catch (err) {
    console.error("送金APIエラー:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: err.message, detail: err.response?.data });
  }
});

module.exports = router;