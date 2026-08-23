import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, Menu, X, Globe, Sparkles, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#rooms', label: t('nav.rooms') },
    { href: '#dining', label: t('nav.dining') },
    { href: '#facilities', label: t('nav.facilities') },
    { href: '#gallery', label: t('nav.gallery') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro bar */}
      <div className={`bg-hotel-navy text-white text-xs py-2 px-4 transition-all duration-300 hidden md:block ${scrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-hotel-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </span>
            <span className="text-gray-300">269/19 Đề Thám, P. Bến Thành, Quận 1, TP. Hồ Chí Minh</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="tel:02822487782" className="flex items-center gap-1.5 text-gray-200 hover:text-hotel-gold transition-colors">
              <Phone className="w-3.5 h-3.5 text-hotel-gold" />
              <span className="font-semibold">028 2248 7782</span>
            </a>
            <span className="text-gray-500">|</span>
            <a href="https://zalo.me/84793295664" target="_blank" rel="noopener noreferrer" className="text-xs text-hotel-gold hover:underline">
              Zalo: 079 329 5664
            </a>
            <span className="text-gray-500">|</span>
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 bg-hotel-dark/60 rounded-full px-2.5 py-0.5 border border-hotel-gold/30">
              <Globe className="w-3 h-3 text-hotel-gold" />
              <button
                onClick={() => setLang('vi')}
                className={`font-semibold text-xs transition-colors ${lang === 'vi' ? 'text-hotel-gold underline' : 'text-gray-400 hover:text-white'}`}
              >
                VI
              </button>
              <span className="text-gray-500 text-[10px]">/</span>
              <button
                onClick={() => setLang('en')}
                className={`font-semibold text-xs transition-colors ${lang === 'en' ? 'text-hotel-gold underline' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            {onOpenAdmin && (
              <>
                <span className="text-gray-500">|</span>
                <button
                  onClick={onOpenAdmin}
                  className="btn-magnetic flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-hotel-gold/20 hover:bg-hotel-gold text-hotel-gold hover:text-hotel-navy border border-hotel-gold/40 text-[11px] font-bold uppercase tracking-wider transition-all"
                  title="Trang quản trị khách sạn"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-hotel-gold/20' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hotel-gold via-hotel-goldDark to-hotel-navy flex items-center justify-center text-white font-brand font-bold text-xl shadow-gold-glow">
              G
            </div>
            <div className="flex flex-col">
              <span className={`font-brand tracking-[0.2em] font-bold text-xl sm:text-2xl uppercase transition-colors ${scrolled ? 'text-hotel-navy' : 'text-white'}`}>
                GALAXY
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-hotel-gold font-medium -mt-0.5">
                HOTEL & SUITES
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-hotel-navy hover:bg-hotel-sand/70' 
                    : 'text-gray-100 hover:text-hotel-gold hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language toggle for scrolled state */}
            {scrolled && (
              <div className="flex items-center space-x-1.5 bg-gray-100 rounded-full px-2.5 py-1 text-xs border border-gray-200">
                <button
                  onClick={() => setLang('vi')}
                  className={`font-semibold ${lang === 'vi' ? 'text-hotel-navy font-bold' : 'text-gray-400'}`}
                >
                  VI
                </button>
                <span className="text-gray-300">/</span>
                <button
                  onClick={() => setLang('en')}
                  className={`font-semibold ${lang === 'en' ? 'text-hotel-navy font-bold' : 'text-gray-400'}`}
                >
                  EN
                </button>
              </div>
            )}

            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-hotel-gold to-hotel-goldDark hover:from-hotel-goldDark hover:to-hotel-gold text-hotel-navy font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-hotel-navy group-hover:rotate-12 transition-transform" />
              <span>{t('nav.book_now')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Mobile Lang switch */}
            <button
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className={`text-xs font-bold px-2 py-1 rounded border ${scrolled ? 'border-gray-300 text-hotel-navy' : 'border-white/40 text-white'}`}
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${scrolled ? 'text-hotel-navy' : 'text-white'}`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-hotel-navy text-white px-4 pt-3 pb-6 space-y-2 border-t border-hotel-gold/30 shadow-2xl animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-base font-medium text-gray-200 hover:text-hotel-gold hover:bg-white/5 uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="tel:02836200182"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/10 text-white text-sm font-semibold"
              >
                <Phone className="w-4 h-4 text-hotel-gold" />
                <span>028 3620 0182 (Hotline)</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-lg bg-hotel-gold text-hotel-navy font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('nav.book_now')}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
