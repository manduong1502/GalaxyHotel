import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPage = 'home',
  onNavigate,
  onOpenBooking, 
  onOpenAdmin 
}) => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSubPage = currentPage !== 'home';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'rooms', label: t('nav.rooms') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.dining') },
    { id: 'gallery', label: t('nav.gallery') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isDarkNav = scrolled || isSubPage;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-sans">
      
      {/* Unified Single Flush Navbar */}
      <nav className={`w-full transition-all duration-300 ${
        isDarkNav 
          ? 'bg-white shadow-sm border-b border-neutral-200/90 py-2.5 sm:py-3 text-neutral-900' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-3 sm:py-4 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Single Official Logo Only (No duplicate text) */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center group transition-transform hover:scale-105"
            aria-label="Galaxy Boutique Hotel"
          >
            <div className="bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 shadow-sm flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="Hotel Galaxy Boutique" 
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-[13px] font-bold tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                    isActive
                      ? (isDarkNav ? 'text-neutral-950 font-bold after:w-full after:bg-neutral-950' : 'text-white font-bold after:w-full after:bg-[#E8DCB9]')
                      : (isDarkNav ? 'text-neutral-600 hover:text-neutral-950 after:w-0 hover:after:w-full after:bg-neutral-900' : 'text-neutral-200 hover:text-white after:w-0 hover:after:w-full after:bg-[#E8DCB9]')
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Phone */}
            <a 
              href="tel:02822487782" 
              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                isDarkNav ? 'text-neutral-700 hover:text-neutral-950' : 'text-neutral-200 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#C29A64]" />
              <span>028 2248 7782</span>
            </a>

            <span className={isDarkNav ? 'text-neutral-300' : 'text-white/30'}>|</span>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setLang('vi')}
                className={`font-bold transition-colors ${
                  lang === 'vi' 
                    ? (isDarkNav ? 'text-neutral-950 font-bold' : 'text-[#E8DCB9] font-bold') 
                    : (isDarkNav ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-400 hover:text-white')
                }`}
              >
                VI
              </button>
              <span className={isDarkNav ? 'text-neutral-300' : 'text-white/30'}>/</span>
              <button
                onClick={() => setLang('en')}
                className={`font-bold transition-colors ${
                  lang === 'en' 
                    ? (isDarkNav ? 'text-neutral-950 font-bold' : 'text-[#E8DCB9] font-bold') 
                    : (isDarkNav ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-400 hover:text-white')
                }`}
              >
                EN
              </button>
            </div>

            {/* Admin shortcut */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  isDarkNav 
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' 
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
                title="Trang quản trị khách sạn"
              >
                <Lock className="w-3 h-3 text-[#C29A64]" />
                <span>Quản trị</span>
              </button>
            )}

            {/* Booking CTA Button */}
            <button
              onClick={onOpenBooking}
              className={`font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-sm ${
                isDarkNav
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#C29A64]" />
              <span>{t('nav.book_now')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className={`text-xs font-bold px-2 py-1 rounded border ${
                isDarkNav ? 'border-neutral-300 text-neutral-900' : 'border-white/30 text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkNav ? 'text-neutral-900' : 'text-white'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-neutral-950 text-white px-5 pt-4 pb-6 space-y-2 border-t border-neutral-800 shadow-2xl animate-fade-in font-sans">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg px-3 transition-colors ${
                    isActive ? 'bg-[#C29A64] text-neutral-950' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2.5">
              <a
                href="tel:02822487782"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 text-neutral-200 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#C29A64]" />
                <span>028 2248 7782 (Hotline)</span>
              </a>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C29A64]" />
                  <span>Trang Quản Trị Khách Sạn</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-lg bg-white text-neutral-900 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow"
              >
                <Calendar className="w-4 h-4 text-[#8A6943]" />
                <span>{t('nav.book_now')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
