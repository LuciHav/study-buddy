import useAuth from "@/contexts/AuthProvider";
import { useNavigate } from "react-router";
import { ModeToggle } from "./ModeTogge";
import NavButton from "./NavButton";
import { Input } from "./ui/input";
import UserAvatar from "./UserAvatar";

export default function UserActions() {
  const { currentUser, clearUser } = useAuth();
  const navigate = useNavigate();

  function handleSignout() {
    clearUser();
    navigate("/");
  }

  return (
    <div className="flex items-center space-x-4">
      <Input type="search" placeholder="Search..." className="w-48" />
      {currentUser ? (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <UserAvatar user={currentUser} />
          </span>
          <NavButton to="/login" onClick={handleSignout}>
            Log Out
          </NavButton>
        </>
      ) : (
        <>
          <NavButton to="/login" variant="outline">
            Log In
          </NavButton>
          <NavButton to="/signup">Sign Up</NavButton>
        </>
      )}
      <ModeToggle />
    </div>
  );
}
