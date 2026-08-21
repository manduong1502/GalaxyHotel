import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { roomsData } from '../data/mockData';
import { Calendar as CalendarIcon, Clock, Users, Bed, Search, Info } from 'lucide-react';

interface BookingBarProps {
  onSearch: (params: {
    type: 'daily' | 'hourly';
    checkInDate: string;
    checkOutDate?: string;
    checkInTime?: string;
    hoursCount?: number;
    adults: number;
    children: number;
    roomId?: string;
  }) => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({ onSearch }) => {
  const { lang, t } = useLanguage();
  const [bookingType, setBookingType] = useState<'daily' | 'hourly'>('daily');

  // Default dates: today and tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [stayDate, setStayDate] = useState(today);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [hoursCount, setHoursCount] = useState(2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingType === 'daily') {
      onSearch({
        type: 'daily',
        checkInDate,
        checkOutDate,
        adults,
        children,
        roomId: selectedRoomId === 'all' ? undefined : selectedRoomId,
      });
    } else {
      onSearch({
        type: 'hourly',
        checkInDate: stayDate,
        checkInTime,
        hoursCount,
        adults,
        children,
        roomId: selectedRoomId === 'all' ? undefined : selectedRoomId,
      });
    }
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 mb-16">
      <div className="bg-white rounded-2xl shadow-luxury border border-hotel-gold/30 p-4 sm:p-6 overflow-hidden">
        {/* Booking Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center space-x-2 bg-hotel-sand/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setBookingType('daily')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                bookingType === 'daily'
                  ? 'bg-hotel-navy text-white shadow-md'
                  : 'text-gray-600 hover:text-hotel-navy'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-hotel-gold" />
              <span>{t('booking.tab_daily')}</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingType('hourly')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                bookingType === 'hourly'
                  ? 'bg-hotel-navy text-white shadow-md'
                  : 'text-gray-600 hover:text-hotel-navy'
              }`}
            >
              <Clock className="w-4 h-4 text-hotel-gold" />
              <span>{t('booking.tab_hourly')}</span>
            </button>
          </div>

          {/* Standard Checkin / Checkout Notice */}
          <div className="hidden md:flex items-center gap-2 text-xs text-hotel-navy bg-hotel-gold/15 px-3.5 py-1.5 rounded-full border border-hotel-gold/30">
            <Info className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span className="font-medium">{t('booking.standard_times')}</span>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          {bookingType === 'daily' ? (
            <>
              {/* Daily: Check In */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {t('booking.checkin')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkInDate}
                    min={today}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                    required
                  />
                </div>
              </div>

              {/* Daily: Check Out */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {t('booking.checkout')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate || today}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Hourly: Date */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {t('booking.date')}
                </label>
                <input
                  type="date"
                  value={stayDate}
                  min={today}
                  onChange={(e) => setStayDate(e.target.value)}
                  className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                  required
                />
              </div>

              {/* Hourly: Check-in Time */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {t('booking.checkin_time')}
                </label>
                <select
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
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

              {/* Hourly: Duration */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  {t('booking.duration')}
                </label>
                <select
                  value={hoursCount}
                  onChange={(e) => setHoursCount(Number(e.target.value))}
                  className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                >
                  <option value={2}>2 Giờ (Tiêu chuẩn)</option>
                  <option value={3}>3 Giờ</option>
                  <option value={4}>4 Giờ</option>
                  <option value={6}>6 Giờ</option>
                </select>
              </div>
            </>
          )}

          {/* Guests Count */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              {t('booking.guests')}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
              >
                <option value={1}>1 {t('booking.adults')}</option>
                <option value={2}>2 {t('booking.adults')}</option>
                <option value={3}>3 {t('booking.adults')}</option>
                <option value={4}>4 {t('booking.adults')}</option>
              </select>
            </div>
          </div>

          {/* Room Type Filter */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              {t('booking.room_type')}
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-hotel-sand/40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            >
              <option value="all">{t('booking.all_rooms')}</option>
              {roomsData.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name[lang]}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-hotel-navy to-hotel-deep hover:from-hotel-deep hover:to-hotel-navy text-hotel-gold font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 h-[42px]"
            >
              <Search className="w-4 h-4 text-hotel-gold" />
              <span>{t('booking.search_btn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
