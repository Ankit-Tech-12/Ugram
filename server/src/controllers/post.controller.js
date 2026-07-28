import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";


// ─────────────────────────────────────────────
// 📸 CREATE POST
// ─────────────────────────────────────────────
const uploadPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);

  if (!uploadedImage) {
    throw new ApiError(400, "Image upload failed");
  }

  const post = await Post.create({
    image: uploadedImage.url,
    caption: caption || "",
    owner: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, post, "Post created successfully")
  );
});


// ─────────────────────────────────────────────
// 📰 FEEDS (OTHER USERS)
// ─────────────────────────────────────────────
const feeds = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const pipeline = [
    {
      $match: {
        owner: { $ne: userId },
      },
    },

    // 👤 Owner details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              username: 1,
              profileImage: 1,
              followers: 1,
              fullName: 1,
            },
          },
        ],
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // ❤️ Likes users
    // {
    //   $lookup: {
    //     from: "users",
    //     let: { userIds: { $ifNull: ["$likes", []] } },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $in: ["$_id", "$$userIds"] },
    //         },
    //       },
    //       {
    //         $project: {
    //           username: 1,
    //           profileImage: 1,
    //         },
    //       },
    //     ],
    //     as: "likedUsers",
    //   },
    // },

    // 📊 Computed fields
    {
      $addFields: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        isLiked: {
          $in: [userId, { $ifNull: ["$likes", []] }],
        },
        "owner.isFollowing": {
          $in: [userId, "$owner.followers"]
        }
      },
    },

    {
      $project: {
        "owner.followers": 0,
      },
    },

    { $sort: { createdAt: -1 } },
  ];

  const posts = await Post.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(200, posts, "Feeds fetched successfully")
  );
});


// ─────────────────────────────────────────────
// 👤 USER POSTS (PROFILE)
// ─────────────────────────────────────────────
const getUserFeeds = asyncHandler(async (req, res) => {
  const {userId} = req.query;
  const currentUserId = new mongoose.Types.ObjectId(req.user._id);
  const owner = new mongoose.Types.ObjectId(userId || currentUserId);

  const pipeline = [
    {
      $match: {
        owner,
      },
    },

    // 👤 ADD OWNER HERE ALSO (IMPORTANT 🔥)
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              username: 1,
              profileImage: 1,
              fullName: 1,
            },
          },
        ],
        as: "owner",
      },
    },
    { $unwind: "$owner" },

    // ❤️ Likes users
    {
      $lookup: {
        from: "users",
        let: { userIds: { $ifNull: ["$likes", []] } },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$userIds"] },
            },
          },
          {
            $project: {
              username: 1,
              profileImage: 1,
            },
          },
        ],
        as: "likedUsers",
      },
    },

    {
      $addFields: {
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        isLiked: {
          $in: [currentUserId, { $ifNull: ["$likes", []] }],
        },
      },
    },

    { $sort: { createdAt: -1 } },
  ];

  const posts = await Post.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(200, posts, "User posts fetched successfully")
  );
});

//like
const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // unlike
    post.likes.pull(userId);
  } else {
    // like
    post.likes.push(userId);
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(200, {
      liked: !isLiked,
      likesCount: post.likes.length,
    }, "Like toggled")
  );
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  // Try deleting image, but don't stop if it fails
  if (post.image) {
    try {
      await deleteFromCloudinary(post.image);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    }
  }

  await post.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Post deleted successfully")
  );
});

export { 
  uploadPost, 
  feeds, 
  getUserFeeds, 
  toggleLike,
  deletePost 
};