import { useState } from "react";
import { useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [burst, setBurst] = useState(false);

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

  // heart-burst on double tap, reuses the same like handler
  const handleDoubleTap = () => {
    if (!post.isLiked) handleLike();
    setBurst(true);
    setTimeout(() => setBurst(false), 650);
  };

  //  Follow / Unfollow
  const handleFollow = async () => {
    if (!post?.owner?._id) return;

    // Optimistic update
    dispatch(toggleFollowLocal(post.owner._id));

    // Backend sync
    const result = await dispatch(toggleFollowing(post.owner._id));

    // Revert if request failed
    if (toggleFollowing.rejected.match(result)) {
      dispatch(toggleFollowLocal(post.owner._id));
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative bg-card rounded-[26px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_28px_-10px_rgba(0,0,0,0.16)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_20px_44px_-14px_rgba(0,0,0,0.22)] transition-shadow duration-300"
    >
      {/* 📸 Image — full bleed, everything floats on top of it */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-[5/4] overflow-hidden bg-bg cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.image}
          alt="post"
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />

        {/* scrim so the floating text/controls stay legible on any photo */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

        {/* 👤 user — floating glass pill, bottom-left on the image */}
        <Link
          to={`/users/${post.owner?._id}`}
          className="absolute left-3.5 bottom-3.5 flex items-center gap-2 max-w-[65%]"
        >
          <img
            src={post.owner?.profileImage || "/default-avatar.png"}
            alt="user"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/40 shrink-0"
          />
          <span className="text-white text-sm font-medium tracking-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {post.owner?.username || "Unknown"}
          </span>
        </Link>

        {/* follow — small glass toggle, top-right */}
        <button
          onClick={handleFollow}
          className={`absolute top-3.5 right-3.5 text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full backdrop-blur-md border transition-colors ${
            post.owner?.isFollowing
              ? "bg-white/10 border-white/25 text-white/90 hover:bg-white/15"
              : "bg-white/90 border-white/90 text-black hover:bg-white"
          }`}
        >
          {post.owner?.isFollowing ? "Following" : "Follow"}
        </button>

        {/* ❤️ like — floating glass capsule, bottom-right */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleLike}
          className="absolute right-3.5 bottom-3.5 flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full backdrop-blur-md bg-black/30 border border-white/15 text-white"
        >
          <Heart
            size={15}
            className={`transition-all duration-200 ${
              post.isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"
            }`}
          />
          <span className="text-xs font-semibold tabular-nums">
            {post.likesCount || 0}
          </span>
        </motion.button>

        {/* double-tap heart burst */}
        <AnimatePresence>
          {burst && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart size={84} className="text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✍️ Caption — quiet, on the card surface, not the photo */}
      {post.caption && (
        <p className="px-5 py-4 text-[13.5px] leading-relaxed">
          <span className="font-semibold text-text mr-1.5">
            {post.owner?.username}
          </span>
          <span className="text-subtext">{post.caption}</span>
        </p>
      )}
    </motion.article>
  );
};

export default PostCard;