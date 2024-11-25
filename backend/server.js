import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
//imports
import AuthRouter from "./routers/auth.route.js";
import PostRouter from "./routers/post.route.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

//app configs
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/auth", AuthRouter);
app.use("/api/post", PostRouter);

//init
app.listen(PORT, () => {
  try {
    connectDB();
    console.log(`Server running in PORT => ${PORT}`);
  } catch (error) {
    console.log(`Error in Server.app.listen => ${error}`);
  }
});
