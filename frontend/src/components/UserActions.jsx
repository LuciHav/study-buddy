import { ModeToggle } from "./ModeTogge";
import NavButton from "./NavButton";
import { Input } from "./ui/input";

export default function UserActions() {
  return (
    <div className="flex items-center space-x-4">
      <Input type="search" placeholder="Search..." className="w-48" />
      <NavButton to="/login" variant="outline">
        Log In
      </NavButton>
      <NavButton to="/signup">Sign Up</NavButton>
      <ModeToggle />
    </div>
  );
}
