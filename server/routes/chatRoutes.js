// server/routes/chatRoutes.js
import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// Save a new chat message
router.post("/", async (req, res) => {
  const { from, to, text } = req.body;

  if (!from || !to || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMsg = new Chat({ from, to, text });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Get all chat messages between two users
router.get("/:from/:to", async (req, res) => {
  const { from, to } = req.params;

  try {
    const messages = await Chat.find({
      $or: [
        { from, to },
        { from: to, to: from }, // both directions
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

export default router;
