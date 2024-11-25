import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    auther: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamp: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
