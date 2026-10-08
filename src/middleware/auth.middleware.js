import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import TokenBlackListModel from "../models/blackList.model.js";

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "unauthorized user , token missing",
    });
  }
  const isBlackListed = await TokenBlackListModel.findOne({ token });

  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized token or Token expired, please Login again ",
    });
  }

  try {
    const decode = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decode.userId);
    req.user = user;
    return next();
  } catch (error) {
    console.error(error.message);
    console.log("unauthorized user , token invalid");
  }
}
async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "unauthorized user , token missing",
    });
  }
  const isBlackListed = await TokenBlackListModel.findOne({
    token,
  });
  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized token or Token expired, please Login again ",
    });
  }
  try {
    const decode = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decode.userId).select("+systemUser");
    if (!user.systemUser) {
      console.log(user.systemUser);
      return res.status(403).json({
        message: "Forbidden user , not a system user",
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.error(error.message);
    console.log("unauthorized user , token invalid");
  }
}

export { authMiddleware, authSystemUserMiddleware };
