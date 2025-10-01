import { Navigate } from "react-router-dom";
import useAuthStore from "../components/stores/useAuthStore.jsx";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  // No user: allow access to public page
  return children;
};

export default PublicRoute;
