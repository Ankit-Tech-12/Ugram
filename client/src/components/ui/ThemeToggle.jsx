import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="
        flex items-center justify-center
        w-10 h-10 sm:w-11 sm:h-11
        rounded-xl

        bg-card border border-border
        text-lg

        transition-all duration-300
      "
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </motion.button>
  );
};

export default ThemeToggle;