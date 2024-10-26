const express = require("express");
const route = express.Router();
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
//end point for creating users
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
      const user = await UserModel.create({
        Fullname,
        NickName,
        phoneNumber,
        email,
        password: hashPassword,
      });

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
//endPoint to login users
route.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
      });
    } else {
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).send({
          success: false,
          message: "incorrect password",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "user logged in successfully",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
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
