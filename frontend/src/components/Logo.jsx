import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/">
      {/* <img className="h-15 min-w-15 object-contain" src="./logo.png" /> */}
      <span className="text-2xl uppercase font-bold ">Study Buddy</span>
    </Link>
  );
}
