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
      name: "Bookings",
      href: "/bookings",
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
    <nav className="flex">
      <ul className="flex md:items-center md:space-x-10 flex-col md:flex-row space-y-4 md:space-y-0 w-full">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                } hover:text-primary transition-colors`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
