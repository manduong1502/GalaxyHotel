import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MapPin, MessageCircle, X, Navigation, MessageSquare } from 'lucide-react';

export const FloatingContactWidget: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const contactLinks = [
    {
      id: 'zalo',
      name: 'Zalo Chat',
      subtitle: lang === 'vi' ? 'Hỗ trợ khách Việt' : 'Local Chat Support',
      icon: (
        <span className="w-8 h-8 rounded-full bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center shadow-sm">
          Zalo
        </span>
      ),
      url: 'https://zalo.me/02822487782',
      bgHover: 'hover:bg-blue-50',
      badge: lang === 'vi' ? 'Trực tuyến' : 'Online',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Chat',
      subtitle: lang === 'vi' ? 'Khách quốc tế 24/7' : 'English & International',
      icon: (
        <span className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
          <MessageSquare className="w-4 h-4" />
        </span>
      ),
      url: 'https://wa.me/842822487782',
      bgHover: 'hover:bg-emerald-50',
      badge: '24/7',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'hotline',
      name: '028 2248 7782',
      subtitle: lang === 'vi' ? 'Bấm để gọi lễ tân' : 'Call Reception Hotline',
      icon: (
        <span className="w-8 h-8 rounded-full bg-neutral-900 text-[#E8DCB9] flex items-center justify-center shadow-sm">
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
        <span className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center shadow-sm">
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
    <div ref={widgetRef} className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 font-sans">
      
      {/* Expanded Speed Dial Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-fade-in divide-y divide-neutral-100">
          
          {/* Header */}
          <div className="bg-neutral-900 text-white p-3.5 px-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E8DCB9] tracking-wider block">
                Galaxy Boutique Hotel
              </span>
              <h4 className="text-xs font-bold tracking-tight">
                {lang === 'vi' ? 'Liên Hệ Trực Tiếp Lễ Tân' : 'Direct Contact & Support'}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contact Items */}
          <div className="p-2 space-y-1">
            {contactLinks.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.id === 'hotline' ? '_self' : '_blank'}
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${item.bgHover} group`}
              >
                <div className="flex-shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-[#8A6943] transition-colors">
                      {item.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block truncate">
                    {item.subtitle}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Footer Note */}
          <div className="p-2.5 bg-[#FAF9F5] text-center text-[10px] text-neutral-500">
            {lang === 'vi' 
              ? 'Lễ tân phục vụ 24/7 • Phản hồi trong 1-2 phút'
              : 'Front desk active 24/7 • Response in 1-2 mins'}
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative">
        
        {/* Pulse Ripple Effect behind the button */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-neutral-900/20 animate-ping pointer-events-none" />
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 ${
            isOpen
              ? 'bg-neutral-900 text-white rotate-90 scale-95'
              : 'bg-neutral-900 hover:bg-neutral-800 text-[#E8DCB9] hover:scale-105'
          } border border-neutral-700`}
          aria-label="Contact Hotel"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#E8DCB9]" />
            </div>
          )}
        </button>

        {/* Small Tooltip pill when closed */}
        {!isOpen && (
          <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md pointer-events-none border border-neutral-700 animate-fade-in">
            {lang === 'vi' ? '💬 Liên hệ & Chỉ đường' : '💬 Chat & Directions'}
          </div>
        )}

      </div>

    </div>
  );
};
