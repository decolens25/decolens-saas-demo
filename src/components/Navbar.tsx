import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/70 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent py-2'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-8 md:h-12">
        <Link to="/" className="flex items-center space-x-2">
          <Camera className="h-8 w-8" />
          <span className="font-serif text-2xl font-bold">DecoLens Demo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              'text font-medium transition-colors hover:text-primary',
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Home
          </Link>
          <Link
            to="/browse"
            className={cn(
              'text font-medium transition-colors hover:text-primary',
              location.pathname === '/browse' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Browse Art
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4 px-16">
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 py-5 space-y-4">
            <Link
              to="/"
              className="block text-base font-medium text-gray-900 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="block text-base font-medium text-gray-900 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Art
            </Link>

            <div className="pt-4 border-t border-gray-200">
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;