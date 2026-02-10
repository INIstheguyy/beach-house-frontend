import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Home as HomeIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold text-primary">Lagos Beach Rentals</span>
            </div>
            <p className="text-sm text-gray-600">
              The premier platform for finding and booking luxury beach houses and short-term apartments in Lagos, Nigeria.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:hello@lagosbeachrentals.com" 
                  className="text-sm text-gray-600 hover:text-accent transition-colors"
                >
                  hello@lagosbeachrentals.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <a 
                  href="tel:+2348001234567" 
                  className="text-sm text-gray-600 hover:text-accent transition-colors"
                >
                  +234 800 BEACH 1941
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  WhatsApp Support Available
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <p className="text-sm text-center text-gray-600">
            © {new Date().getFullYear()} Lagos Beach Rentals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
