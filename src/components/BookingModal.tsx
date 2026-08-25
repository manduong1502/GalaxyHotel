import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBookings } from '../context/BookingContext';
import { Room } from '../types';
import { roomsData } from '../data/mockData';
import { X, Calendar as CalendarIcon, Clock, Check, Phone, ArrowRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  selectedRoom: Room | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, selectedRoom, onClose }) => {
  const { lang, t } = useLanguage();
  const { addBooking, rooms } = useBookings();

  const [bookingType, setBookingType] = useState<'daily' | 'hourly'>('daily');
  const [currentRoomId, setCurrentRoomId] = useState<string>(selectedRoom?.id || rooms[0]?.id || roomsData[0].id);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [stayDate, setStayDate] = useState(today);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [hoursCount, setHoursCount] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    if (selectedRoom) {
      setCurrentRoomId(selectedRoom.id);
    }
  }, [selectedRoom]);

  if (!isOpen) return null;

  const currentRoom = (rooms.length > 0 ? rooms : roomsData).find((r) => r.id === currentRoomId) || rooms[0] || roomsData[0];

  // Calculate estimated total
  let totalAmount = 0;
  let durationText = '';

  if (bookingType === 'daily') {
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
    totalAmount = diffDays * currentRoom.pricePerNight;
    durationText = `${diffDays} ${lang === 'vi' ? 'Đêm' : 'Night(s)'}`;
  } else {
    totalAmount = currentRoom.priceHourlyFirst2h + Math.max(0, hoursCount - 2) * currentRoom.priceHourlyExtra;
    durationText = `${hoursCount} ${lang === 'vi' ? 'Giờ' : 'Hours'}`;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const createdBooking = await addBooking({
      bookingType,
      roomId: currentRoom.id,
      checkInDate: bookingType === 'daily' ? checkInDate : stayDate,
      checkInTime: bookingType === 'daily' ? '14:00' : checkInTime,
      checkOutDate: bookingType === 'daily' ? checkOutDate : stayDate,
      checkOutTime: bookingType === 'daily' ? '12:00' : '16:00',
      hoursCount: bookingType === 'hourly' ? hoursCount : 0,
      adults,
      children,
      guestName,
      guestPhone,
      guestEmail,
      specialRequests,
    }, totalAmount);

    setBookingCode(createdBooking.bookingCode);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Booking Success Screen */
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                {lang === 'vi' ? 'Gửi Yêu Cầu Thành Công' : 'Request Sent Successfully'}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mt-3">
                {t('modal.success_title')}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-2 font-sans">
                {t('modal.success_msg')}
              </p>
            </div>

            {/* Booking Summary Ticket */}
            <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200 text-left space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span className="font-semibold text-neutral-500">{lang === 'vi' ? 'Mã Đặt Phòng:' : 'Booking ID:'}</span>
                <span className="font-display font-bold text-base text-neutral-900">{bookingCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{lang === 'vi' ? 'Hạng phòng:' : 'Room Type:'}</span>
                <span className="font-semibold text-neutral-900">{currentRoom.name[lang]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{lang === 'vi' ? 'Hình thức:' : 'Type:'}</span>
                <span className="font-semibold">{bookingType === 'daily' ? t('booking.tab_daily') : t('booking.tab_hourly')} ({durationText})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{lang === 'vi' ? 'Thời gian nhận:' : 'Check-in:'}</span>
                <span className="font-semibold text-emerald-700">
                  {bookingType === 'daily' ? `${checkInDate} (14:00)` : `${stayDate} (${checkInTime})`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{lang === 'vi' ? 'Khách hàng:' : 'Guest:'}</span>
                <span className="font-semibold">{guestName} ({guestPhone})</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm">
                <span className="font-bold text-neutral-900">{t('modal.total_summary')}</span>
                <span className="font-display font-bold text-base text-neutral-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href="tel:02822487782"
                className="py-3 px-6 rounded-lg bg-neutral-900 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8DCB9]" />
                <span>{lang === 'vi' ? 'Gọi Lễ Tân Xác Nhận Ngay' : 'Call Front Desk'}</span>
              </a>
              <button
                onClick={handleResetAndClose}
                className="py-3 px-6 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs tracking-wider hover:bg-neutral-50 transition-colors"
              >
                {lang === 'vi' ? 'Hoàn Tất & Đóng' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form Screen */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-1">
                {lang === 'vi' ? 'ĐẶT PHÒNG TRỰC TIẾP' : 'DIRECT RESERVATION'}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
                {t('modal.booking_title')}
              </h2>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="inline-flex p-1 bg-[#F4F1EA] rounded-xl border border-neutral-200/70 w-full">
              <button
                type="button"
                onClick={() => setBookingType('daily')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  bookingType === 'daily'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{t('booking.tab_daily')}</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('hourly')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  bookingType === 'hourly'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t('booking.tab_hourly')}</span>
              </button>
            </div>

            {/* Room Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                {t('modal.select_room')}
              </label>
              <select
                value={currentRoomId}
                onChange={(e) => setCurrentRoomId(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {roomsData.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name[lang]} — {formatCurrency(room.pricePerNight)}/đêm ({formatCurrency(room.priceHourlyFirst2h)}/2h)
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Pickers */}
            {bookingType === 'daily' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('modal.checkin_daily')}
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">{lang === 'vi' ? 'Nhận phòng từ 14:00' : 'Check-in from 14:00'}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('modal.checkout_daily')}
                  </label>
                  <input
                    type="date"
                    required
                    min={checkInDate || today}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">{lang === 'vi' ? 'Trả phòng trước 12:00' : 'Check-out before 12:00'}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('modal.stay_date')}
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={stayDate}
                    onChange={(e) => setStayDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('modal.checkin_time')}
                  </label>
                  <select
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="08:00">08:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('modal.duration_hourly')}
                  </label>
                  <select
                    value={hoursCount}
                    onChange={(e) => setHoursCount(Number(e.target.value))}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value={2}>{t('booking.hours_2')}</option>
                    <option value={3}>{t('booking.hours_3')}</option>
                    <option value={4}>{t('booking.hours_4')}</option>
                    <option value={6}>{t('booking.hours_6')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Guests Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('modal.adults_label')}
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value={1}>1 {t('booking.adults')}</option>
                  <option value={2}>2 {t('booking.adults')}</option>
                  <option value={3}>3 {t('booking.adults')}</option>
                  <option value={4}>4 {t('booking.adults')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('modal.children_label')}
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value={0}>0 {t('booking.children')}</option>
                  <option value={1}>1 {t('booking.children')}</option>
                  <option value={2}>2 {t('booking.children')}</option>
                </select>
              </div>
            </div>

            {/* Guest Personal Information */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-800">
                {t('modal.customer_info')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder={t('modal.name_placeholder')}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder={t('modal.phone_placeholder')}
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t('modal.email_placeholder')}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder={t('modal.note_placeholder')}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                />
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 block">{t('modal.duration_summary')} {durationText}</span>
                <span className="text-xs font-semibold text-neutral-800">{t('modal.total_summary')}</span>
              </div>
              <span className="font-display font-bold text-xl sm:text-2xl text-neutral-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Action Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
              >
                {t('modal.cancel')}
              </button>
              <button
                type="submit"
                className="btn-magnetic px-7 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-colors"
              >
                <span>{t('modal.confirm_btn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
