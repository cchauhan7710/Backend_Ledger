import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * - Routes Required
 */
import userRoute from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

/**
 * Use Routes
 */
app.use("/api/auth", userRoute);
app.use("/api/account", accountRouter);
app.use("/api/transactions", transactionRouter);

export default app;
