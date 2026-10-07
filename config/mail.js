import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ranjangowdadidupe@gmail.com",
    pass: "wfin xfnh bsds gptu",
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    transport.sendMail({
      from: "ranjangowdadidupe@gmail.com",
      to,
      subject,
      text,
    });
    console.log("Email send successfully");
  } catch (error) {
    console.log(error)
  }
};

