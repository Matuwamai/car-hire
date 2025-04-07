import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "CAR_OWNER" | "ORGANIZATION")[];
}
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
