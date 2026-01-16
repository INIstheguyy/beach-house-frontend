import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-5 z-50  backdrop-blur supports-[backdrop-filter]:bg-gray-500 rounded-lg md:mx-10 mx-5">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex gap-1 items-center">
              <span className="text-2xl font-bold text-accent">LUXURY </span>
              <span className="text-2xl font-bold text-accent">EXXENTIAL</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Properties
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          {/* <div className="hidden md:flex items-center space-x-4">
            <a 
              href="https://wa.me/2348012345678" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
            >
              WhatsApp
            </a>
            <Button size="sm" className="bg-accent hover:bg-accent-600">
              Book Now
            </Button>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Properties
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <a 
                href="https://wa.me/2348012345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center py-2 text-accent font-medium"
              >
                WhatsApp Us
              </a>
              <Button className="w-full bg-accent hover:bg-accent-600">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;