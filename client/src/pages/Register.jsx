import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { registerUser } from "../features/auth/authApi.js";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ validation
  const validate = () => {
    let newErrors = {};

    if (!form.fullName) newErrors.fullName = "Full name required";
    if (!form.username) newErrors.username = "Username required";

    if (!form.email) newErrors.email = "Email required";
    else if (!form.email.includes("@"))
      newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (!form.profileImage)
      newErrors.profileImage = "Profile image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      await registerUser(formData);

      navigate("/login"); // 👉 redirect to login

    } catch (err) {
      setApiError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-purple-900 to-black">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-border shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-text mb-6">
          Create Account 🚀
        </h2>

        {/* 🔴 API Error */}
        {apiError && (
          <p className="text-sm text-red-400 text-center mb-3">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
          <Input label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} />
          <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} />

          {/* 📸 Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-subtext">Profile Image</label>

            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition text-subtext text-sm overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>Click to upload image</span>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {errors.profileImage && (
              <span className="text-xs text-red-400">
                {errors.profileImage}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        {/* 🔗 LOGIN LINK (NEW) */}
        <p className="text-xs sm:text-sm text-subtext text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Register;