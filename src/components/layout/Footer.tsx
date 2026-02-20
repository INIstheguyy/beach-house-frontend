import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pb-6 md:pb-12 pt-6">
      <div className="container mx-auto px-2">
        <div className="bg-black text-white rounded-[2rem] px-6 py-12 md:p-12 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl font-bold font-heading text-accent">
                Luxury Exxentials.
              </h2>
              <p className="text-gray-400 max-w-sm">
                The premier platform for finding and booking luxury beach houses
                and short-term apartments in Lagos, Nigeria.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Services</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    to="/properties"
                    className="hover:text-white transition-colors"
                  >
                    Vacation Rentals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/properties"
                    className="hover:text-white transition-colors"
                  >
                    Property Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/properties"
                    className="hover:text-white transition-colors"
                  >
                    Concierge Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Luxury Exxentials.
            </p>
            <p>Designed with ❤️ by inistheguyy</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
