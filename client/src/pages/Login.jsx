import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authAPI";

const Login = () => {
  // 🧠 Step 1: State (store form data)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // 🧠 Step 2: Error state (for validation)
  const [errors, setErrors] = useState({});

  // 🧠 Step 3: Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🧠 Step 4: Validation
  const validate = () => {
    let newErrors = {};

    // Email check
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Enter valid email";
    }

    // Password check
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // 🧠 Step 5: Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const data = await loginUser({
      email: form.email,
      password: form.password,
    });

    console.log("Login Success:", data);

    // 👉 temporary store (later Redux)
    localStorage.setItem("user", JSON.stringify(data.user));

    // 👉 redirect to home
    navigate("/");

  } catch (error) {
    console.log(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        px-4
        bg-gradient-to-br from-black via-purple-900 to-black
      "
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          w-full max-w-md
          p-6 sm:p-8
          rounded-2xl
          backdrop-blur-xl
          bg-white/5 dark:bg-white/10
          border border-border
          shadow-2xl
        "
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-text mb-6">
          Welcome Back 😏
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <Input
            label="Email or Username"
            name="email"
            placeholder="Enter email or username"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {/* Button */}
          <Button type="submit" className="w-full mt-2">
            Login
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs sm:text-sm text-subtext text-center mt-5">
          Don’t have an account?{" "}
          <span className="text-primary cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;