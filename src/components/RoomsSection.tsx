import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Room } from '../types';
import { roomsData } from '../data/mockData';
import { Maximize2, Users, Bed, Eye, ArrowUpRight, Check } from 'lucide-react';

interface RoomsSectionProps {
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ onSelectRoom, onBookRoom }) => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'suite' | 'deluxe'>('all');
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.05);

  const filteredRooms = roomsData.filter((room) => {
    if (filter === 'all') return true;
    if (filter === 'suite') return room.maxAdults >= 4 || room.slug.includes('suite') || room.slug.includes('phong-c') || room.slug.includes('phong-d');
    if (filter === 'deluxe') return room.maxAdults <= 3 && !room.slug.includes('phong-c') && !room.slug.includes('phong-d');
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  return (
    <section 
      id="rooms" 
      ref={sectionRef}
      className={`py-24 bg-[#FAF9F5] relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
            {lang === 'vi' ? 'HỆ THỐNG PHÒNG NGHỈ' : 'ACCOMMODATION & SUITES'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4">
            {lang === 'vi' ? 'Các Hạng Phòng & Bảng Giá' : 'Rooms & Best Rates'}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            {lang === 'vi' 
              ? 'Tất cả các phòng đều được trang bị đầy đủ máy lạnh, Smart TV, Wifi tốc độ cao, nước nóng 24/7, khăn tắm 100% cotton và dịch vụ dọn phòng hàng ngày.' 
              : 'All rooms feature individual climate control, Smart TV, high-speed Wi-Fi, 24/7 hot shower, 100% cotton towels, and daily housekeeping.'}
          </p>

          {/* Minimalist Tab Filter */}
          <div className="inline-flex p-1 rounded-xl bg-[#EFECE6] border border-neutral-300/60 mt-8 gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {lang === 'vi' ? 'Tất cả phòng' : 'All Rooms'} ({roomsData.length})
            </button>
            <button
              onClick={() => setFilter('deluxe')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === 'deluxe'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {lang === 'vi' ? 'Phòng Đôi & 3 Khách' : 'Double & Triple'}
            </button>
            <button
              onClick={() => setFilter('suite')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === 'suite'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {lang === 'vi' ? 'Phòng Gia Đình (5 Khách)' : 'Family Suites'}
            </button>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredRooms.map((room, idx) => (
            <div
              key={room.id}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] hover:border-neutral-400/80 transition-all duration-400 flex flex-col justify-between group"
            >
              <div>
                {/* Room Image Container */}
                <div 
                  className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 cursor-pointer"
                  onClick={() => onSelectRoom(room)}
                >
                  <img
                    src={room.images[0]}
                    alt={room.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    {room.isPopular && (
                      <span className="bg-neutral-900 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shadow-sm">
                        {lang === 'vi' ? 'Phổ biến' : 'Popular'}
                      </span>
                    )}
                  </div>

                  {/* Photo count indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded font-medium flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-[#E8DCB9]" />
                    <span>{room.images.length} {lang === 'vi' ? 'ảnh' : 'photos'}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3
                      onClick={() => onSelectRoom(room)}
                      className="font-serif font-bold text-xl text-neutral-900 hover:text-[#8A6943] transition-colors cursor-pointer leading-tight"
                    >
                      {room.name[lang]}
                    </h3>
                  </div>

                  <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {room.subtitle[lang]}
                  </p>

                  {/* Meta Specs Row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-neutral-600 py-3 border-y border-neutral-100 font-medium">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-[#8A6943]" />
                      <span>{room.areaSqm} m²</span>
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#8A6943]" />
                      <span>{room.maxAdults} {t('rooms.adults_short')}{room.maxChildren > 0 ? `, ${room.maxChildren} ${t('rooms.children_short')}` : ''}</span>
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[#8A6943]" />
                      <span className="truncate max-w-[120px]">{room.bedType[lang].split('(')[0]}</span>
                    </span>
                  </div>

                  {/* Amenities highlights */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {room.amenities[lang].slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-[#F4F1EA] text-neutral-700 px-2 py-0.5 rounded font-medium"
                      >
                        <Check className="w-3 h-3 text-[#8A6943]" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA Buttons */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-neutral-100 flex items-end justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      {lang === 'vi' ? 'Giá theo đêm' : 'Nightly rate'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-neutral-900 font-sans tracking-tight">
                        {formatCurrency(room.pricePerNight)}
                      </span>
                      <span className="text-xs text-neutral-500 font-normal">/ đêm</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      {lang === 'vi' ? 'Theo giờ' : 'Hourly rate'}
                    </span>
                    <div className="text-sm font-semibold text-[#8A6943]">
                      {formatCurrency(room.priceHourlyFirst2h)} <span className="text-[11px] text-neutral-500 font-normal">/ 2h</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onSelectRoom(room)}
                    className="btn-magnetic py-2.5 px-3 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors text-center"
                  >
                    {t('rooms.details_btn')}
                  </button>
                  
                  <button
                    onClick={() => onBookRoom(room)}
                    className="btn-magnetic py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{t('rooms.book_btn')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
