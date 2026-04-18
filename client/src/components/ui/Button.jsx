import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  // variants for styling
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-accent shadow-lg shadow-purple-500/20",

    secondary:
      "bg-card text-text border border-border hover:bg-white/5",

    ghost:
      "text-text hover:bg-white/10",
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;