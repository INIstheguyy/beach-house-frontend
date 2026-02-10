import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-primary">Lagos Beach Stays</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
            >
              Homes
            </Link>
            <Link 
              to="/properties" 
              className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
            >
              Apartments
            </Link>
            <Link 
              to="/properties" 
              className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
            >
              Experiences
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-gray-700 hover:text-accent transition-colors"
            >
              Design System
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button size="sm" className="bg-primary hover:bg-primary-600 text-white rounded-lg">
              Sign In
            </Button>
          </div>

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
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link 
              to="/" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Homes
            </Link>
            <Link 
              to="/properties" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apartments
            </Link>
            <Link 
              to="/properties" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Experiences
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-base font-medium text-gray-700 hover:text-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Design System
            </Link>
            <div className="pt-4">
              <Button className="w-full bg-primary hover:bg-primary-600 text-white">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
