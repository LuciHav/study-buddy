import { NavLink } from "react-router";

export default function Navbar() {
  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Posts",
      href: "/posts",
    },
    {
      name: "Tutors",
      href: "/tutors",
    },
    {
      name: "About",
      href: "/about-us",
    },
    {
      name: "Contact",
      href: "/contact-us",
    },
  ];

  return (
    <nav>
      <ul className="flex items-center space-x-10">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={({ isActive }) => (isActive ? "font-semibold" : "")}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
