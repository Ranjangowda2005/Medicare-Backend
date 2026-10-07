import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

export default mongoose.model("admin", doctorSchema);
