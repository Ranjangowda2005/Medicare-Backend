
import { Resend } from "resend";

export const sendEmail = async (to, subject, text) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data.id);

    return {
      success: true,
      message: "Email submitted successfully",
    };
  } catch (error) {
    console.error("Email Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};


// import nodemailer from "nodemailer";

// const transport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendEmail = async (to, subject, text) => {
//   try {
//     transport.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     });
//     console.log("Email send successfully");
//   } catch (error) {
//     console.log(error)
//   }
// };

