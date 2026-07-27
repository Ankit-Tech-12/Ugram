import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, ImageOff } from "lucide-react";

import Skeleton from "../components/ui/Skeleton.jsx";
import PostCard from "../components/post/PostCard.jsx";
import { fetchFeedPosts } from "../features/post/postSlice.js";

const Home = () => {
  const dispatch = useDispatch();

  const { posts = [], loading, error } = useSelector(
    (state) => state.post
  );

  // 🔄 fetch posts on mount
  useEffect(() => {
    dispatch(fetchFeedPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* subtle top hairline, sits under any app header */}
      <div className="sticky top-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* 🔄 Loading */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-3 p-4 bg-card rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-32 h-4" />
                </div>

                <Skeleton className="w-full h-60 rounded-xl" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        )}

        {/* ❌ Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 text-center py-20 px-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <ImageOff size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Couldn't load your feed</p>
              <p className="text-xs text-subtext mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchFeedPosts())}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 hover:text-primary transition-colors"
            >
              <RefreshCcw size={13} />
              Try again
            </button>
          </div>
        )}

        {/* 😴 Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-center py-24 px-6">
            <p className="text-3xl">🪴</p>
            <p className="text-sm font-medium text-text">Your feed is quiet right now</p>
            <p className="text-xs text-subtext max-w-[22ch]">
              Follow a few people, or check back once new posts land.
            </p>
          </div>
        )}

        {/* ✅ Posts */}
        {!loading && !error && posts.length > 0 && (
          <AnimatePresence>
            <div className="space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 5) * 0.05 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

export default Home;