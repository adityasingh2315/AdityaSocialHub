// server/models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    from: { type: String, required: true }, // sender username
    to: { type: String, required: true },   // receiver username
    text: { type: String, required: true }, // message content
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
