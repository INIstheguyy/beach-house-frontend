import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Email", icon: Mail, href: "#" },
];

const serviceLinks = [
  { label: "Vacation Rentals", to: "/properties" },
  { label: "Property Management", to: "/properties" },
  { label: "Concierge Services", to: "/properties" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Terms & Privacy", to: "/terms" },
];

const linkClass = "hover:text-white transition-colors";

const Footer = () => {
  return (
    <footer className="bg-white pb-6 pt-6 md:pb-12">
      {/* px-4 matches the page sections above, so the footer lines up with them */}
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-black px-5 py-10 text-white sm:px-8 md:rounded-[2rem] md:p-10 lg:p-12">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />

          {/* 2 columns on phones (brand on top, links side by side),
              brand + links at tablet, full 4-column row on desktop */}
          <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-12">
            <div className="col-span-2 space-y-5 md:space-y-6">
              <h2 className="font-heading text-2xl font-bold text-accent md:text-3xl">
                Luxury Exxentials.
              </h2>
              <p className="max-w-sm text-sm text-gray-400 md:text-base">
                The premier platform for finding and booking luxury beach houses
                and short-term apartments in Lagos, Nigeria.
              </p>
              <div className="flex gap-3 md:gap-4">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Services">
              <h3 className="mb-4 text-base font-bold md:mb-6 md:text-lg">
                Services
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 md:space-y-4 md:text-base">
                {serviceLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company">
              <h3 className="mb-4 text-base font-bold md:mb-6 md:text-lg">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 md:space-y-4 md:text-base">
                {companyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center text-sm text-gray-500 md:mt-16 md:flex-row md:justify-between md:pt-8 md:text-left">
            <p>© {new Date().getFullYear()} Luxury Exxentials.</p>
            <p>Designed with ❤️ by inistheguyy</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
