import { useState, useEffect } from "react";
import Skeleton from "../components/ui/Skeleton";
import PostCard from "../components/post/PostCard";
import { getFeedPosts } from "../features/post/postApi";

const Home = () => {
  // 🧠 state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getFeedPosts();

        // ⚠️ adjust based on backend response
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
      
      {/* Feed Container */}
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* 🔄 Loading State */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-3 p-4 bg-card rounded-2xl"
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-32 h-4" />
                </div>

                {/* Image */}
                <Skeleton className="w-full h-60 rounded-xl" />

                {/* Caption */}
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          
          <p className="text-center text-subtext">
            No posts yet 😴
          </p>

        ) : (
          
          /* ✅ Real Posts */
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