import jwt from "jsonwebtoken";
import registrationModel from "../model/userModel.js";

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const verify = jwt.verify(token, "webdevelopment");

    const user = await registrationModel.findById(verify.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the doctor",
      });
    }

    req.user = verify.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
