import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, Menu, X, Globe, Lock, MapPin } from 'lucide-react';

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
      if (window.scrollY > 30) {
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro bar */}
      <div className={`bg-[#0F172A] text-neutral-300 text-xs py-2 px-4 transition-all duration-300 hidden md:block border-b border-neutral-800 ${scrolled ? 'h-0 opacity-0 overflow-hidden py-0 border-none' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6 text-[12px]">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-[#B89369]" />
              <span>269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[12px]">
            <a href="tel:02822487782" className="flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#B89369]" />
              <span className="font-semibold tracking-wide">028 2248 7782</span>
            </a>
            <span className="text-neutral-600">|</span>
            <a href="https://zalo.me/84793295664" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              Zalo: <span className="text-neutral-100 font-medium">079 329 5664</span>
            </a>
            <span className="text-neutral-600">|</span>
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setLang('vi')}
                className={`px-1.5 py-0.5 rounded transition-colors font-medium ${lang === 'vi' ? 'text-[#B89369] font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                VI
              </button>
              <span className="text-neutral-600 text-[10px]">/</span>
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded transition-colors font-medium ${lang === 'en' ? 'text-[#B89369] font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {onOpenAdmin && (
              <>
                <span className="text-neutral-600">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-medium transition-all"
                  title="Trang quản trị khách sạn"
                >
                  <Lock className="w-3 h-3 text-[#B89369]" />
                  <span>Quản trị</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${isDarkNav ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 sm:py-3 border-b border-neutral-200/80 text-neutral-900' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-3 sm:py-4 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo with real image */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 group text-left"
          >
            <div className={`p-1 rounded-xl transition-colors ${isDarkNav ? 'bg-neutral-900' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
              <img 
                src="/images/logo.png" 
                alt="Hotel Galaxy Boutique Logo" 
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif tracking-[0.15em] font-bold text-lg sm:text-xl transition-colors ${isDarkNav ? 'text-neutral-900' : 'text-white'}`}>
                GALAXY
              </span>
              <span className={`text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-semibold -mt-1 transition-colors ${isDarkNav ? 'text-[#8A6943]' : 'text-neutral-300'}`}>
                Boutique Hotel Saigon
              </span>
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
                  className={`text-[13px] font-medium tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
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

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language toggle for scrolled state */}
            {isDarkNav && (
              <div className="flex items-center space-x-1 px-2 py-1 text-xs text-neutral-600 mr-2">
                <button
                  onClick={() => setLang('vi')}
                  className={`font-semibold ${lang === 'vi' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  VI
                </button>
                <span className="text-neutral-300">/</span>
                <button
                  onClick={() => setLang('en')}
                  className={`font-semibold ${lang === 'en' ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  EN
                </button>
              </div>
            )}

            <button
              onClick={onOpenBooking}
              className={`btn-magnetic font-semibold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-sm ${
                isDarkNav
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#B89369]" />
              <span>{t('nav.book_now')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className={`text-xs font-semibold px-2 py-1 rounded border ${isDarkNav ? 'border-neutral-300 text-neutral-900' : 'border-white/30 text-white'}`}
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isDarkNav ? 'text-neutral-900' : 'text-white'}`}
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
                <Phone className="w-3.5 h-3.5 text-[#B89369]" />
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
                  <Lock className="w-3.5 h-3.5 text-[#B89369]" />
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
