import Admin from "../models/admin.model.js";
import { genarateTokenAndSetCookie } from "../utils/genarateTokenAndSetCookie.js";
import redisClient from "../utils/redis.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    //validations
    if (!fullname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long" });
    }

    //check if user already exists
    const admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ message: "User already exists" });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //----------------------------------------------------------------------------

    const profilepic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    //create new user
    const newAdmin = new Admin({
      fullname,
      username,
      password: hashedPassword,
      profilepic,
    });

    if (newAdmin) {
      await newAdmin.save();
      genarateTokenAndSetCookie(res, newAdmin._id); //genarate token and set cookie
      //set user in redis cache
      await redisClient.setEx(
        newAdmin.username,
        1800,
        JSON.stringify(newAdmin)
      );

      res.status(201).json(newAdmin);
    }
  } catch (error) {
    console.log(`Error in auth.controller.signup => ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //validations
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide Credentiols" });
    }

    //check if user exists in redis cache
    const data = await redisClient.get(username);
    const adminCache = JSON.parse(data);
    const pw = await bcrypt.compare(password, adminCache.password);
    if (adminCache && pw) {
      console.log("User found in cache");
      genarateTokenAndSetCookie(res, adminCache._id);
      return res.status(200).json(adminCache);
    }

    //check if user exists in database
    const admin = await Admin.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!admin || !isPasswordCorrect) {
      return res.status(400).json({ message: "User credentiols wrong" });
    }

    //set user in redis cache
    await redisClient.setEx(admin.username, 1800, JSON.stringify(admin));
    genarateTokenAndSetCookie(res, admin._id); //genarate token and set cookie

    const logedAdmin = await Admin.findById(admin._id).select("-password");
    return res.status(200).json(logedAdmin); //send response
  } catch (error) {
    console.log(`Error in auth.controller.login => ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    console.log(`Error in auth.controller.logout => ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
