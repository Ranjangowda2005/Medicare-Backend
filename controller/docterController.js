import docterModel from "../model/docterModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await docterModel.findOne({ email });

    if (!checkEmail) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const comparePassword = await bcrypt.compare(password, checkEmail.password);

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: checkEmail._id,
        role: "doctor",
      },
      "webdevelopment",
    );

    return res.status(200).json({
      success: true,
      message: "Doctor login successful",
      token,
      doctor: {
        id: checkEmail._id,
        name: checkEmail.name,
        email: checkEmail.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
