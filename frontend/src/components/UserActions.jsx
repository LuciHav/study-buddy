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
    <div className="flex items-center gap-2 md:gap-4">
      <div className="hidden md:block">
        <Input type="search" placeholder="Search..." className="w-48" />
      </div>
      {currentUser ? (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <UserAvatar user={currentUser} />
          </span>
          <div className="hidden md:block">
            <NavButton to="/login" onClick={handleSignout}>
              Log Out
            </NavButton>
          </div>
        </>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <NavButton to="/login" variant="outline">
            Log In
          </NavButton>
          <NavButton to="/signup">Sign Up</NavButton>
        </div>
      )}
      <ModeToggle />
    </div>
  );
}
