import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // ⏳ while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-subtext">
        Checking authentication...
      </div>
    );
  }

  // 🔒 not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;