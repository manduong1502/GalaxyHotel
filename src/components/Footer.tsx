import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Send, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, lang } = useLanguage();

  const handleNav = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B0F19] text-white pt-16 pb-12 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <button onClick={() => handleNav('home')} className="flex items-center text-left">
              <img 
                src="/images/logo.png" 
                alt="Hotel Galaxy Boutique" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </button>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
              {t('footer.about_text')}
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-400 font-sans">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B89369] flex-shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/nRiJu2PQHPtAZEt16" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  269/19 Đề Thám, P. Bến Thành, Quận 1, TP. HCM
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B89369] flex-shrink-0" />
                <span>028 2248 7782 • Hotline/Zalo: 079 329 5664</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B89369] flex-shrink-0" />
                <span>galaxyboutiquehotel2022@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://www.facebook.com/hotelquan1giare" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-[#B89369] hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors border border-neutral-800" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://zalo.me/84793295664" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-[#B89369] hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors font-bold text-xs border border-neutral-800" title="Zalo">
                Z
              </a>
              <a href="https://www.tiktok.com/@galaxy.boutique269" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-[#B89369] hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors border border-neutral-800" title="TikTok">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#E8DCB9] uppercase tracking-wider font-sans">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-400 font-sans">
              <li><button onClick={() => handleNav('home')} className="hover:text-white transition-colors">{t('nav.home')}</button></li>
              <li><button onClick={() => handleNav('rooms')} className="hover:text-white transition-colors">{t('nav.rooms')}</button></li>
              <li><button onClick={() => handleNav('about')} className="hover:text-white transition-colors">{t('nav.about')}</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition-colors">{t('nav.dining')}</button></li>
              <li><button onClick={() => handleNav('gallery')} className="hover:text-white transition-colors">{t('nav.gallery')}</button></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">{t('nav.contact')}</button></li>
            </ul>
          </div>

          {/* Col 3: Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#E8DCB9] uppercase tracking-wider font-sans">
              {t('footer.policies')}
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-[#B89369]">✓</span>
                <span>{t('footer.policy_checkin')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B89369]">✓</span>
                <span>{t('footer.policy_cancel')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B89369]">✓</span>
                <span>{t('footer.policy_breakfast')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#B89369]">✓</span>
                <span>{t('footer.policy_hourly')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#E8DCB9] uppercase tracking-wider font-sans">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-xs text-neutral-400 font-sans">
              {t('footer.newsletter_sub')}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn quý khách đã đăng ký nhận ưu đãi!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#B89369]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 border border-neutral-700"
              >
                <span>{t('footer.newsletter_btn')}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 font-sans">
          <p>{t('footer.copyright')}</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-neutral-300">{t('footer.terms')}</a>
            <a href="#" className="hover:text-neutral-300">{t('footer.privacy')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
