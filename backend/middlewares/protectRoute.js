import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unautherized: No Token Provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "Unautherized: Invalid Token" });
    }

    const admin = await Admin.findById(decode.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Please login first" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};
