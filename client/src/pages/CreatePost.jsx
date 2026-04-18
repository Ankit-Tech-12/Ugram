import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createPost } from "../features/post/postApi";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  const navigate = useNavigate(); // ✅ FIX

  // 📸 handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🧠 cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("caption", caption);

      const res = await createPost(formData);

      console.log("Post created:", res);

      navigate("/"); // ✅ now works

    } catch (err) {
      console.log(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-5 rounded-2xl border border-border shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Create Post 📸
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-subtext">
                Upload Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="w-full h-60 sm:h-72 rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Caption */}
            <Input
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something..."
            />

            <Button type="submit" className="w-full">
              Post
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;