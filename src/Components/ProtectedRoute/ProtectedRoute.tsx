import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
