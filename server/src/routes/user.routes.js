import { Router } from "express";
import * as userControllers from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 Auth
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

// 🔒 Protected
router.post("/logout", verifyJWT, userControllers.logOutUser);

router.get("/me", verifyJWT, userControllers.getCurrentUser);

// 👤 Profile
router.get("/:username", verifyJWT, userControllers.getUserProfile);

router.patch(
  "/update",
  verifyJWT,
  userControllers.updateAccountDetail
);

router.patch(
  "/profile-image",
  verifyJWT,
  upload.single("profileImage"),
  userControllers.updateProfileImage
);

export default router;