import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
//imports
import AuthRouter from "./routers/auth.route.js";
import cookieParser from "cookie-parser";

//app configs
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//routes
app.use("/api/auth", AuthRouter);

//init
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running in PORT => ${PORT}`);
});
