import useAuth from "@/contexts/AuthProvider";
import { ROLES } from "@/constants";
import Home from "@/pages/Home";
import { Navigate } from "react-router";

export default function IndexRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Home />;
  }

  switch (currentUser.role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    case ROLES.TUTOR:
      return <Navigate to="/tutor" replace />;
    case ROLES.USER:
    default:
      return <Home />;
  }
}
