require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { body, validationResult } = require("express-validator");

const nodemailer = require("nodemailer");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const fetchuser = require("../middleware/GetUser");

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePasswd = (passwd) => {
  const passwdRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
  );
  let isValid = passwdRegex.test(passwd);
  if (!isValid) {
  } else if (passwd.length < 8) {
    isValid = false;
  }
  return isValid;
};

router.post(
  "/user/exists",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const user = require("../models/User");
    const reqUser = await user.findAll({
      where: {
        email: email,
      },
    });
    return res.status(200).json({ exists: reqUser.length !== 0 });
  }
);

router.post(
  "/signup",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
    body("password", "Enter a valid password").custom((value) => {
      return validatePasswd(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const uniqueToken = generateToken();
    const data = {
      token: uniqueToken,
      email: req.body.email,
    };
    const token = jwt.sign(data, process.env.SECRET_KEY);
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
    const user = require("../models/User");
    user
      .create({
        email: email,
        password: hashedPassword,
        emailVerificationCode: uniqueToken,
      })
      .then((user) => {
        const mailOptions = {
          from: process.env.APP_GMAIL,
          to: user.email,
          subject: "Email Verification",
          html: htmlBody,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Error sending email", success: false });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ success: true });
          }
        });
      })
      .catch((err) => {
        console.log("Error in object creation: ", err);
        return res
          .status(500)
          .json({ error: "Error in user creation", success: false });
      });
  }
);

router.post(
  "/send-verification-code",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), invalid: true });
    }
    const email = req.body.email;
    const user = require("../models/User");
    const reqUser = await user.findOne({
      where: {
        email: email,
      },
    });
    if (reqUser.length === 0) {
      return res.status(400).json({ invalid: true });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_GMAIL_PASSWORD,
      },
    });
    const htmlBody = `<div>
                      <p>Hi,</p>
                      <p>We have received a request to reset your password. Please enter the following verification code to verify your email address:</p>
                      <h2>${verificationCode}</h2>
                      <p>If you did not request this verification code, please ignore this email.</p>
                      <p>Thank you,<br> TradeNow Team</p>
                      </div> `;
    const resetPassword = require("../models/ResetPassword");
    resetPassword
      .create({
        verificationCode: verificationCode,
        user_id: reqUser.dataValues.id,
      })
      .then((rpasswd) => {
        const mailOptions = {
          from: process.env.APP_GMAIL,
          to: reqUser.dataValues.email,
          subject: "Reset your Password",
          html: htmlBody,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Error sending email", success: false });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ success: true });
          }
        });
      })
      .catch((err) => {
        console.log("Error in object creation: ", err);
        return res
          .status(500)
          .json({ error: "Error in reset password", success: false });
      });
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
    body("password", "Enter a valid password").custom((value) => {
      return validatePasswd(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = require("../models/User");
    const session = require("../models/Session");
    user
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ success: false });
        }
        if (!user.email_verified) {
          return res
            .status(200)
            .json({
              success: false,
              verified: false,
              message: "User has to verify email address",
            });
        }
        bcrypt
          .compare(password, user.dataValues.password)
          .then((result) => {
            if (!result) {
              return res.status(400).json({ success: false });
            }
            const data = {
              user: {
                id: user.id,
              },
            };
            const authtoken = jwt.sign(data, process.env.SECRET_KEY);
            session
              .create({
                user_id: user.id,
                session_id: authtoken,
                started_at: new Date(),
                last_request: new Date(),
              })
              .then((sessionRow) => {
                if (!sessionRow)
                  return res
                    .status(500)
                    .json({ success: false, error: "Internal Server Error" });
                console.log("Session created: ", sessionRow);
                return res.json({ success: true, authtoken: authtoken });
              });
          })
          .catch((error) => {
            console.log("Error: ", error);
            return res.status(500).json({ error: "Server Error" });
          });
      })
      .catch((error) => {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Server Error" });
      });
  }
);

router.post(
  "/verify-code",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    const email = req.body.email;
    const code = req.body.code;
    const user = require("../models/User");
    const reqUser = await user.findOne({
      where: {
        email: email,
      },
    });
    if (reqUser.length === 0) {
      return res.status(400).json({ success: false });
    }
    const resetPassword = require("../models/ResetPassword");
    resetPassword
      .update(
        {
          verified: true,
        },
        {
          returning: true,
          where: {
            [Op.and]: [
              { user_id: reqUser.dataValues.id },
              { verificationCode: code },
              { verified: false },
              {
                createdAt: { [Op.gte]: new Date(new Date() - 15 * 60 * 1000) },
              },
            ],
          },
        }
      )
      .then(([nrows, rows]) => {
        if (nrows === 0 || nrows > 1) {
          return res.status(400).json({ success: false });
        }
        const reqRow = rows[0].dataValues;
        const data = {
          user: {
            id: reqRow.user_id,
            rpasswd_id: reqRow.id,
          },
        };
        const authtoken = jwt.sign(data, process.env.SECRET_KEY);
        return res.status(200).json({ success: true, authtoken: authtoken });
      })
      .catch((error) => {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Server Error" });
      });
  }
);

router.post(
  "/reset-forgot-password",
  [
    body("password", "Invalid password").custom((value) => {
      return validatePasswd(value);
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), invalid: true });
    }
    const newpassword = await bcrypt.hash(req.body.password, 10);
    try {
      const user = require("../models/User");
      const resetPassword = require("../models/ResetPassword");
      user
        .findOne({
          where: {
            id: req.user.id,
          },
        })
        .then((user) => {
          if (!user) {
            return res.status(400).json({ success: false });
          }
          return resetPassword.update(
            {
              newPassword: newpassword,
              oldPassword: user.password,
            },
            {
              where: {
                id: req.user.rpasswd_id,
              },
            }
          );
        })
        .then(([nrows, rows]) => {
          if (nrows === 0 || nrows > 1) {
            return res.status(400).json({ success: false });
          }
          return user.update(
            {
              password: newpassword,
            },
            {
              where: {
                id: req.user.id,
              },
            }
          );
        })
        .then(([nrows, rows]) => {
          if (nrows === 0 || nrows > 1) {
            return res.status(400).json({ success: false });
          }
          return res.status(200).json({ success: true });
        });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/emailVerification",
  [
    body("email", "Enter a valid email address").custom((value) => {
      return validateEmail(value);
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success: false });
    }
    const email = req.body.email;
    const uniqueToken = generateToken();
    const data = {
      token: uniqueToken,
      email: req.body.email,
    };
    const token = jwt.sign(data, process.env.SECRET_KEY);
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
    const user = require("../models/User");
    user
      .update(
        {
          emailVerificationCode: uniqueToken,
        },
        {
          where: {
            email: email,
          },
        }
      )
      .then(([nrows, rows]) => {
        if (nrows === 0 || nrows > 1) {
          return res.status(400).json({ success: false });
        }
        const mailOptions = {
          from: process.env.APP_GMAIL,
          to: rows[0].email,
          subject: "Email Verification",
          html: htmlBody,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Error sending email", success: false });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ success: true });
          }
        });
        return res.status(200).json({ success: true });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
      });
  }
);

router.get("/verifyEmail", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).send({ error: "Please use a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = require("../models/User");
    const reqUser = await user.findOne({
      where: {
        email: data.email,
        emailVerificationCode: data.token,
      },
    });
    if (!reqUser) {
      return res.status(401).send({ error: "Please use a valid token" });
    }
    reqUser.email_verified = true;
    await reqUser.save();
    return res.status(200).json({ msg: "Email is verified" });
  } catch (error) {
    return res.status(401).send({ error: "Please use a valid token" });
  }
});

router.post("/user/logout", fetchuser, async (req, res) => {
  const session = require("../models/Session");
  session
    .update(
      {
        ended_at: new Date(),
      },
      {
        returning: true,
        where: {
          user_id: req.user.id,
          session_id: req.headers["authtoken"],
          ended_at: {
            [Op.is]: null,
          },
        },
      }
    )
    .then(([nrows, rows]) => {
      if (nrows === 0 || nrows > 1) {
        return res
          .status(500)
          .json({ success: false, error: "Please authenticate using a valid token" });
      }
      return res.status(200).json({success: true});
    }).catch((error)=>{
      console.error("Error: ", error);
      return res.status(500).json({success: false, error: "Internal Server Error"});
    });
});

module.exports = router;
