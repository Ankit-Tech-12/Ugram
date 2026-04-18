import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getMyPosts } from "../features/post/postApi";

const Profile = () => {
  // 🧠 user (later replace with real user)
  const user = {
    username: "anii",
    fullName: "Anii G",
    profileImage:
      "https://i.pravatar.cc/150?img=1",
    bio: "Building something cool 😏",
    followers: 120,
    following: 80,
  };

  // 🧠 state (MUST be inside component)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getMyPosts();

        // ⚠️ adjust based on your backend response
        setPosts(res.data); 
        // OR: setPosts(res.data.data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* 👤 Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8"
        >
          {/* Profile Image */}
          <img
            src={user.profileImage}
            alt="profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
          />

          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">
              {user.username}
            </h2>

            <p className="text-subtext text-sm mt-1">
              {user.fullName}
            </p>

            <p className="text-sm mt-2">{user.bio}</p>

            {/* Stats */}
            <div className="flex gap-4 mt-3 justify-center sm:justify-start">
              <span className="text-sm">
                <strong>{posts.length}</strong> posts
              </span>
              <span className="text-sm">
                <strong>{user.followers}</strong> followers
              </span>
              <span className="text-sm">
                <strong>{user.following}</strong> following
              </span>
            </div>
          </div>
        </motion.div>

        {/* 📸 Posts Grid */}
        {loading ? (
          <p className="text-center text-subtext">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-subtext">No posts yet 😏</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="w-full aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;