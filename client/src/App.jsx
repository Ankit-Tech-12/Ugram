import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import { fetchCurrentUser } from "./features/auth/authSlice.js";

function App() {
  const dispatch = useDispatch();

  // 🔐 auto login (check user on refresh)
  useEffect(() => {
  const isAuthPage =
    window.location.pathname === "/login" ||
    window.location.pathname === "/register";

  if (!isAuthPage) {
    dispatch(fetchCurrentUser());
  }
}, [dispatch]);

  return (
    <Routes>

      {/* 🔓 Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreatePost />} />
      </Route>

    </Routes>
  );
}

export default App;