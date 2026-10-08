import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import mongoose from "mongoose";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmail } from "../services/email.service.js";

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  // 1. Validate request
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than 0",
    });
  }

  // Prevent sending money to the same account
  if (fromAccount === toAccount) {
    return res.status(400).json({
      message: "Sender and receiver accounts cannot be the same",
    });
  }

  // 2. Validate idempotency key
  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }

    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
        transaction: existingTransaction,
      });
    }

    if (existingTransaction.status === "FAILED") {
      return res.status(400).json({
        message: "Transaction processing failed, please retry",
      });
    }

    if (existingTransaction.status === "REVERSED") {
      return res.status(400).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }

  // 3. Find accounts
  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  // 4. Check account status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both sender and receiver accounts must be ACTIVE to process the transaction",
    });
  }

  // 5. Check balance
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 6. Create transaction
    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session },
    );

    // 7. Create DEBIT ledger entry
    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    // 8. Create CREDIT ledger entry
    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    // 9. Mark transaction completed
    transaction.status = "COMPLETED";

    await transaction.save({ session });

    // 10. Commit transaction
    await session.commitTransaction();

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Transaction failed:", error);

    return res.status(500).json({
      message: "Transaction processing failed",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body ?? {};

  // 1. Validate request
  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than 0",
    });
  }

  // 2. Validate idempotency
  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existingTransaction,
    });
  }

  // 3. Find receiver account
  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  // 4. Find system user's account
  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found for the current user",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 5. Create transaction
    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session },
    );

    // 6. Debit system account
    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    // 7. Credit user account
    await ledgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    // 8. Complete transaction
    transaction.status = "COMPLETED";

    await transaction.save({ session });

    // 9. Commit
    await session.commitTransaction();

    return res.status(201).json({
      message: "Initial funds transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Initial funds transaction failed:", error);

    return res.status(500).json({
      message: "Initial funds transaction failed",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
}

export { createTransaction, createInitialFundsTransaction };
