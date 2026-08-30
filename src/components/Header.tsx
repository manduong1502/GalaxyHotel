import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, Menu, X, MapPin } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPage = 'home',
  onNavigate,
  onOpenBooking, 
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
    { id: 'home', label: lang === 'vi' ? 'Trang Chủ' : 'Home' },
    { id: 'rooms', label: lang === 'vi' ? 'Phòng Nghỉ' : 'Rooms & Suites' },
    { id: 'about', label: lang === 'vi' ? 'Giới Thiệu' : 'About Us' },
    { id: 'services', label: lang === 'vi' ? 'Dịch Vụ' : 'Services' },
    { id: 'gallery', label: lang === 'vi' ? 'Thư Viện Ảnh' : 'Gallery' },
    { id: 'contact', label: lang === 'vi' ? 'Liên Hệ' : 'Contact' },
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
      
      {/* 1. Top Utility Micro-Bar */}
      <div className={`w-full py-1.5 px-4 transition-all duration-300 hidden md:block text-[11px] ${
        isDarkNav 
          ? 'bg-[#0B0F19]/95 backdrop-blur-md text-neutral-300 border-b border-white/10 shadow-sm' 
          : 'bg-black/60 backdrop-blur-md text-neutral-200 border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Address */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-[#C29A64]" />
            <span className="font-medium tracking-wide">269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
          </div>

          {/* Contact & Language */}
          <div className="flex items-center space-x-5">
            <a 
              href="tel:02822487782" 
              className="flex items-center gap-1.5 font-bold hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C29A64]" />
              <span>028 2248 7782</span>
            </a>

            <span className="opacity-40">|</span>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setLang('vi')}
                className={`font-bold transition-colors ${
                  lang === 'vi' ? 'text-[#E8DCB9]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                VI
              </button>
              <span className="opacity-40">/</span>
              <button
                onClick={() => setLang('en')}
                className={`font-bold transition-colors ${
                  lang === 'en' ? 'text-[#E8DCB9]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Luxury Dark Navigation Bar */}
      <nav className={`w-full transition-all duration-300 text-white ${
        isDarkNav 
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-white/10 py-1 sm:py-1.5 shadow-2xl' 
          : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-1 sm:py-2'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between min-h-[64px] sm:min-h-[70px]">
          
          {/* Left Group: Logo + Navigation Tabs Close Together */}
          <div className="flex items-center gap-6 lg:gap-8">
            
            {/* Logo Area - Clean Transparent on Dark Background */}
            <button 
              onClick={() => handleNavClick('home')} 
              className="flex items-center flex-shrink-0"
              aria-label="Galaxy Boutique Hotel"
            >
              <img 
                src="/images/logo.png" 
                alt="Hotel Galaxy Boutique" 
                className="h-10 sm:h-12 md:h-13 w-auto object-contain"
              />
            </button>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-[13px] font-bold tracking-wide transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                      isActive
                        ? 'text-white font-bold after:w-full after:bg-[#E8DCB9]'
                        : 'text-neutral-300 hover:text-white after:w-0 hover:after:w-full after:bg-[#E8DCB9]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action: Clean Booking CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenBooking}
              className="bg-white hover:bg-[#E8DCB9] text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8A6943]" />
              <span>{t('nav.book_now')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className="text-xs font-bold px-2 py-1 rounded border border-white/30 text-white"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white"
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
