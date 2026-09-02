import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logoImg from '../../assets/logo.jpg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Voice Lab', path: '/voice-lab' },
    { name: 'Industries', path: '/industries' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div 
        className={`w-full max-w-7xl flex items-center justify-between px-6 py-3 transition-all duration-500 rounded-full ${
          isScrolled ? 'bg-[#0d061c]/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-3 font-body font-bold text-xl tracking-tight" onClick={closeMenu}>
          <img src={logoImg} alt="Logo" className="h-8 object-contain rounded-md" />
          <span>Dialora</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link to="/demo" className="flex items-center gap-2 bg-gradient-to-r from-[#5828dc] to-[#ff3c00] px-5 py-2.5 rounded-full text-[13px] font-semibold hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,60,0,0.4)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Get a Demo Call
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden glass p-2 rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-[var(--background)] p-4 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="px-4 py-3 rounded-xl text-lg font-medium bg-[var(--card)]/50 border border-[var(--border)]"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <Link 
            to="/demo" 
            onClick={closeMenu}
            className="bg-signature px-4 py-3 rounded-xl text-lg font-semibold text-center mt-4"
          >
            Get a Demo Call
          </Link>
        </div>
      )}
    </header>
  );
}
