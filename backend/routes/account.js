// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }

        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!account || !toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Account not found"
            });
        }

        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Perform the transfer
        await Account.updateOne(
            { userId: req.userId }, 
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to }, 
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Transfer failed"
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;