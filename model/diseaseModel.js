import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    overview: {
      type: String,
      required: true,
    },

    symptoms: {
      type: [String],
      default: [],
    },

    causes: {
      type: [String],
      default: [],
    },

    riskFactors: {
      type: [String],
      default: [],
    },

    prevention: {
      type: [String],
      default: [],
    },

    treatment: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const diseaseModel = mongoose.model("Disease", diseaseSchema);

export default diseaseModel;
