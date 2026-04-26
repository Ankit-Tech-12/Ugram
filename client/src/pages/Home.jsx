import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
      <div className="max-w-2xl mx-auto px-4 py-6">

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
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {/* 😴 Empty */}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-subtext">
            No posts yet 😴
          </p>
        )}

        {/* ✅ Posts */}
        {!loading && !error && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;