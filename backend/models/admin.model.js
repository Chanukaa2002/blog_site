import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilepic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamp: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
