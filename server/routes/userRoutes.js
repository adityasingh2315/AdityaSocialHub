// server/routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret_key", {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Follow / Unfollow user
router.put("/follow", async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    if (currentUserId === targetUserId)
      return res.status(400).json({ error: "You cannot follow yourself" });

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = targetUser.followers.includes(currentUserId);

    if (isFollowing) {
      // Unfollow
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetUserId);
      await targetUser.save();
      await currentUser.save();
      return res.json({ message: "Unfollowed", following: false });
    } else {
      // Follow
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      await targetUser.save();
      await currentUser.save();
      return res.json({ message: "Followed", following: true });
    }
  } catch (err) {
    console.error("❌ Follow error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get user by ID (for profile pages)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error("❌ Fetch user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all users (for suggestions list)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Fetch all users error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
