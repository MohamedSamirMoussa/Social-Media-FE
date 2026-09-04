import type { ProtectedRouteProps } from "../ProtectedRoute/ProtectedRoute";
import { useAppSelector } from "../../hooks/hooks";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (isAuthenticated || user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default GuestRoute;
