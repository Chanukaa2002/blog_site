import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import redisClient from "../utils/redis.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate().select("-password");

    if (posts.length > 0) {
      return res.status(200).json({ posts });
    }

    return res.status(404).json({ message: "No posts found" });
  } catch (error) {
    console.log(`Error in post.controller.getAllPosts => ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    let post;
    post = await redisClient.get(postId);
    if (post) {
      return res.status(200).json({ post: JSON.parse(post) });
    }

    post = await Post.findById(postId).populate().select("-password");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await redisClient.setEx(postId, 1800, JSON.stringify(post));
    return res.status(200).json({ post });
  } catch (error) {
    console.log(`Error in post.controller.getPost => ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const adminId = req.admin._id.toString();

    const newPost = new Post({
      title,
      content,
      image,
      category,
      auther: adminId,
    });

    if (newPost) {
      await newPost.save();
      //todo-----------------------------------------------------> add redis caches
      // const addedPost = await Post.findById(newPost._id)
      //   .populate()
      //   .select("-password");
      // await redisClient.setEx(addedPost._id, 1800, JSON.stringify(addedPost));
      return res
        .status(201)
        .json({ message: "Post created successfully", newPost });
    } else {
      res.status(400).json({ message: "Post was not created" });
    }
  } catch (error) {
    const stackLines = error.stack.split("\n");
    const errorLocation = stackLines[1]?.trim(); // Second line contains the relevant file and line info
    console.error(`Error in post.controller.createPost at ${errorLocation}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.auther.toString() !== req.admin._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }


    // Update the post
    post.title = title;
    post.content = content;
    post.category = category;
    post.image = image || post.image; // Use the new image or retain the old one

    const updatedPost = await post.save();

    // Update the cache
    //todo ------------------------------------------------------------------------> add redis caches
    // await redisClient.setEx(postId, 1800, JSON.stringify(updatedPost));

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error in post.controller.editPost =>", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error in post.controller.deletePost => ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

//todo ---------------->create a new controller for post/get add like and comment
//todo----------------->create a new controller for filter post by category(sorting algorithms)
