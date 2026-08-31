import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MapPin, MessageCircle, X, MessageSquare, Sparkles } from 'lucide-react';

export const FloatingContactWidget: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const contactLinks = [
    {
      id: 'zalo',
      name: 'Zalo: 079 329 5664',
      subtitle: lang === 'vi' ? 'Nhắn Zalo tư vấn ngay' : 'Zalo Chat Support',
      icon: (
        <span className="w-9 h-9 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center shadow-sm">
          Zalo
        </span>
      ),
      url: 'https://zalo.me/0793295664',
      bgHover: 'hover:bg-blue-50',
      badge: lang === 'vi' ? 'Trực tuyến' : 'Online',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Chat',
      subtitle: lang === 'vi' ? 'Khách quốc tế 24/7' : 'English & International',
      icon: (
        <span className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
          <MessageSquare className="w-4 h-4" />
        </span>
      ),
      url: 'https://wa.me/84793295664',
      bgHover: 'hover:bg-emerald-50',
      badge: '24/7',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'hotline',
      name: '028 2248 7782',
      subtitle: lang === 'vi' ? 'Bấm để gọi lễ tân' : 'Call Reception Hotline',
      icon: (
        <span className="w-9 h-9 rounded-full bg-neutral-900 text-[#E8DCB9] flex items-center justify-center shadow-sm">
          <Phone className="w-4 h-4" />
        </span>
      ),
      url: 'tel:02822487782',
      bgHover: 'hover:bg-neutral-50',
      badge: lang === 'vi' ? 'Lễ tân' : 'Front desk',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'maps',
      name: 'Google Maps',
      subtitle: '269/19 Đề Thám, Q.1',
      icon: (
        <span className="w-9 h-9 rounded-full bg-[#EA4335] text-white flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4" />
        </span>
      ),
      url: 'https://maps.app.goo.gl/nRiJu2PQHPtAZEt16',
      bgHover: 'hover:bg-red-50',
      badge: lang === 'vi' ? 'Chỉ đường' : 'Directions',
      badgeColor: 'bg-red-100 text-red-800',
    },
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={widgetRef} 
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 font-sans flex flex-col items-end pointer-events-none"
    >
      
      {/* Animated Speed Dial Menu Card */}
      <div 
        className={`mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 origin-bottom-right transition-all duration-300 ease-out pointer-events-auto transform ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-neutral-950 text-white p-4 px-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E8DCB9] tracking-wider block">
              GALAXY BOUTIQUE HOTEL
            </span>
            <h4 className="text-xs font-bold tracking-tight text-white mt-0.5">
              {lang === 'vi' ? 'Liên Hệ Trực Tiếp Lễ Tân' : 'Direct Contact & Support'}
            </h4>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Items */}
        <div className="p-2.5 space-y-1">
          {contactLinks.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.id === 'hotline' ? '_self' : '_blank'}
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3.5 p-2.5 rounded-2xl transition-all duration-200 ${item.bgHover} group`}
            >
              <div className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-[#8A6943] transition-colors">
                    {item.name}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 block truncate mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-[#FAF9F5] text-center text-[10px] text-neutral-500 font-medium">
          {lang === 'vi' 
            ? 'Lễ tân phục vụ 24/7 • Phản hồi trong 1-2 phút'
            : 'Front desk active 24/7 • Response in 1-2 mins'}
        </div>

      </div>

      {/* Main Floating Trigger Button - Fixed Bottom-Right Anchor */}
      <div className="relative flex items-center justify-end pointer-events-auto">
        
        {/* Small Tooltip pill when closed */}
        <div 
          className={`hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 bg-neutral-950 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-lg border border-neutral-800 transition-all duration-300 pointer-events-none ${
            isOpen ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
          }`}
        >
          {lang === 'vi' ? '💬 Liên hệ & Chỉ đường' : '💬 Chat & Directions'}
        </div>

        {/* Pulse Ripple Effect behind the button when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-neutral-900/20 animate-ping pointer-events-none" />
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-luxury bg-neutral-950 hover:bg-neutral-900 text-white border border-neutral-700/80 transition-transform duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
          aria-label="Contact Hotel"
        >
          {/* Smooth Morphing Icons (Chat vs X) */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Chat Icon */}
            <MessageCircle 
              className={`w-6 h-6 text-[#E8DCB9] absolute inset-0 transition-all duration-300 ease-out transform ${
                isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`} 
            />
            {/* Close X Icon */}
            <X 
              className={`w-6 h-6 text-white absolute inset-0 transition-all duration-300 ease-out transform ${
                isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`} 
            />
          </div>
        </button>

      </div>

    </div>
  );
};
