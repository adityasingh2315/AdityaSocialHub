// server/controllers/postController.js
import Post from "../models/Post.js";
import fs from "fs";
import multer from "multer";
import mongoose from "mongoose";

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

export const createPost = async (req, res) => {
  try {
    const { caption, userId } = req.body;

    if (!caption || !userId || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imageUrl = `uploads/${req.file.filename}`;

    const post = new Post({
      caption,
      imageUrl,
      user: userId,
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    res.status(500).json({ error: "Post creation failed: " + err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username")
      .populate("likes", "username")
      .populate("comments.user", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: alreadyLiked ? "Unliked" : "Liked", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || !text || !userId) {
      return res.status(400).json({ error: "Invalid comment data" });
    }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      text,
      user: userId,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
