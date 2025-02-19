import useAuth from "@/contexts/AuthProvider";
import { ROLES } from "@/constants";
import Home from "@/pages/Home";
import { Navigate } from "react-router";

export default function IndexRoute() {
  const { currentUser } = useAuth();

  if (currentUser?.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  return <Home />;
}
