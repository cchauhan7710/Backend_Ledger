import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendRegistrationEmail, sendEmail } from "../services/email.service.js";
import TokenBlackListModel from "../models/blackList.model.js";

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;

    const isExists = await userModel.findOne({
      email: email,
    });

    if (isExists) {
      return res.status(422).json({
        message: "User already exist with email",
        status: "failed",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(201).json({
      message: "User Registered SuccessFully",
      status: "pass",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });

    await sendRegistrationEmail(user.email, user.name);
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

/**
 * -user login controller
 * -POST /api/auth/login
 */
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User Not registered , Please register first",
        status: "failed",
        success: false,
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "User Not registered , Please register first",
        status: "failed",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(200).json({
      message: "Login Successfully !",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("ERROR 1", error, error.message);
  }
}

async function userLogoutController(req, res) {
  const token = req.cookies.token || req.header.authorization?.split(" ")[1];
  if (!token) {
    return res.status(404).json({
      message: "User logged-out Successfully",
    });
  }
  res.clearCookie("token");
  await TokenBlackListModel.create({
    token: token,
  });

  res.status(200).json({
    message: "User logged-out Successfully",
  });
}
export { userRegisterController, userLoginController, userLogoutController };
