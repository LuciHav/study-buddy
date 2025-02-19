import useAuth from "@/contexts/AuthProvider";
import { ModeToggle } from "./ModeTogge";
import NavButton from "./NavButton";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function UserActions() {
  const { currentUser, clearUser } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <Input type="search" placeholder="Search..." className="w-48" />
      {currentUser ? (
        <>
          <Avatar>
            <AvatarImage src={currentUser?.image} />
            <AvatarFallback>{`${currentUser.firstName.charAt(
              0
            )}${currentUser.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <NavButton to="/login" onClick={clearUser}>
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
