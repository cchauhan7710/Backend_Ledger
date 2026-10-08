import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "leadger must be associated with an account"],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is requied to creating a leadger"],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "ledger must be asscociated with an transaction"],
      index: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Type can be either CREDIT or DEBIT",
      },
      required: [true, "Leaddger type is required"],
      immutable: true,
    },
  },
  { timestamps: true },
);

function preventLeadgerModification() {
  throw new Error(
    "Leadger entries are immutable and cannot be modified or deleted",
  );
}
ledgerSchema.pre("findOneAndUpdate", preventLeadgerModification);
ledgerSchema.pre("findOneAndReplace", preventLeadgerModification);
ledgerSchema.pre("findOneAndDelete", preventLeadgerModification);
ledgerSchema.pre("deleteOne", preventLeadgerModification);
ledgerSchema.pre("deleteMany", preventLeadgerModification);
ledgerSchema.pre("remove", preventLeadgerModification);
ledgerSchema.pre("updateMany", preventLeadgerModification);
ledgerSchema.pre("updateOne", preventLeadgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

export default ledgerModel;
