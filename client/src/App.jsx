import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

import { fetchCurrentUser } from "./features/auth/authSlice";

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