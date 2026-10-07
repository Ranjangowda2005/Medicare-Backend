import express from "express";
import { login } from "../controller/docterController.js";

const router = express.Router();
router.post("/doctor/login", login);
// router.post("/admin",admin);

export default router;
