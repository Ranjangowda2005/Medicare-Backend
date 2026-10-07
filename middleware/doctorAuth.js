import jwt from "jsonwebtoken";

export const doctorAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Doctor token not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Doctor token not found",
      });
    }

    const verify = jwt.verify(token, "webdevelopment");

    req.doctor = verify.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired doctor token",
    });
  }
};
