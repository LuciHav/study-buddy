import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function NavButton({ children, to, ...props }) {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(to)} {...props}>
      {children}
    </Button>
  );
}
