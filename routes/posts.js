import express from "express";
import  {getFeedPosts, getUserPosts,likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
//  after verifying the token it gives feedPost of all in feed
router.get("/:userId/posts", verifyToken, getUserPosts);
//  arter verifing it gives user posts of the selected user


router.patch("/:id/like", verifyToken, likePost);

export default router;