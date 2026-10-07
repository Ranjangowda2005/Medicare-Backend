import express from "express";
import { upload } from "../config/multer.js";

// import multer from "multer";
// import { v2 as cloudinary} from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

import {
  createDisease,
  getDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} from "../controller/diseaseController.js";

const router = express.Router();



// cloudinary.config({
//   cloud_name:"djmsizzc",
//   api_key:"633735573625711",
//   api_secret:"bu8o5vShygyaf7Oapfxhrsm4yVs",
// })

// const storage =new CloudinaryStorage({
//   cloudinary,
//   params:{
//     folder:"project"
//   }
// })

// const upload=multer({storage})

router.post("/disease", upload.single("image"), createDisease);

router.get("/diseases", getDiseases);

router.get("/disease/:id", getDiseaseById);

router.put("/disease/:id", upload.single("image"), updateDisease);

router.delete("/disease/:id", deleteDisease);

export default router;
