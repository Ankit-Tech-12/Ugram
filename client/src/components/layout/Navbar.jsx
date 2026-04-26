import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Home,
  PlusSquare,
  User,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";

import ThemeToggle from "../ui/ThemeToggle";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Create", path: "/create", icon: <PlusSquare size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

//   useEffect(() => {
//   const handleClick = () => setDropdownOpen(false);
//   window.addEventListener("click", handleClick);

//   return () => window.removeEventListener("click", handleClick);
// }, []);

  // 🚪 logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 backdrop-blur-lg bg-white/5 dark:bg-black/20 border-b border-border"
    >
      {/* 🔗 Logo */}
      <Link to="/" className="text-lg sm:text-xl font-bold text-primary">
        SocialApp 
      </Link>

      {/* 🧭 Desktop Nav */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 ${
              pathname === link.path ? "text-primary" : "hover:text-primary"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      {/* ⚙️ Right Section */}
      <div className="flex items-center gap-3 relative">
        <ThemeToggle />

        {/* 👤 Avatar */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full overflow-hidden bg-primary/30 flex items-center justify-center"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "A"}
            </span>
          )}
        </button>

        {/* 👇 Dropdown */}
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 top-12 bg-card border border-border rounded-xl shadow-lg w-40 p-2"
          >
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg"
            >
              <User size={16} />
              Profile
            </Link>

            <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer">
              <Settings size={16} />
              Settings
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-lg w-full"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}

        {/* 📱 Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-card border-b border-border flex flex-col items-center gap-4 py-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 ${
                pathname === link.path ? "text-primary" : "hover:text-primary"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;