import multer from "multer";
import { v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
  cloud_name:process.env.MULTER_NAME,
  api_key:process.env.MULTER_KEY,
  api_secret:process.env.MULTER_API_SECRET,
})

const storage =new CloudinaryStorage({
  cloudinary,
  params:{
    folder:"project"
  }
})

export const upload=multer({storage})