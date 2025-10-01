import { Navigate } from "react-router-dom";
import useAuthStore from "../components/stores/useAuthStore.jsx";
import { useEffect, useState } from "react";

const AllowedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      profile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  if (loading) {
    return <p>Redirecting...</p>;
  }

  // First check if user exists
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Then check role if needed
  if (!user.role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the children
  return children;
};

export default AllowedRoute;
