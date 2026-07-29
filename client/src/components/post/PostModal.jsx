import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, MoreVertical, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deletePost, toggleLikePost } from "../../features/post/postSlice";

const PostModal = ({ post, isOpen, onClose }) => {

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const authUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !post) return null;

    const isOwner = authUser?._id === post.owner?._id;

    const handleLike = () => {
        dispatch(toggleLikePost(post._id));
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        try {
            await dispatch(deletePost(post._id)).unwrap();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && post && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="relative w-full max-w-5xl bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="fixed top-5 right-5 z-[60] p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
                        >
                            <X size={22} />
                        </button>

                        {/* Image */}
                        <div className="md:w-3/5 bg-black flex items-center justify-center">
                            <img
                                src={post.image}
                                alt="Post"
                                className="w-full h-[350px] md:h-[650px] object-contain"
                            />
                        </div>

                        {/* Right Side */}
                        <div className="md:w-2/5 flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.owner?.profileImage}
                                        alt={post.owner?.username}
                                        className="w-11 h-11 rounded-full object-cover"
                                    />

                                    <div>
                                        <h3 className="font-semibold">{post.owner?.username}</h3>
                                        {post.owner?.fullName && (
                                            <p className="text-sm text-subtext">
                                                {post.owner.fullName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {isOwner && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu((prev) => !prev)}
                                            className="p-2 rounded-full hover:bg-border transition"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {showMenu && (
                                            <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-border transition"
                                                >
                                                    <Trash2 size={18} />
                                                    Delete Post
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Caption */}
                            <div className="flex-1 overflow-y-auto p-5">
                                <p className="text-text whitespace-pre-wrap leading-relaxed">
                                    {post.caption || "No caption"}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-border p-5">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleLike}
                                        className="transition-transform active:scale-90 hover:scale-110"
                                    >
                                        <Heart
                                            size={24}
                                            className={`transition-colors ${post.isLiked
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-text hover:text-red-500"
                                                }`}
                                        />
                                    </button>

                                    <span className="font-medium">
                                        {post.likesCount}
                                    </span>

                                    <span className="text-subtext">
                                        {post.likesCount === 1 ? "Like" : "Likes"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PostModal;