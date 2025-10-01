import { Navigate } from "react-router-dom";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch profile if user is not already loaded
    if (!user) {
      profile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  if (loading) {
    return <p>Redirecting...</p>;
  }

  // If user is not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin" && user.role !== "moderator") {
    return <Navigate to="/" replace />;
  }

  // If user is admin
  return children;
};

export default AdminRoute;
