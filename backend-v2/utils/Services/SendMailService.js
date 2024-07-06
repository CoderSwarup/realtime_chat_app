import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const NodeMailerEmailSender = async ({
  to,
  subject,
  html,
  attachments,
  text,
}) => {
  try {
    const TransPorter = nodemailer.createTransport({
      host: process.env.NODEMAILER_SERVICE, // if uou use the gamil use this "smtp.gmail.com"
      //   secure: true,
      //   port:465,  // If Not Work
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments,
    };

    return TransPorter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Eamil Not Send");
  }
};

export const sendEmailService = async (args) => {
  if (process.env.NODE_ENV === "development") {
    return Promise.resolve();
  } else {
    try {
      return await NodeMailerEmailSender(args);
    } catch (error) {
      // Handle error
      console.error("Error sending email:", error);
      throw error; // Optionally rethrow the error for the caller to handle
    }
  }
};
