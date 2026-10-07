import { response } from "express";
import registrationModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/mail.js";
export const createRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    const checkEmail = await registrationModel.findOne({ email });

    if (checkEmail) {
      return res.json({
        success: false,
        message: "Email already registered",
      });
    }

    const hasspassword = await bcrypt.hash(password, 10);

    const image = req.file ? req.file.filename : "";

    const storeRegister = await registrationModel.create({
      name,
      email,
      password: hasspassword,
      image,
    });

    if (!storeRegister) {
      return res.json({
        success: false,
        message: "not registered",
      });
    }
    return res.json({
      success: true,
      message: "registered",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await registrationModel.findOne({ email });
    console.log(checkEmail);
    if (!checkEmail) {
      return res.json({
        success: false,
        message: "User not registered",
      });
    }

    if (checkEmail.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been blocked. Please contact the administrator.",
      });
    }

    const comparedPassword = await bcrypt.compare(
      password,
      checkEmail.password,
    );

    if (!comparedPassword) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: checkEmail._id }, "webdevelopment");
    //sending mail
    await sendEmail(
      checkEmail.email,
      "Login",
      "Login detected on your account",
    );

    return res.json({
      success: true,
      message: "Login successfully",
      token,
      user: {
        name: checkEmail.name,
        email: checkEmail.email,
        image: checkEmail.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await registrationModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkUserStatus = async (req, res) => {
  try {
    // req.user already contains the user ID
    const user = await registrationModel.findById(req.user).select("status");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    return res.json({
      success: true,
      status: user.status,
    });
  } catch (error) {
    console.log("Check User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await registrationModel.findByIdAndUpdate(
      userId,
      { status: "Blocked" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await registrationModel.findByIdAndUpdate(
      userId,
      { status: "Active" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User unblocked successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
