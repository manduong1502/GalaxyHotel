import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Room } from '../types';
import { roomsData } from '../data/mockData';
import { Maximize2, Users, Bed, Eye, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoomsSectionProps {
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ onSelectRoom, onBookRoom }) => {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'suite' | 'deluxe'>('all');
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const filteredRooms = roomsData.filter((room) => {
    if (filter === 'all') return true;
    if (filter === 'suite') return room.slug.includes('suite');
    if (filter === 'deluxe') return room.slug.includes('deluxe') || room.slug.includes('premier');
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  return (
    <section 
      id="rooms" 
      ref={sectionRef}
      className={`py-20 bg-hotel-sand/40 relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span>{t('rooms.eyebrow')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy mb-4">
            {t('rooms.title')}
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {t('rooms.subtitle')}
          </p>

          {/* Filter Tabs with Smooth Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setFilter('all')}
              className={`btn-magnetic px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-hotel-navy text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('rooms.tab_all')}
            </button>
            <button
              onClick={() => setFilter('deluxe')}
              className={`btn-magnetic px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === 'deluxe'
                  ? 'bg-hotel-navy text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('rooms.tab_deluxe')}
            </button>
            <button
              onClick={() => setFilter('suite')}
              className={`btn-magnetic px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === 'suite'
                  ? 'bg-hotel-navy text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('rooms.tab_suite')}
            </button>
          </div>
        </div>

        {/* Room Cards Grid with Staggered Fade-in */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room, idx) => (
            <div
              key={room.id}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="bg-white rounded-2xl overflow-hidden shadow-luxury border border-gray-100 card-hover-effect flex flex-col group relative animate-fade-in"
            >
              {/* Popular Badge */}
              {room.isPopular && (
                <div className="absolute top-4 left-4 z-20 bg-hotel-gold text-hotel-navy font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {t('rooms.popular_badge')}
                </div>
              )}

              {/* Room Image Carousel / Thumbnail */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelectRoom(room)}>
                <img
                  src={room.images[0]}
                  alt={room.name[lang]}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* View on click overlay */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <Eye className="w-3.5 h-3.5 text-hotel-gold" />
                  <span>{t('rooms.view_photos').replace('{count}', String(room.images.length))}</span>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectRoom(room)}
                    className="font-serif font-bold text-xl text-hotel-navy hover:text-hotel-goldDark transition-colors duration-300 cursor-pointer mb-2"
                  >
                    {room.name[lang]}
                  </h3>
                  
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                    {room.subtitle[lang]}
                  </p>

                  {/* Room Key Specs Icons */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-hotel-goldDark" />
                      <span>{room.areaSqm} m²</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-hotel-goldDark" />
                      <span>{room.maxAdults} {t('rooms.adults_short')}, {room.maxChildren} {t('rooms.children_short')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Bed className="w-3.5 h-3.5 text-hotel-goldDark" />
                      <span className="truncate">{room.bedType[lang]}</span>
                    </div>
                  </div>

                  {/* Top Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {room.amenities[lang].slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-hotel-sand/60 text-hotel-navy px-2.5 py-0.5 rounded-md"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  {/* Dual Price Display */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">{t('rooms.price_night_label')}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg sm:text-xl font-bold text-hotel-navy font-serif">
                          {formatCurrency(room.pricePerNight)}
                        </span>
                        <span className="text-xs text-gray-500">{t('rooms.per_night')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">{t('rooms.price_hour_label')}</span>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-sm sm:text-base font-bold text-amber-700">
                          {formatCurrency(room.priceHourlyFirst2h)}
                        </span>
                        <span className="text-[11px] text-gray-500">{t('rooms.per_hour')}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectRoom(room)}
                      className="btn-magnetic py-2.5 px-3 rounded-xl border border-hotel-navy/20 hover:bg-hotel-sand/70 text-hotel-navy font-semibold text-xs uppercase tracking-wider text-center"
                    >
                      {t('rooms.details_btn')}
                    </button>
                    
                    <button
                      onClick={() => onBookRoom(room)}
                      className="btn-magnetic py-2.5 px-3 rounded-xl bg-gradient-to-r from-hotel-gold to-hotel-goldDark hover:from-hotel-goldDark hover:to-hotel-gold text-hotel-navy font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 group"
                    >
                      <span>{t('rooms.book_btn')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
