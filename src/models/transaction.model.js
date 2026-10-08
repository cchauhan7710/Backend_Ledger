import mongoose from "mongoose";

const transactionSchmea = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "transaction must be associated with a from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "transaction must be associated with a to account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message:
          "Status can be either PENDING , COMPLETE , FAILED or REVERSED ",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "amount is required for ceating the account"],
      min: [0, "Transaction amount cannot be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [
        true,
        "Idempotecy  key is required for creating a transaction",
      ],
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchmea);

export default transactionModel;
