import express from "express";
import {
  userRegisterController,
  userLoginController,
  userLogoutController,
} from "../controllers/auth.controller.js";

const userRoute = express.Router();

userRoute.post("/register", userRegisterController);
userRoute.post("/login", userLoginController);
userRoute.post("/logout", userLogoutController);

export default userRoute;
