import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { Room } from '../types';
import { 
  X, Check, ChevronLeft, ChevronRight, Users, Bed, 
  Maximize2, ShieldCheck, Sparkles, Calendar as CalendarIcon, Lock 
} from 'lucide-react';
import { getLocalDateStr } from '../utils/dateUtils';

interface RoomDetailModalProps {
  room: Room | null;
  isOpen?: boolean;
  onClose: () => void;
  onBookNow: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  isOpen,
  onClose,
  onBookNow,
}) => {
  const { lang, t } = useLanguage();
  const { getAvailableRoomsCount, roomLocks } = useBookings();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return getLocalDateStr();
  });

  if (!room) return null;

  const activeSetting = roomLocks.find(
    l => l.roomId === room.id && selectedDateStr >= l.startDate && selectedDateStr <= l.endDate
  );
  const isSelectedDateLocked = activeSetting?.isLocked === true && (!activeSetting.customInventory || activeSetting.customInventory <= 0);
  const dateBaseInventory = (activeSetting && typeof activeSetting.customInventory === 'number' && activeSetting.customInventory > 0)
    ? activeSetting.customInventory
    : (room.totalInventory ?? 4);

  const totalInventory = dateBaseInventory;
  const currentAvailableForSelected = getAvailableRoomsCount(room.id, selectedDateStr);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const prevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const monthNamesVi = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthLabel = lang === 'vi' 
    ? `${monthNamesVi[month]} / ${year}`
    : `${monthNamesEn[month]} ${year}`;

  // Monday-first calculation (0 = Mon, ..., 6 = Sun)
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0 is Sun
  const firstDayIndex = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = getLocalDateStr();

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
            alt={room.name[lang] || room.name.vi}
            onError={(e) => { e.currentTarget.src = '/images/rooms/phong-a.jpg'; }}
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
                <img 
                  src={img} 
                  alt="Thumb" 
                  onError={(e) => { e.currentTarget.src = '/images/rooms/phong-a.jpg'; }}
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A6943] bg-[#FAF9F5] px-2.5 py-1 rounded border border-neutral-200">
                  {lang === 'vi' ? 'Phòng Nghỉ Thực Tế' : 'Boutique Room'}
                </span>
                
                {/* Total Inventory Badge */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {lang === 'vi' ? `Khách Sạn Có ${totalInventory} Phòng Loại Này` : `Total ${totalInventory} Units Available`}
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
                {room.name?.[lang] || room.name?.vi}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-sans">
                {room.subtitle?.[lang] || room.subtitle?.vi || ''}
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
                <span className="text-xs font-semibold text-neutral-900 truncate">{room.bedType?.[lang] || room.bedType?.vi || '1 Giường Đôi'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-semibold">{t('rooms.view')}</span>
                <span className="text-xs font-semibold text-neutral-900">{room.view?.[lang] || room.view?.vi || 'Cửa sổ tự nhiên'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2">
              {lang === 'vi' ? 'Mô Tả Chi Tiết' : 'Detailed Description'}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-sans">
              {room.description?.[lang] || room.description?.vi || ''}
            </p>
          </div>

          {/* Amenities & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif font-bold text-sm text-neutral-900 mb-3 uppercase tracking-wider">
                {lang === 'vi' ? 'Tiện Nghi Phòng' : 'Room Amenities'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(room.amenities?.[lang] || room.amenities?.vi || (Array.isArray(room.amenities) ? room.amenities : [])).map((amenity: string, idx: number) => (
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
                {(room.features?.[lang] || room.features?.vi || ['Miễn phí nước suối hàng ngày', 'Lễ tân 24/7', 'Dọn phòng hàng ngày']).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-800 font-medium bg-[#FAF9F5] p-2.5 rounded-lg border border-neutral-200/60">
                    <span className="text-[#8A6943] font-bold">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Real-time Availability Calendar */}
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-neutral-200/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8A6943]" />
                <h3 className="font-serif font-bold text-base text-neutral-900">
                  {lang === 'vi' ? `Lịch Phòng Trống Trực Tuyến` : `Live Room Availability`}
                </h3>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-neutral-200 shadow-xs">
                <button
                  onClick={prevMonth}
                  title="Tháng trước"
                  className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-neutral-900 px-2 min-w-[110px] text-center">
                  {currentMonthLabel}
                </span>
                <button
                  onClick={nextMonth}
                  title="Tháng sau"
                  className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>{lang === 'vi' ? 'Còn phòng' : 'Available'}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span>{lang === 'vi' ? 'Sắp hết' : 'Limited'}</span>
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span>{lang === 'vi' ? 'Hết/Khóa' : 'Full/Locked'}</span>
                </span>
              </div>
            </div>

            {/* Selected Date Real-Time Inventory Counter Badge */}
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs ${
              isSelectedDateLocked
                ? 'bg-red-50 border-red-200 text-red-900'
                : currentAvailableForSelected === 0
                  ? 'bg-neutral-100 border-neutral-200 text-neutral-600'
                  : currentAvailableForSelected <= 1
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2">
                {isSelectedDateLocked ? (
                  <Lock className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#8A6943] shrink-0" />
                )}
                <div>
                  <span className="font-bold">
                    {lang === 'vi' ? `Ngày đã chọn: ${selectedDateStr}` : `Selected Date: ${selectedDateStr}`}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {isSelectedDateLocked
                      ? (lang === 'vi' ? 'Hạng phòng đã tạm khóa vào ngày này' : 'Room is locked for this date')
                      : currentAvailableForSelected === 0
                        ? (lang === 'vi' ? 'Đã kín phòng vào ngày này' : 'Fully booked for this date')
                        : (lang === 'vi' 
                            ? `Hiện còn ${currentAvailableForSelected} / ${totalInventory} phòng trống sẵn sàng đón khách`
                            : `${currentAvailableForSelected} of ${totalInventory} rooms available`)}
                  </span>
                </div>
              </div>

              <div className="font-bold text-xs shrink-0">
                {isSelectedDateLocked ? (
                  <span className="text-red-600">Đã khóa</span>
                ) : currentAvailableForSelected > 0 ? (
                  <span className="text-emerald-700">✓ Có thể đặt ngay</span>
                ) : (
                  <span className="text-neutral-500">Hết chỗ</span>
                )}
              </div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <div key={i} className="text-[11px] font-bold text-neutral-400 py-1 font-sans">
                  {lang === 'vi' ? d : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              ))}

              {/* Leading Empty Slots */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="py-2.5 rounded-lg bg-neutral-100/30 border border-transparent" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const availableCount = getAvailableRoomsCount(room.id, dayDateStr);
                const isLocked = roomLocks.some(
                  l => l.roomId === room.id && dayDateStr >= l.startDate && dayDateStr <= l.endDate
                );
                const isSelected = selectedDateStr === dayDateStr;
                const isToday = todayStr === dayDateStr;

                let bgClass = 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-900';
                let labelText = `Còn ${availableCount}p`;

                if (isLocked) {
                  bgClass = 'bg-red-50 border-red-200 text-red-800 opacity-60';
                  labelText = lang === 'vi' ? 'Đã khóa' : 'Locked';
                } else if (availableCount === 0) {
                  bgClass = 'bg-neutral-100 border-neutral-200 text-neutral-400 opacity-60 cursor-not-allowed';
                  labelText = lang === 'vi' ? 'Hết' : 'Full';
                } else if (availableCount === 1) {
                  bgClass = 'bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400';
                  labelText = lang === 'vi' ? 'Còn 1p' : '1 left';
                } else {
                  labelText = lang === 'vi' ? `Còn ${availableCount}p` : `${availableCount} free`;
                }

                return (
                  <button
                    key={dayDateStr}
                    onClick={() => setSelectedDateStr(dayDateStr)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex flex-col items-center justify-between ${bgClass} ${
                      isSelected ? 'ring-2 ring-[#C29A64] border-[#C29A64] font-bold shadow-sm' : ''
                    } ${isToday ? 'border-blue-400' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      <span className={`${isToday ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold' : ''}`}>
                        {dayNum}
                      </span>
                    </div>
                    <div className={`text-[9px] mt-0.5 font-bold ${
                      isLocked ? 'text-red-600' : availableCount === 0 ? 'text-neutral-400' : availableCount === 1 ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {labelText}
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
              className="btn-magnetic px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs transition-colors"
            >
              {t('modal.close')}
            </button>

            <button
              onClick={() => {
                onClose();
                onBookNow(room);
              }}
              className="btn-magnetic px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase shadow-sm flex items-center gap-2 transition-colors active:scale-95"
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
