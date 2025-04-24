import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", to: "/" },
        { name: "Posts", to: "/posts" },
        { name: "Tutors", to: "/tutors" },
        { name: "Bookings", to: "/bookings" },
      ],
    },
    {
      title: "About",
      links: [
        { name: "About Us", to: "/about-us" },
        { name: "Contact Us", to: "/contact-us" },
        { name: "Privacy Policy", to: "/privacy-policy" },
        { name: "Terms of Service", to: "/terms-of-service" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", to: "/contact-us" },
        { name: "FAQ", to: "/" },
        { name: "Report Issue", to: "/contact-us" },
      ],
    },
  ];

  return (
    <footer className="bg-card text-card-foreground border-t mt-auto py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Study Buddy</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your ultimate platform for connecting students with tutors and
              creating a collaborative learning environment.
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Social Media Icons */}
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Study Buddy. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-muted-foreground">
              Built with ❤️ for students and educators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
