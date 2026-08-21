import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Room } from '../types';
import { X, Calendar as CalendarIcon, Users, Maximize2, Bed, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

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
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-hotel-gold/40 relative flex flex-col animate-modal-pop">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-magnetic absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Showcase */}
        <div className="relative h-72 sm:h-96 w-full bg-gray-900 overflow-hidden flex-shrink-0">
          <img
            src={room.images[activeImageIndex]}
            alt={room.name[lang]}
            className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Navigation Arrows for Images */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)}
                className="btn-magnetic absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/80"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % room.images.length)}
                className="btn-magnetic absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/80"
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
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                  idx === activeImageIndex ? 'border-hotel-gold scale-105 shadow-lg' : 'border-white/50 opacity-60 hover:opacity-100'
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-hotel-goldDark bg-hotel-sand/80 px-3 py-1 rounded-full">
                {lang === 'vi' ? 'Hạng Phòng 5 Sao' : '5-Star Luxury Room'}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-hotel-navy mt-2">
                {room.name[lang]}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {room.subtitle[lang]}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-hotel-cream p-4 rounded-2xl border border-hotel-gold/30 flex items-center gap-6">
              <div>
                <span className="text-[11px] text-gray-500 uppercase block">{t('rooms.price_night_label')}</span>
                <span className="font-serif font-bold text-xl text-hotel-navy">
                  {formatCurrency(room.pricePerNight)}
                </span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span className="text-[11px] text-gray-500 uppercase block">{t('rooms.price_hour_label')}</span>
                <span className="font-serif font-bold text-base text-amber-700">
                  {formatCurrency(room.priceHourlyFirst2h)} <span className="text-xs font-normal text-gray-500">{t('rooms.per_hour')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-hotel-sand/40 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-hotel-navy" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('rooms.area')}</span>
                <span className="text-xs font-bold text-hotel-navy">{room.areaSqm} m²</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-hotel-navy" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('rooms.guests_max')}</span>
                <span className="text-xs font-bold text-hotel-navy">{room.maxAdults} {t('rooms.adults_short')}, {room.maxChildren} {t('rooms.children_short')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-hotel-navy" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('rooms.bed')}</span>
                <span className="text-xs font-bold text-hotel-navy truncate">{room.bedType[lang]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-hotel-navy" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('rooms.view')}</span>
                <span className="text-xs font-bold text-hotel-navy">{room.view[lang]}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif font-bold text-lg text-hotel-navy mb-2">
              {lang === 'vi' ? 'Mô Tả Chi Tiết' : 'Detailed Description'}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {room.description[lang]}
            </p>
          </div>

          {/* Amenities & Special Privileges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif font-bold text-sm text-hotel-navy mb-3 uppercase tracking-wider">
                {lang === 'vi' ? 'Tiện Nghi Cao Cấp' : 'Room Amenities'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.amenities[lang].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-sm text-hotel-navy mb-3 uppercase tracking-wider">
                {lang === 'vi' ? 'Đặc Quyền Kèm Theo' : 'Exclusive Privileges'}
              </h3>
              <div className="space-y-2">
                {room.features[lang].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-hotel-navy font-medium bg-hotel-sand/60 p-2 rounded-lg">
                    <span className="text-hotel-gold font-bold">★</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Room Availability Calendar */}
          <div className="bg-hotel-cream p-5 rounded-2xl border border-hotel-gold/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-hotel-navy" />
                <h3 className="font-serif font-bold text-base text-hotel-navy">
                  {lang === 'vi' ? `Lịch Phòng Còn Trống (${currentMonth})` : `Availability Calendar (${currentMonth})`}
                </h3>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  <span>{lang === 'vi' ? 'Còn trống' : 'Available'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>{lang === 'vi' ? 'Còn 1 số khung giờ' : 'Partially Booked'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span>{lang === 'vi' ? 'Kín phòng' : 'Fully Booked'}</span>
                </span>
              </div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <div key={i} className="text-[11px] font-bold text-gray-500 py-1">
                  {lang === 'vi' ? d : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              ))}

              {daysInMonth.map((day) => {
                const status = getAvailabilityStatus(day);
                const isSelected = selectedCalendarDate === day;

                let bgClass = 'bg-white border-green-200 text-green-800 hover:border-green-400';
                if (status === 'partial') bgClass = 'bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400';
                if (status === 'booked') bgClass = 'bg-red-50 border-red-200 text-red-700 opacity-60 cursor-not-allowed';

                return (
                  <button
                    key={day}
                    disabled={status === 'booked'}
                    onClick={() => setSelectedCalendarDate(day)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${bgClass} ${
                      isSelected ? 'ring-2 ring-hotel-navy shadow-md scale-105 font-extrabold' : 'hover:scale-102'
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[9px] mt-0.5 opacity-80">
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

            <div className="text-xs text-gray-500 italic text-center">
              {lang === 'vi' 
                ? '* Quý khách có thể bấm chọn ngày mong muốn trên lịch để giữ chỗ hoặc đặt theo giờ.' 
                : '* Click on any available date to select your preferred check-in slot.'}
            </div>
          </div>

          {/* Standard Policies */}
          <div className="bg-hotel-sand/30 p-4 rounded-xl text-xs text-gray-600 space-y-1">
            <p><strong>• {lang === 'vi' ? 'Giờ nhận phòng tiêu chuẩn:' : 'Standard Check-in:'}</strong> {t('footer.policy_checkin')}</p>
            <p><strong>• {lang === 'vi' ? 'Chính sách hủy phòng:' : 'Cancellation Policy:'}</strong> {t('footer.policy_cancel')}</p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="btn-magnetic px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider"
            >
              {t('modal.close')}
            </button>

            <button
              onClick={() => {
                onClose();
                onBookNow(room);
              }}
              className="btn-magnetic px-8 py-3 rounded-xl bg-gradient-to-r from-hotel-gold to-hotel-goldDark hover:from-hotel-goldDark hover:to-hotel-gold text-hotel-navy font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4 text-hotel-navy" />
              <span>{lang === 'vi' ? 'Tiến Hành Đặt Phòng Này' : 'Proceed With This Room'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
