import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  toggleLikeLocal,
  toggleLikePost,
  toggleFollowLocal,
} from "../../features/post/postSlice.js";

import { toggleFollowing } from "../../features/user/userSlice.js";

import { fetchCurrentUser } from "../../features/auth/authSlice.js";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  //  Like
  const handleLike = async () => {
    if (!post?._id) return;

    // Optimistic update
    dispatch(toggleLikeLocal(post._id));

    // Backend sync
    const result = await dispatch(toggleLikePost(post._id));

    // Revert if request failed
    if (toggleLikePost.rejected.match(result)) {
      dispatch(toggleLikeLocal(post._id));
    }
  };

  //  Follow / Unfollow
  const handleFollow = async () => {
    if (!post?.owner?._id) return;

    // Optimistic update
    dispatch(toggleFollowLocal(post.owner._id));

    // Backend sync
    const result = await dispatch(toggleFollowing(post.owner._id));

  //   if (toggleFollowing.fulfilled.match(result)) {
    
  // }

    // Revert if request failed
    if (toggleFollowing.rejected.match(result)) {
      dispatch(toggleFollowLocal(post.owner._id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-card p-4 rounded-2xl border border-border shadow-lg transition"
    >
      {/* 👤 User */}
      <div className="flex items-center justify-between mb-3">
        <Link
          to={`/users/${post.owner?._id}`}
          className="flex items-center gap-3"
        >
          <img
            src={post.owner?.profileImage || "/default-avatar.png"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border border-border cursor-pointer"
          />

          <p className="font-medium text-sm sm:text-base hover:underline">
            {post.owner?.username || "Unknown"}
          </p>
        </Link>

        <button
          onClick={handleFollow}
          className={`text-sm font-medium px-4 py-1 rounded-full transition ${
            post.owner?.isFollowing
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-primary text-white hover:opacity-90"
          }`}
        >
          {post.owner?.isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* 📸 Image */}
      <div className="relative w-full rounded-xl overflow-hidden mb-3 group">
        <img
          src={post.image}
          alt="post"
          className="w-full h-full object-cover"
        />

        {/* subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
      </div>

      {/* ❤️ Like */}
      <div className="flex items-center gap-3 mb-2">
        <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike}>
          <Heart
            size={24}
            className={`transition-all duration-200 ${
              post.isLiked
                ? "text-red-500 fill-red-500 scale-110"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
        </motion.button>

        <span className="text-sm font-medium">
          {post.likesCount || 0} likes
        </span>
      </div>

      {/* ✍️ Caption */}
      {post.caption && (
        <p className="text-sm text-subtext leading-relaxed">
          {post.caption}
        </p>
      )}
    </motion.div>
  );
};

export default PostCard;