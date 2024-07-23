import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  createPost,
  upload
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all posts on the feed (requires authentication)
router.get("/", verifyToken, getFeedPosts);

// Get all posts for a specific user (requires authentication)
router.get("/:userId/posts", verifyToken, getUserPosts);

// Like a specific post (requires authentication)
router.patch("/:id/like", verifyToken, likePost);

// Create a new post (requires authentication and file upload)
router.post("/", verifyToken, upload.single('picture'), createPost);

export default router;
