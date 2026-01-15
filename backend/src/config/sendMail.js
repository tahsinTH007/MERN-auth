/**
 * sendMail.js
 *
 * Utility function to send emails using Nodemailer and Gmail SMTP.
 * Supports async sending with proper verification of the SMTP server.
 */

import { createTransport } from "nodemailer";

/**
 * Sends an email using Gmail SMTP.
 *
 * @param {Object} mailOptions - Options for the email
 * @param {string} mailOptions.email - Recipient email address
 * @param {string} mailOptions.subject - Email subject line
 * @param {string} mailOptions.html - Email content in HTML format
 * @returns {Promise<void>} Resolves when the email is successfully sent
 * @throws Will throw an error if sending fails or SMTP server verification fails
 */
const sendMail = async ({ email, subject, html }) => {
  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP server is ready to send messages");

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      html: html,
    });

    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
