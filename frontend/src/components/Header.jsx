import Logo from "./Logo";
import Navbar from "./Navbar";
import UserActions from "./UserActions";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 min-h-16 border-b">
      <Logo />
      <Navbar />
      <UserActions />
    </header>
  );
}
