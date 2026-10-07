import express from "express";

import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus,
} from "../controller/serviceController.js";

import { authentication } from "../middleware/auth.js";
import { doctorAuthentication } from "../middleware/doctorAuth.js";
import { validateServices } from "../middleware/validator.js";

const router = express.Router();

// NORMAL USER: Create appointment
router.post(
  "/appointment",
  validateServices,
  authentication,
  createAppointment,
);

// DOCTOR: View all appointments
router.get("/appointments", doctorAuthentication, getAppointments);

// NORMAL USER: View own appointments
router.get("/my-appointments", authentication, getMyAppointments);

// DOCTOR: Update appointment status
router.put(
  "/appointment/:id/status",
  doctorAuthentication,
  updateAppointmentStatus,
);

export default router;
