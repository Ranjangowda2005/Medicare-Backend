import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    date: String,
    time: String,
    contact: String,
    description: String,

    // image: String,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined","Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("service", serviceSchema);
