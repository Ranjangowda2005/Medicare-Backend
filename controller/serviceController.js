import { client } from "../config/redis.js";
import serviceModel from "../model/serviceModel.js";
import feedbackModel from "../model/feedbackModel.js";
import { sendEmail } from "../config/mail.js";

export const createAppointment = async (req, res) => {
  try {
    const { date, time, contact, description } = req.body;

    if (!date || !time || !contact || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date or time",
      });
    }

    // Only 15-minute slots
    if (minutes % 15 !== 0) {
      return res.status(400).json({
        success: false,
        message: "Please select a 15-minute time slot",
      });
    }

    // Current date and time
    const now = new Date();

    // Convert selected date
    const selectedDate = new Date(`${date}T00:00:00`);

    // Remove time from current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous date check
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "You cannot book an appointment for a previous date.",
      });
    }

    // If booking for today, check time
    if (selectedDate.getTime() === today.getTime()) {
      const selectedDateTime = new Date(`${date}T${time}:00`);

      if (selectedDateTime <= now) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot book a previous time. Please select a future time.",
        });
      }
    }

    // Convert selected time to minutes
    const selectedMinutes = hours * 60 + minutes;

    // Find appointments on same date
    const appointments = await serviceModel.find({
      date,
      status: { $ne: "Declined" },
    });

    // Check booked 15-minute slot
    const slotAlreadyBooked = appointments.some((appointment) => {
      const [bookedHours, bookedMinutes] = appointment.time
        .split(":")
        .map(Number);

      const bookedTotalMinutes = bookedHours * 60 + bookedMinutes;

      return bookedTotalMinutes === selectedMinutes;
    });

    if (slotAlreadyBooked) {
      return res.status(409).json({
        success: false,
        message: `This time slot (${time}) is already booked. Please select another time.`,
      });
    }

    // Create appointment
    const appointment = await serviceModel.create({
      userId: req.user,
      date,
      time,
      contact,
      description,
      status: "Pending",
    });

    //  await sendEmail(
    //       userId,
    //       "Login",
    //       "Login detected on your account",
    //     );

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to book appointment",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const redisKey = `appointments:${req.user}`;

    const getFromRedis = await client.get(redisKey);

    if (!getFromRedis) {
      const appointments = await serviceModel
        .find({ userId: req.user })
        .populate("userId", "name email ")
        .sort({ createdAt: -1 });

      await client.set(redisKey, JSON.stringify(appointments));

      return res.status(200).json({
        success: true,
        message: "user found from database",
        appointments,
      });
    }

    return res.status(200).json({
      success: true,
      message: "user found from redis",
      appointments: JSON.parse(getFromRedis),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL APPOINTMENTS FOR DOCTOR
export const getAppointments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // -----------------------------------------
    // 1. Get appointments
    // -----------------------------------------
    const appointments = await serviceModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email image")
      .sort({ createdAt: -1 });

    // -----------------------------------------
    // 2. Get appointment IDs
    // -----------------------------------------
    const appointmentIds = appointments.map((appointment) => appointment._id);

    // -----------------------------------------
    // 3. Get feedback for these appointments
    // -----------------------------------------
    const feedbacks = await feedbackModel.find({
      appointmentId: { $in: appointmentIds },
    });

    // -----------------------------------------
    // 4. Attach feedback to the matching
    //    appointment
    // -----------------------------------------
    const appointmentsWithFeedback = appointments.map((appointment) => {
      const feedback = feedbacks.find(
        (item) => item.appointmentId.toString() === appointment._id.toString(),
      );

      return {
        ...appointment.toObject(),

        feedback: feedback || null,
      };
    });

    // -----------------------------------------
    // 5. Send appointments + feedback
    // -----------------------------------------
    return res.status(200).json({
      success: true,
      message: "Data found from database",
      appointments: appointmentsWithFeedback,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Declined", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const existingAppointment = await serviceModel.findById(id);

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only Accepted appointment can be Completed
    if (status === "Completed" && existingAppointment.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted appointment can be Completed",
      });
    }

    const appointment = await serviceModel
      .findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
        },
      )
      .populate("userId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ============================================
    // SEND EMAIL BASED ON APPOINTMENT STATUS
    // ============================================

    const userEmail = appointment.userId?.email;
    const userName = appointment.userId?.name || "Patient";

    if (userEmail) {
      let emailSubject = "";
      let emailText = "";

      // ACCEPTED
      if (status === "Accepted") {
        emailSubject = "Appointment Accepted - MediCare";

        emailText = `Hello ${userName},

Your appointment with Dr. Joseph has been accepted successfully.

Your appointment details:

Date: ${appointment.date}
Time: ${appointment.time}

Please be available at the scheduled time.

Thank you for choosing MediCare.

Regards,
MediCare Team`;
      }

      // DECLINED
      if (status === "Declined") {
        emailSubject = "Appointment Declined - MediCare";

        emailText = `Hello ${userName},

We are sorry to inform you that your appointment request with Dr. Joseph has been declined.

Appointment details:

Date: ${appointment.date}
Time: ${appointment.time}

Please try booking another available appointment.

Thank you for understanding.

Regards,
MediCare Team`;
      }

      // COMPLETED
      if (status === "Completed") {
        emailSubject = "Appointment Completed - MediCare";

        emailText = `Hello ${userName},

Your appointment with Dr. Joseph has been completed successfully.

Appointment details:

Date: ${appointment.date}
Time: ${appointment.time}

Thank you for choosing MediCare.

You can now submit your rating and feedback for your appointment.

Regards,
MediCare Team`;
      }

      await sendEmail(userEmail, emailSubject, emailText);
    }

    // ============================================
    // CLEAR REDIS CACHE
    // ============================================

    await client.del(
      `appointments:${appointment.userId?._id || appointment.userId}`,
    );

    await client.del("service:page:1:limit:10");
    await client.del("service:page:1:limit:1000");

    return res.json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
