import { Router } from "express";
import {
  uploadPost,
  feeds,
  getUserFeeds
} from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// 📸 Create Post
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  uploadPost
);

// 📰 Feed (other users)
router.get("/", verifyJWT, feeds);

// 👤 My posts
router.get("/me", verifyJWT, getUserFeeds);

// router.patch("/:postId/like", verifyJWT, toggleLike);

export default router;