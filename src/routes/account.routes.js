import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAccountController,
  getUserAccountController,
  getAccountBalanceController,
} from "../controllers/account.controller.js";

const accountRouter = express.Router();

/**
 *  - POST /api/accounts
 *  - Create a new account
 *  - Protected Route
 */
accountRouter.post("/", authMiddleware, createAccountController);

/**
 * - GET api/accounts
 * - get all accounts of the logged-in users
 * - private route
 */

accountRouter.get("/", authMiddleware, getUserAccountController);

/**
 * - GEt /api/account/balance/:accountId
 */
accountRouter.get(
  "/balance/:accountId",
  authMiddleware,
  getAccountBalanceController,
);

export default accountRouter;
