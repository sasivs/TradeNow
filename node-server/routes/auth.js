require('dotenv').config()

const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

router.post("/emailverification", (req, res) => {
  const email = req.body.email;
  const token = generateToken();
  const verificationLink = `http://localhost:3001/api/auth/verifyEmail?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_GMAIL,
      pass: process.env.APP_GMAIL_PASSWORD,
    },
  });
  const htmlBody = `<div>
                        <p>Dear user,</p>
                      <p>Thank you for signing up for our service!
                      To start using our platform, we need to verify your email address. 
                      Please click on the button below to complete the verification process:</p>
                      <a href="${verificationLink}" style={"text-decoration":none}><button style={"background-color":blue}>Verify</button></a>
                      <p>If the above button does not work, please copy and paste the following link into your web browser:</p>
                      <p><a href="${verificationLink}">${verificationLink}</a></p>
                      <p>Once you have verified your email address, you will be able to access all the features of our service. 
                      If you did not sign up for our platform, please disregard this email</p>.
                      \n\n
                      <p>Thank you,</p>
                      <p>TradeNow</p>
                   </div> `;
  const mailOptions = {
    from: process.env.APP_GMAIL,
    to: email,
    subject: "Email Verification",
    html: htmlBody,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent");
    }
  });
});

router.get("/verifyEmail", (req, res) => {
  const { token } = req.query;
  console.log(token);

  res.send("Email verified");
});

module.exports = router;
