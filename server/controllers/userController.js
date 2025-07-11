// server/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all users (for suggestion list)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Follow user
export const followUser = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const { currentUserId } = req.body;

    if (targetId === currentUserId)
      return res.status(400).json({ error: "You can't follow yourself" });

    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ error: "User not found" });

    if (targetUser.followers.includes(currentUserId))
      return res.status(400).json({ error: "Already following" });

    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetId);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Follow failed" });
  }
};

// ✅ Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const { currentUserId } = req.body;

    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ error: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetId
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Unfollow failed" });
  }
};
