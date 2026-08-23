import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Sparkles, Send, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-hotel-navy text-white pt-16 pb-12 border-t border-hotel-gold/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hotel-gold via-hotel-goldDark to-hotel-navy flex items-center justify-center text-white font-brand font-bold text-xl shadow-gold-glow">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-brand tracking-[0.2em] font-bold text-2xl uppercase text-white">
                  GALAXY
                </span>
                <span className="text-[9px] tracking-[0.28em] uppercase text-hotel-gold font-medium -mt-0.5">
                  BOUTIQUE HOTEL
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {t('footer.about_text')}
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-hotel-gold flex-shrink-0" />
                <span>269/19 Đề Thám, P. Bến Thành, Quận 1, TP. HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-hotel-gold flex-shrink-0" />
                <span>028 2248 7782 • Hotline/Zalo: 079 329 5664</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-hotel-gold flex-shrink-0" />
                <span>galaxyboutiquehotel2022@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://www.facebook.com/hotelquan1giare" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-hotel-gold hover:text-hotel-navy text-white flex items-center justify-center transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://zalo.me/84793295664" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-hotel-gold hover:text-hotel-navy text-white flex items-center justify-center transition-colors font-bold text-xs" title="Zalo">
                Z
              </a>
              <a href="https://www.tiktok.com/@galaxy.boutique269" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-hotel-gold hover:text-hotel-navy text-white flex items-center justify-center transition-colors" title="TikTok">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-base text-hotel-gold uppercase tracking-wider">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li><a href="#home" className="hover:text-hotel-gold transition-colors">{t('nav.home')}</a></li>
              <li><a href="#about" className="hover:text-hotel-gold transition-colors">{t('nav.about')}</a></li>
              <li><a href="#rooms" className="hover:text-hotel-gold transition-colors">{t('nav.rooms')}</a></li>
              <li><a href="#dining" className="hover:text-hotel-gold transition-colors">{t('nav.dining')}</a></li>
              <li><a href="#facilities" className="hover:text-hotel-gold transition-colors">{t('nav.facilities')}</a></li>
              <li><a href="#gallery" className="hover:text-hotel-gold transition-colors">{t('nav.gallery')}</a></li>
              <li><a href="#contact" className="hover:text-hotel-gold transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Col 3: Room Types & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-hotel-gold uppercase tracking-wider">
              {t('footer.policies')}
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-1.5">
                <span className="text-hotel-gold font-bold">✓</span>
                <span>{t('footer.policy_checkin')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-hotel-gold font-bold">✓</span>
                <span>{t('footer.policy_cancel')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-hotel-gold font-bold">✓</span>
                <span>{t('footer.policy_breakfast')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-hotel-gold font-bold">✓</span>
                <span>{t('footer.policy_hourly')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-hotel-gold uppercase tracking-wider">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-xs text-gray-300">
              {t('footer.newsletter_sub')}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận ưu đãi Galaxy Hotel!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-hotel-gold hover:bg-hotel-goldDark text-hotel-navy font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('footer.newsletter_btn')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{t('footer.copyright')}</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-hotel-gold">{t('footer.terms')}</a>
            <a href="#" className="hover:text-hotel-gold">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-hotel-gold">{t('footer.sitemap')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
