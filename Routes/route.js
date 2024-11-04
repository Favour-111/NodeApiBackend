const express = require("express");
const route = express.Router();
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//end point for creating users
const sendEmailVerification = (token, email) => {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "omojolaobaloluwa@gmail.com",
      pass: "yrwy nafr teco zptp",
    },
  });

  var mailOptions = {
    from: "omojolaobaloluwa@gmail.com",
    to: email,
    subject: "email verification",
    text: `Please click the link to verify your email address http://localhost:5000/verify/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
route.get("/", (req, res) => {
  res.send("uploaded");
});
route.post("/api/users", async (req, res) => {
  try {
    const { Fullname, NickName, phoneNumber, email, password } = req.body;
    const existinguser = await UserModel.findOne({ email: email });
    if (existinguser) {
      return res.send({
        success: false,
        message: "email already exists",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const user = UserModel({
        Fullname,
        NickName,
        phoneNumber,
        email,
        password: hashPassword,
      });
      user.verificationToken = crypto.randomBytes(20).toString("hex");

      await user.save();
      sendEmailVerification(user.verificationToken, user.email);
      if (user) {
        res.status(200).send({
          success: true,
          message: "account created successfully",
          user,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});
const createSecretJwtKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};
const secretKey = createSecretJwtKey();

//endPoint to login users
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailVerify = await UserModel.findOne({ email });
    if (!emailVerify) {
      res.status(201).send({
        message: "invalid email address",
      });
    } else {
      const validPassword = await bcrypt.compare(
        password,
        emailVerify.password
      );
      if (!validPassword) {
        res.status(201).send({
          message: "invalid password",
        });
      } else {
        const token = jwt.sign({ userId: emailVerify._id }, secretKey);
        res.status(200).send({
          message: token,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

//end point to verify token
route.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) {
      res.status(404).send({ message: "Token not found" });
    } else {
      user.verified = true;
      user.verificationToken = undefined;

      res.status(200).send("user verified");
      await user.save();
      ("");
    }
  } catch (error) {
    res.status(201).send({
      message: "email verification error",
    });
  }
});
//end point for getting all users
route.get("/all/user", async (req, res) => {
  try {
    const user = await UserModel.find();
    if (user) {
      res.send({ success: true, message: user });
    }
  } catch (error) {
    console.log(error.message);
  }
});
//endPoint for deleting single user
route.delete("/single/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (user) {
      res.send({ success: true, message: "user deleted successfully" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
//endPoint for getting single user
route.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      res.send({ success: true, message: user });
    }
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = route;
