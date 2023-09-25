const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");

// Configure AWS SDK with your access credentials
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-east-1",
});

// Create a Nodemailer transporter using Amazon SES
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({ apiVersion: "2010-12-01" }),
});

// Email content
const sendEmail = (subject, text) => {
  const mailOptions = {
    from: "iphone@kirangautam.com", // Sender's email address
    to: "ukiras@gmail.com", // Recipient's email address
    subject: subject || "iPhone Availability",
    text: text || "iPhone is available",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
module.exports = {
  sendEmail,
};
