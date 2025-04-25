import { Menu } from "lucide-react";
import Logo from "./Logo";
import Navbar from "./Navbar";
import UserActions from "./UserActions";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 min-h-16 border-b">
      <Logo />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-6">
              <Navbar />
            </div>
          </SheetContent>
        </Sheet>
        <UserActions />
      </div>
    </header>
  );
}
