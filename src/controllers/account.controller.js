import accountModel from "../models/account.model.js";

/**
 * Create a new account
 */
async function createAccountController(req, res) {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    console.error("Create account error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create account",
      error: error.message,
    });
  }
}

async function getUserAccountController(req, res) {
  const account = await accountModel.find({
    user: req.user._id,
  });

  return res.status(200).json({
    message: "All accounts are here",
    account,
  });
}

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }
  const balance = await account.getBalance();

  return res.status(200).json({
    message: "Balance fetched successfully",
    accountId: account._id,
    balance: balance,
  });
}

export {
  createAccountController,
  getUserAccountController,
  getAccountBalanceController,
};
