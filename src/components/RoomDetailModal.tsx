import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Room } from '../types';
import { X, Calendar as CalendarIcon, Users, Maximize2, Bed, Check, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBookNow: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onBookNow }) => {
  const { lang, t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(new Date().getDate());

  if (!room) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const currentMonth = lang === 'vi' ? 'Tháng 08 / 2026' : 'August 2026';
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getAvailabilityStatus = (day: number) => {
    if ([5, 12, 19, 26].includes(day)) return 'booked';
    if ([6, 13, 20, 27, 28].includes(day)) return 'partial';
    return 'available';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-backdrop">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative flex flex-col animate-modal-pop">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Image Showcase */}
        <div className="relative h-72 sm:h-96 w-full bg-neutral-900 overflow-hidden flex-shrink-0">
          <img
            src={room.images[activeImageIndex]}
            alt={room.name[lang]}
            className="w-full h-full object-cover transition-all duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Navigation Arrows for Images */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % room.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnails row */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                  idx === activeImageIndex ? 'border-white scale-105 shadow-md' : 'border-white/40 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A6943] bg-[#FAF9F5] px-2.5 py-1 rounded border border-neutral-200">
                {lang === 'vi' ? 'Phòng Nghỉ Thực Tế' : 'Boutique Room'}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-2">
                {room.name[lang]}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-sans">
                {room.subtitle[lang]}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-neutral-200/80 flex items-center gap-6">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">{t('rooms.price_night_label')}</span>
                <span className="font-sans font-bold text-xl text-neutral-900 tracking-tight">
                  {formatCurrency(room.pricePerNight)}
                </span>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">{t('rooms.price_hour_label')}</span>
                <span className="font-sans font-bold text-base text-[#8A6943] tracking-tight">
                  {formatCurrency(room.priceHourlyFirst2h)} <span className="text-xs font-normal text-neutral-500">{t('rooms.per_hour')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F5] p-4 rounded-xl border border-neutral-200/70">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">{t('rooms.area')}</span>
                <span className="text-xs font-semibold text-neutral-900">{room.areaSqm} m²</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">{t('rooms.guests_max')}</span>
                <span className="text-xs font-semibold text-neutral-900">{room.maxAdults} {t('rooms.adults_short')}, {room.maxChildren} {t('rooms.children_short')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">{t('rooms.bed')}</span>
                <span className="text-xs font-semibold text-neutral-900 truncate">{room.bedType[lang]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">{t('rooms.view')}</span>
                <span className="text-xs font-semibold text-neutral-900">{room.view[lang]}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2">
              {lang === 'vi' ? 'Mô Tả Chi Tiết' : 'Detailed Description'}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-sans">
              {room.description[lang]}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif font-bold text-sm text-neutral-900 mb-3 uppercase tracking-wider">
                {lang === 'vi' ? 'Tiện Nghi Phòng' : 'Room Amenities'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.amenities[lang].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-neutral-900 mb-3 uppercase tracking-wider">
                {lang === 'vi' ? 'Dịch Vụ Kèm Theo' : 'Included Services'}
              </h3>
              <div className="space-y-2">
                {room.features[lang].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-800 font-medium bg-[#FAF9F5] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-[#8A6943] font-bold">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-neutral-900" />
                <h3 className="font-serif font-bold text-base text-neutral-900">
                  {lang === 'vi' ? `Lịch Phòng Còn Trống (${currentMonth})` : `Availability (${currentMonth})`}
                </h3>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>{lang === 'vi' ? 'Còn trống' : 'Available'}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>{lang === 'vi' ? 'Khung giờ' : 'Slots'}</span>
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  <span>{lang === 'vi' ? 'Kín' : 'Full'}</span>
                </span>
              </div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <div key={i} className="text-[11px] font-semibold text-neutral-400 py-1 font-sans">
                  {lang === 'vi' ? d : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              ))}

              {daysInMonth.map((day) => {
                const status = getAvailabilityStatus(day);
                const isSelected = selectedCalendarDate === day;

                let bgClass = 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-900';
                if (status === 'partial') bgClass = 'bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400';
                if (status === 'booked') bgClass = 'bg-neutral-100 border-neutral-200 text-neutral-400 opacity-60 cursor-not-allowed';

                return (
                  <button
                    key={day}
                    disabled={status === 'booked'}
                    onClick={() => setSelectedCalendarDate(day)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${bgClass} ${
                      isSelected ? 'ring-2 ring-neutral-900 font-bold' : ''
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[9px] mt-0.5 opacity-70">
                      {status === 'available' 
                        ? (lang === 'vi' ? 'Trống' : 'Free') 
                        : status === 'partial' 
                          ? (lang === 'vi' ? 'Vài giờ' : 'Slots') 
                          : (lang === 'vi' ? 'Hết' : 'Full')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              onClick={onClose}
              className="btn-magnetic px-5 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors"
            >
              {t('modal.close')}
            </button>

            <button
              onClick={() => {
                onClose();
                onBookNow(room);
              }}
              className="btn-magnetic px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase shadow-sm flex items-center gap-2 transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#E8DCB9]" />
              <span>{lang === 'vi' ? 'Tiến Hành Đặt Phòng' : 'Proceed Booking'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
