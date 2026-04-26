import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getMyPosts } from "../features/post/postApi";
import Skeleton from "../components/ui/Skeleton";

const Profile = () => {
  // ✅ get user from Redux
  const { user } = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* 👤 PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10"
        >
          {/* Profile Image */}
          <div className="relative">
            <img
              src={user?.profileImage}
              alt="profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary shadow-lg"
            />

            {/* glow effect */}
            <div className="absolute inset-0 rounded-full border border-primary/30 blur-md"></div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">

            <h2 className="text-xl sm:text-2xl font-bold">
              {user?.username}
            </h2>

            <p className="text-subtext text-sm mt-1">
              {user?.fullName}
            </p>

            <p className="text-sm mt-2 text-subtext">
              {user?.bio || "No bio yet "}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="font-semibold">{posts.length}</p>
                <p className="text-xs text-subtext">Posts</p>
              </div>

              <div className="text-center">
                <p className="font-semibold">{user?.followers?.length || 0}</p>
                <p className="text-xs text-subtext">Followers</p>
              </div>

              <div className="text-center">
                <p className="font-semibold">{user?.following?.length || 0}</p>
                <p className="text-xs text-subtext">Following</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔄 LOADING */}
        {loading ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[1,2,3,4,5,6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>

        ) : error ? (
          <p className="text-center text-red-400">{error}</p>

        ) : posts.length === 0 ? (
          <p className="text-center text-subtext">No posts yet 😴</p>

        ) : (

          /* 📸 POSTS GRID */
          <div className="grid grid-cols-3 gap-2 sm:gap-3">

            {posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.05 }}
                className="relative group w-full aspect-square rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay */}
                <div className="
                  absolute inset-0 bg-black/50 opacity-0
                  group-hover:opacity-100 transition
                  flex items-center justify-center text-sm
                ">
                  ❤️ {post.likesCount || 0}
                </div>
              </motion.div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;