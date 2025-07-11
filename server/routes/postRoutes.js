// server/routes/postRoutes.js
import express from "express";
import {
  createPost,
  getAllPosts,
  deletePost,
  likePost,
  commentOnPost,
  upload,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", upload.single("image"), createPost);
router.get("/", getAllPosts);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.post("/:id/comment", commentOnPost);

export default router;
