import multer from "multer";
import { v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


cloudinary.config({
  cloud_name:"djmsizzc",
  api_key:"633735573625711",
  api_secret:"bu8o5vShygyaf7Oapfxhrsm4yVs",
})

const storage =new CloudinaryStorage({
  cloudinary,
  params:{
    folder:"project"
  }
})

export const upload=multer({storage})