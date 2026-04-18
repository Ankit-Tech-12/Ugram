import { useState } from "react";
import { motion } from "framer-motion";

const PostCard = ({ post }) => {
  // 🧠 Initial state from backend
  const [liked, setLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [loading, setLoading] = useState(false);

  // ❤️ Optimistic Like Handler
  const handleLike = async () => {
    if (loading) return; // prevent multiple clicks

    setLoading(true);

    // save previous state (for rollback)
    const prevLiked = liked;

    // 🟢 Optimistic UI update
    setLiked(!liked);
    setLikesCount((prev) =>
      prevLiked ? prev - 1 : prev + 1
    );

    try {
      // 👉 simulate API (replace later)
      await new Promise((res) => setTimeout(res, 500));

      // 👉 later:
      // await axios.post(`/api/posts/${post._id}/like`);

    } catch (error) {
      // 🔴 rollback if API fails
      setLiked(prevLiked);
      setLikesCount((prev) =>
        prevLiked ? prev + 1 : prev - 1
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-card p-4 rounded-2xl
        border border-border
        shadow-lg
      "
    >
      {/* 🧑 User Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post?.owner?.profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <p className="font-medium text-sm sm:text-base">
          {post?.owner?.username}
        </p>
      </div>

      {/* 📸 Post Image */}
      <div className="w-full h-60 sm:h-72 rounded-xl overflow-hidden mb-3">
        <img
          src={post?.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ❤️ Actions */}
      <div className="flex items-center gap-4 mb-2">

        {/* ❤️ Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={loading}
          whileTap={{ scale: 0.8 }}
          animate={{ scale: liked ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`
            text-xl transition
            ${liked ? "text-red-500" : "text-white"}
            ${loading ? "opacity-50" : ""}
          `}
        >
          ❤️
        </motion.button>

        {/* 💬 Comment Button */}
        <button className="text-xl hover:scale-110 transition">
          💬
        </button>
      </div>

      {/* 📊 Likes Count */}
      <p className="text-sm font-medium">
        {likesCount} likes
      </p>

      {/* 📝 Caption */}
      <p className="text-sm text-subtext mt-1">
        <span className="font-medium text-text">
          {post?.owner?.username}
        </span>{" "}
        {post?.caption}
      </p>
    </motion.div>
  );
};

export default PostCard;