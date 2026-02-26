import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Search, Info, MapPin } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items with icons for mobile and labels for desktop
  const navItems = [
    { label: "About us", path: "/", icon: HomeIcon },
    { label: "Apartments", path: "/properties", icon: Search },

    { label: "Contact", path: "/about", icon: Info },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none max-w-3xl mx-auto">
      <header
        className={`
          max-w-5xl mx-auto h-14 md:h-16
          bg-white/90  shadow-lg border border-white/20
          rounded-lg md:rounded-[1.5rem]
          flex items-center justify-between px-4 md:px-8
          text-accent pointer-events-auto
          transition-all duration-500
        `}
      >
        {/* Logo Section */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Mobile Logo: "LE" */}
            <span className={`md:hidden text-2xl font-black tracking-tighter`}>
              LE
            </span>
            {/* Desktop Logo: "Luxury Exxentials" */}
            <span
              className={`hidden md:block text-lg font-extrabold tracking-tight whitespace-nowrap`}
            >
              Luxury Exxentials
            </span>
          </Link>
        </div>

        {/* Centered Navigation */}
        {/* <nav className="flex items-center gap-1 md:gap-2 bg-gray-50/50 p-1 rounded-full border border-gray-100">
          {navItems.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`
                  flex items-center justify-center
                  rounded-full transition-all duration-300
                  px-3 py-2 md:px-5 md:py-2
                  ${
                    isActive
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "hover:bg-accent/5 hover:text-accent"
                  }
                `}
                title={link.label}
              >
           
                <link.icon className="md:hidden h-5 w-5" />

                <span className="hidden md:block text-xs font-bold tracking-wide uppercase">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav> */}

        {/* CTA Buttons - Desktop Only */}
        <div className="flex-1 hidden md:flex items-center justify-end">
          <Button onClick={() => navigate("/properties")} className="bg-accent hover:bg-accent-700 text-white rounded-full px-6 py-2 text-xs font-bold shadow-lg shadow-accent/20 transition-all transform hover:scale-105">
           Book a Property
          </Button>
        </div>

        {/* Mobile Host Button - Visible only on mobile */}
        <div className="md:hidden flex-1 flex justify-end">
          <Button onClick={() => navigate("/properties")} className="bg-accent hover:bg-accent-700 text-white rounded-full px-4 py-2 text-xs font-bold shadow-md transition-all">
             Book a Property
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
