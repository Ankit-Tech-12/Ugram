import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.SECURE,
  sameSite: process.env.SAMESITE,
};

const formatUser = (user, currentUserId = null) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    bio: user.bio,
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,

    ...(currentUserId && {
      isFollowing: user.followers.some(
        (id) => id.toString() === currentUserId.toString()
      ),
    }),
  };
};

// ─────────────────────────────────────────────
// 🔐 TOKEN GENERATION
// ─────────────────────────────────────────────
const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ─────────────────────────────────────────────
// 📝 REGISTER
// ─────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exists) throw new ApiError(409, "User already exists");

  const imagePath = req.files?.profileImage?.[0]?.path;

  if (!imagePath) throw new ApiError(400, "Profile image required");

  const uploaded = await uploadOnCloudinary(imagePath);

  if (!uploaded) throw new ApiError(400, "Image upload failed");

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    profileImage: uploaded.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered"));
});

// ─────────────────────────────────────────────
// 🔑 LOGIN
// ─────────────────────────────────────────────
const logInUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Enter username or email");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.isPasswordCorrect(password);

  if (!isValid) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  // const safeUser = await User.findById(user._id).select(
  //   "-password -refreshToken"
  // );
  const safeUser = formatUser(user);
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { user: safeUser }, "Login successful")
    );
});

// ─────────────────────────────────────────────
// 🚪 LOGOUT
// ─────────────────────────────────────────────
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: "" },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out"));
});

// ─────────────────────────────────────────────
// 🔄 REFRESH TOKEN
// ─────────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) throw new ApiError(401, "No refresh token");

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newToken } =
      await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newToken, cookieOptions)
      .json(
        new ApiResponse(200, { accessToken }, "Token refreshed")
      );
  } catch {
    throw new ApiError(401, "Expired or invalid token");
  }
});

// ─────────────────────────────────────────────
// 👤 CURRENT USER
// ─────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {

  const safeUser = formatUser(req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, safeUser, "Current user"));
});

// targetUser
const getTargetUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const result = formatUser(user, req.user._id);

  res.status(200).json(
    new ApiResponse(200, result, "Profile Fetched of target user")
  )
});
// ─────────────────────────────────────────────
// ✏️ UPDATE PROFILE
// ─────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { username, fullName, bio } = req.body;

  const updates = {};

  // Update username
  if (username !== undefined) {
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername) {
      throw new ApiError(400, "Username cannot be empty");
    }

    // Only check if username has actually changed
    if (trimmedUsername !== req.user.username) {
      const existingUser = await User.findOne({
        username: trimmedUsername,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        throw new ApiError(409, "Username already exists");
      }
    }

    updates.username = trimmedUsername;
  }

  // Update full name
  if (fullName !== undefined) {
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      throw new ApiError(400, "Full name cannot be empty");
    }

    updates.fullName = trimmedFullName;
  }

  // Update bio (allow empty string to remove bio)
  if (bio !== undefined) {
    updates.bio = bio.trim();
  }

  // No fields to update
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No changes provided");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, formatUser(user), "Profile updated successfully")
  );
});

// ─────────────────────────────────────────────
// 📸 UPDATE PROFILE IMAGE
// ─────────────────────────────────────────────
const updateProfileImage = asyncHandler(async (req, res) => {
  const path = req.file?.path;

  if (!path) throw new ApiError(400, "Image required");

  const oldProfileImage = req.user.profileImage;
  const uploaded = await uploadOnCloudinary(path);

  if (!uploaded?.url) {
    throw new ApiError(500, "Failed to upload profile image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { profileImage: uploaded.url } },
    { new: true }
  ).select("-password -refreshToken");

  // console.log("Old Image:", oldProfileImage);

  try {
    const result = await deleteFromCloudinary(oldProfileImage);
    // console.log("Delete Result:", result);
  } catch (err) {
    console.error("Delete Error:", err);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, formatUser(user), "Profile updated"));
});

// ─────────────────────────────────────────────
// 🔍 USER PROFILE
// ─────────────────────────────────────────────
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(404, "User not found");

  const postsCount = await Post.countDocuments({
    owner: user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { user, postsCount },
      "Profile fetched"
    )
  );
});


// Following system
const toggleFollowing = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  //prevent current user to follow itself
  if (currentUserId === userId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(userId);

  //check if both user is exists 
  if (!currentUser || !targetUser) {
    throw new ApiError(404, "User not found");
  }

  const isFollowing = currentUser.following.some(
    (id) => id.toString() === userId
  );

  if (!isFollowing) {
    currentUser.following.push(userId);
    targetUser.followers.push(currentUserId);

  } else {
    currentUser.following.pull(userId);
    targetUser.followers.pull(currentUserId);

  }

  await currentUser.save({ validateBeforeSave: false });
  await targetUser.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isFollowing: !isFollowing,
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      },
      isFollowing
        ? "User unfollowed successfully"
        : "User followed successfully"
    )
  );
});

export {
  registerUser,
  logInUser,
  logOutUser,
  refreshToken,
  getCurrentUser,
  updateProfile,
  updateProfileImage,
  getUserProfile,
  toggleFollowing,
  getTargetUser
};