import express from "express";
import {
  createFeedback,
  getDoctorRating,
  getMyFeedbacks,
} from "../controller/feedbackController.js";
import { authentication } from "../middleware/auth.js";

const router = express.Router();

router.post("/feedback", authentication, createFeedback);
router.get("/doctor-rating", getDoctorRating);
router.get("/my-feedbacks", authentication, getMyFeedbacks  );


export default router;
