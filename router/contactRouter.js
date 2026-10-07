import express from "express";

import {
  createcontact,
  deleteContact,
  getContacts,
  markContactAsRead,
} from "../controller/contactController.js";

import { doctorAuthentication } from "../middleware/doctorAuth.js";

const router = express.Router();

// Public contact form
router.post("/", createcontact);

// Doctor contact messages
router.get("/get", doctorAuthentication, getContacts);

// Mark message as read
router.put("/:id/read", doctorAuthentication, markContactAsRead);

// Delete message
router.delete("/:id", doctorAuthentication, deleteContact);

export default router;
