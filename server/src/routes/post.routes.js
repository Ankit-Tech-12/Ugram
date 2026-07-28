import { Router } from "express";
import * as postControllers from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// 📸 Create Post
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  postControllers.uploadPost
);

// Delete Post
router.delete("/:postId/deletePost",verifyJWT ,postControllers.deletePost)

// 📰 Feed (other users)
router.get("/", verifyJWT, postControllers.feeds);

// 👤 My posts
router.get("/profile", verifyJWT, postControllers.getUserFeeds);

//Likes
router.post("/:postId/like", verifyJWT, postControllers.toggleLike);

export default router;