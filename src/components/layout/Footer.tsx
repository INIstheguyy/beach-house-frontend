import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">LUXURY</span>
              <span className="text-2xl font-bold text-accent">EXXENTIAL</span>
            </div>
            <p className="text-sm text-gray-300">
              Your gateway to luxury living in Lagos, Nigeria.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Beach+house" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Beach Houses
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Apartment" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:info@lagosbeachrentals.com" 
                  className="text-sm text-gray-300 hover:text-accent transition-colors"
                >
                  info@lagosbeachrentals.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <a 
                  href="tel:+2348012345678" 
                  className="text-sm text-gray-300 hover:text-accent transition-colors"
                >
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Lagos, Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} Lagos Beach Rentals. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Powered by</span>
              <span className="font-semibold text-accent">Flutterwave</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;