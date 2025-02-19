import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { ROLES } from "../constants/index";
import useAuth from "@/contexts/AuthProvider";

export default function AuthRoute({ role = ROLES.USER }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    } else if (role && ![role].flat().includes(currentUser.role)) {
      navigate("/404");
    }
  }, [currentUser, role, navigate]);

  if (!currentUser) return null;

  return <Outlet />;
}
