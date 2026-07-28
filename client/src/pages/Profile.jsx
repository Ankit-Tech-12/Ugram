import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { UserPlus, UserCheck, Pencil, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toggleFollowing } from "../features/user/userSlice";
import { getTargetUser } from "../features/user/userSlice";
import { fetchProfilePosts } from "../features/post/postSlice";
import Skeleton from "../components/ui/Skeleton.jsx";
import PostModal from "../components/post/PostModal.jsx";

const Profile = () => {
  // ✅ get user from Redux 
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.users.profile);
  const { profilePosts: posts, loading, error } = useSelector(
    (state) => state.post
  );

  const user = userId ? profile : authUser;
  const isMyProfile = authUser?._id === user?._id;
  const [selectedPostId, setSelectedPostId] = useState(null);

  const selectedPost = posts.find(
    (post) => post._id === selectedPostId
  );
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(getTargetUser(userId));
    }
  }, [dispatch, userId]);


  // 🔄 fetch posts 
  useEffect(() => {
    const targetUserId = userId || authUser?._id;

    if (targetUserId) {
      dispatch(fetchProfilePosts(targetUserId));
    }
  }, [dispatch, userId, authUser]);



  const handleFollow = async () => {
    if (!user) return;

    await dispatch(toggleFollowing(user._id));
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* 👤 PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8"
        >
          {/* Profile Image */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/25 via-primary/10 to-transparent blur-md" />
            <img
              src={user?.profileImage}
              alt={user?.username || "profile"}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-primary/60 ring-offset-2 ring-offset-bg shadow-xl shadow-primary/10"
            />
          </div>

          {/* Info */}
          <div className="flex-1 w-full text-center sm:text-left">

            {/* Name row + action button (desktop: inline, mobile: stacked) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {user?.username}
                </h2>
                <p className="text-subtext text-sm mt-0.5">
                  {user?.fullName}
                </p>
              </div>

              {/* Follow / Edit — desktop position */}
              <div className="hidden sm:block sm:ml-2">
                {isMyProfile ? (
                  <button
                    onClick={() => navigate("/settings/profile")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                      bg-card border border-border text-text
                      hover:bg-border/60 active:scale-[0.97] transition"
                  >
                    <Pencil size={15} />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                      active:scale-[0.97] transition
                      ${user?.isFollowing
                        ? "bg-card border border-border text-text hover:bg-border/60"
                        : "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/30"
                      }`}
                  >
                    {user?.isFollowing ? (
                      <>
                        <UserCheck size={15} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm mt-3 text-subtext max-w-md mx-auto sm:mx-0">
              {user?.bio || "No bio yet"}
            </p>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-10 mt-5 justify-center sm:justify-start">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-base">{posts.length}</p>
                <p className="text-xs text-subtext mt-0.5">Posts</p>
              </div>

              <div className="text-center sm:text-left">
                <p className="font-semibold text-base">{user?.followersCount || 0}</p>
                <p className="text-xs text-subtext mt-0.5">Followers</p>
              </div>

              <div className="text-center sm:text-left">
                <p className="font-semibold text-base">{user?.followingCount || 0}</p>
                <p className="text-xs text-subtext mt-0.5">Following</p>
              </div>
            </div>

            {/* Follow / Edit — mobile position */}
            <div className="sm:hidden mt-5">
              {isMyProfile ? (
                <button
                  onClick={() => navigate("/settings/profile")}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium
                    bg-card border border-border text-text
                    active:scale-[0.98] transition"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium
                    active:scale-[0.98] transition
                    ${user?.isFollowing
                      ? "bg-card border border-border text-text"
                      : "bg-primary text-white shadow-sm shadow-primary/30"
                    }`}
                >
                  {user?.isFollowing ? (
                    <>
                      <UserCheck size={15} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="h-px bg-border/70 mb-6" />

        {/* 🔄 LOADING */}
        {loading ? (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg sm:rounded-xl" />
            ))}
          </div>

        ) : error ? (
          <p className="text-center text-red-400 py-10">{error}</p>

        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-subtext text-sm">No posts yet</p>
          </div>

        ) : (

          /* 📸 POSTS GRID */
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">

            {posts.map((post) => (
              <motion.div
                key={post._id}
                onClick={() => setSelectedPostId(post._id)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="relative group w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden cursor-pointer bg-card"
              >
                {/* Image */}
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay */}
                <div
                  className="
                    absolute inset-0 bg-black/50 opacity-0
                    group-hover:opacity-100 transition
                    flex items-center justify-center gap-1.5 text-sm font-medium text-white
                  "
                >
                  <Heart size={16} className="fill-white" />
                  {post.likesCount || 0}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <PostModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      </div>
    </div>
  );
};

export default Profile;