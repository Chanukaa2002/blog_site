import {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { upload, uploadImageMiddleware } from "../middlewares/imageUpload.js";
import express from "express";

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/:id", getPost);
router.post("/create", protectRoute, upload, uploadImageMiddleware, createPost);
router.put("/edit/:id", protectRoute, upload, uploadImageMiddleware, editPost);
router.delete("/delete/:id", protectRoute, deletePost);

export default router;
