import express from "express";
import {
  createTransaction,
  createInitialFundsTransaction,
} from "../controllers/transaction.controller.js";
import {
  authMiddleware,
  authSystemUserMiddleware,
} from "../middleware/auth.middleware.js";

const TransactionRouter = express.Router();

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */

TransactionRouter.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  createInitialFundsTransaction,
);
/**
 * - api/transaction/
 * - Create new transaction
 */
TransactionRouter.post("/", authMiddleware, createTransaction);

export default TransactionRouter;
