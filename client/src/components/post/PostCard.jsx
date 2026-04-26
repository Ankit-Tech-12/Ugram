import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

import {
  toggleLikeLocal,
  toggleLikePost,
} from "../../features/post/postSlice.js";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  const handleLike = () => {
    if (!post?._id) return;

    // ⚡ optimistic update
    dispatch(toggleLikeLocal(post._id));

    // 🔥 backend sync
    dispatch(toggleLikePost(post._id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-card p-4 rounded-2xl border border-border shadow-lg transition"
    >
      {/* 👤 User */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.owner?.profileImage || "/default-avatar.png"}
          alt="user"
          className="w-10 h-10 rounded-full object-cover border border-border"
        />
        <p className="font-medium text-sm sm:text-base">
          {post.owner?.username || "unknown"}
        </p>
      </div>

      {/* 📸 Image */}
      <div className="relative w-full h-60 rounded-xl overflow-hidden mb-3 group">
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
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleLike}
        >
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