import express from "express";

import {
  blockUser,
  checkUserStatus,
  createRegister,
  getAllUsers,
  unblockUser,
  userLogin,
} from "../controller/userController.js";

import { rateLimitation } from "../middleware/rateLimit.js";
import { validateRegister } from "../middleware/validator.js";
import { upload } from "../config/multer.js";
import { authentication } from "../middleware/auth.js";
import { doctorAuthentication } from "../middleware/doctorAuth.js";

const router = express.Router();

// USER REGISTER
router.post(
  "/createRegister",
  upload.single("image"),
  validateRegister,
  createRegister,
);

// USER LOGIN
router.post("/userLogin", rateLimitation, userLogin);

// DOCTOR USER MANAGEMENT
router.get("/all-users", doctorAuthentication, getAllUsers);

router.put("/block-user/:userId", doctorAuthentication, blockUser);

router.put("/unblock-user/:userId", doctorAuthentication, unblockUser);

// LOGGED-IN USER STATUS CHECK
router.get("/user-status", authentication, checkUserStatus);

export default router;
