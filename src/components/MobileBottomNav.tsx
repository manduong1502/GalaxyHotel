import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, MessageCircle, Home } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenBooking: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-hotel-gold/30 shadow-2xl py-2 px-3 lg:hidden flex items-center justify-between gap-2">
      <a
        href="#home"
        className="flex flex-col items-center justify-center text-hotel-navy hover:text-hotel-gold text-[10px] font-semibold flex-1 py-1"
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Trang chủ</span>
      </a>

      <a
        href="tel:02836200182"
        className="flex flex-col items-center justify-center text-hotel-navy hover:text-hotel-gold text-[10px] font-semibold flex-1 py-1"
      >
        <Phone className="w-5 h-5 mb-0.5 text-hotel-goldDark" />
        <span>Gọi điện</span>
      </a>

      <a
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-hotel-navy hover:text-hotel-gold text-[10px] font-semibold flex-1 py-1"
      >
        <MessageCircle className="w-5 h-5 mb-0.5 text-blue-600" />
        <span>Zalo</span>
      </a>

      {/* Main CTA Button for Mobile */}
      <button
        onClick={onOpenBooking}
        className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-hotel-gold to-hotel-goldDark text-hotel-navy font-extrabold text-xs uppercase px-4 py-2.5 rounded-full shadow-md active:scale-95 flex-2"
      >
        <Calendar className="w-4 h-4 text-hotel-navy" />
        <span>{t('nav.book_now')}</span>
      </button>
    </div>
  );
};
