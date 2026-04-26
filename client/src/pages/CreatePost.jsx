import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createPost } from "../features/post/postApi"; 

const MAX_CAPTION = 150;

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 📸 handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 🔥 validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ❌ remove image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // 🧠 cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✍️ caption change (limit)
  const handleCaptionChange = (e) => {
    if (e.target.value.length <= MAX_CAPTION) {
      setCaption(e.target.value);
    }
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      await createPost(formData);

      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex justify-center px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl py-6"
      >
        <div className="bg-card p-5 rounded-2xl border border-border shadow-xl">

          <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center">
            Create Post 📸
          </h2>

          {/* 🔴 Error */}
          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* 📸 Upload */}
            <div>
              <label className="text-sm text-subtext mb-2 block">
                Upload Image
              </label>

              <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition text-subtext text-sm overflow-hidden">
                
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>Click to upload or drag image</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 text-xs text-red-400 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* ✍️ Caption */}
            <div>
              <Input
                label="Caption"
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Write something..."
              />

              <p className="text-xs text-subtext text-right mt-1">
                {caption.length}/{MAX_CAPTION}
              </p>
            </div>

            {/* 🚀 Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </Button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;