const express = require("express");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const { projectId, amount } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!user || !project) return res.status(404).json({ error: "User or Project not found" });

  const transferData = {
    debitAccountId: user.accountNumber,
    creditAccountId: project.accountNumber,
    amount: amount,
  };

  try {
    const result = await axios.post(
      "https://sandbox.sunabar.gmo-aozora.com/api/v1/transfer",
      transferData,
      { headers: { "X-API-KEY": process.env.SUNABAR_API_KEY } }
    );

    await prisma.project.update({
      where: { id: projectId },
      data: { current_amount: { increment: amount } },
    });

    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
