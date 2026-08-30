import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Calendar, MessageCircle, Home } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenBooking: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  currentPage = 'home',
  onNavigate, 
  onOpenBooking 
}) => {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-2xl py-2 px-3 lg:hidden flex items-center justify-between gap-2 font-sans">
      <button
        onClick={() => onNavigate && onNavigate('home')}
        className={`flex flex-col items-center justify-center text-[10px] font-bold flex-1 py-1 ${
          currentPage === 'home' ? 'text-[#8A6943]' : 'text-neutral-600 hover:text-neutral-950'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
      </button>

      <button
        onClick={() => onNavigate && onNavigate('rooms')}
        className={`flex flex-col items-center justify-center text-[10px] font-bold flex-1 py-1 ${
          currentPage === 'rooms' ? 'text-[#8A6943]' : 'text-neutral-600 hover:text-neutral-950'
        }`}
      >
        <Calendar className="w-5 h-5 mb-0.5" />
        <span>{lang === 'vi' ? 'Chọn phòng' : 'Rooms'}</span>
      </button>

      <a
        href="tel:02822487782"
        className="flex flex-col items-center justify-center text-neutral-700 hover:text-neutral-950 text-[10px] font-bold flex-1 py-1"
      >
        <Phone className="w-5 h-5 mb-0.5 text-neutral-900" />
        <span>Hotline</span>
      </a>

      {/* Main CTA Button for Mobile */}
      <button
        onClick={onOpenBooking}
        className="flex items-center justify-center gap-1.5 bg-neutral-900 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md active:scale-95 flex-2"
      >
        <Calendar className="w-3.5 h-3.5 text-[#E8DCB9]" />
        <span>{t('nav.book_now')}</span>
      </button>
    </div>
  );
};
