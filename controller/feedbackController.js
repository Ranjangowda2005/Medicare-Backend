import feedbackModel from "../model/feedbackModel.js";
import serviceModel from "../model/serviceModel.js";

export const createFeedback = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and rating are required",
      });
    }

    const appointment = await serviceModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot rate this appointment",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "You can rate only completed appointments",
      });
    }

    const existingFeedback = await feedbackModel.findOne({
      appointmentId: appointment._id,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this appointment",
      });
    }

    const feedback = await feedbackModel.create({
      appointmentId: appointment._id,
      userId: req.user,
      rating: Number(rating),
      comment: comment || "",
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDoctorRating = async (req, res) => {
  try {
    const result = await feedbackModel.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalRatings: 0,
      });
    }

    return res.status(200).json({
      success: true,
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalRatings: result[0].totalRatings,
    });
  } catch (error) {
    console.error("Rating Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get doctor rating",
    });
  }
};

export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackModel
      .find({ userId: req.user })
      .select("appointmentId rating comment");

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get feedbacks",
    });
  }
};