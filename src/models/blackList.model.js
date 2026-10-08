import mongoose from "mongoose";

const blackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to blacklist"],
      unique: [true, "Token is already balcklisted"],
    },
  },
  { timestamps: true },
);
blackListSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3 },
);

const TokenBlackListModel = mongoose.model(
  "blackListedTokens",
  blackListSchema,
);

export default TokenBlackListModel;
