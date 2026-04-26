import { Router } from "express";
import * as userControllers from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ─────────────────────────────────────────────
// 🔐 AUTH ROUTES
// ─────────────────────────────────────────────

router.post(
  "/register",
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  userControllers.registerUser
);

router.post("/login", userControllers.logInUser);
router.post("/refresh-token", userControllers.refreshToken);
router.post("/logout", verifyJWT, userControllers.logOutUser);


// ─────────────────────────────────────────────
// 👤 CURRENT USER (ME)
// ─────────────────────────────────────────────

router.get("/me", verifyJWT, userControllers.getCurrentUser);

router.patch(
  "/me",
  verifyJWT,
  userControllers.updateAccountDetail
);

router.patch(
  "/me/profile-image",
  verifyJWT,
  upload.single("profileImage"),
  userControllers.updateProfileImage
);


// ─────────────────────────────────────────────
// 🔍 PUBLIC PROFILE
// ─────────────────────────────────────────────

router.get(
  "/profile/:username",
  verifyJWT, // optional: you can remove this if public
  userControllers.getUserProfile
);

export default router;