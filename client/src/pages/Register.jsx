import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profileImage: null, // 🧠 important
  });

  const [errors, setErrors] = useState({});

  // handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setForm((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  // validation
  const validate = () => {
    let newErrors = {};

    if (!form.fullName) newErrors.fullName = "Full name required";
    if (!form.username) newErrors.username = "Username required";

    if (!form.email) {
      newErrors.email = "Email required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password required";
    } else if (form.password.length < 6) {
      newErrors.password = "Min 6 characters";
    }

    if (!form.profileImage) {
      newErrors.profileImage = "Profile image required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Form Data:", form);

      // 🧠 later:
      // const formData = new FormData();
      // formData.append("fullName", form.fullName);
      // formData.append("profileImage", form.profileImage);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {/* 📸 Profile Image Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-subtext">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-text"
            />

            {errors.profileImage && (
              <span className="text-xs text-red-400">
                {errors.profileImage}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full mt-2">
            Register
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;