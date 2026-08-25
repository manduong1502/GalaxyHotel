import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { roomsData } from '../data/mockData';
import { Calendar as CalendarIcon, Clock, Users, Search, ArrowRight } from 'lucide-react';

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
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16">
      <div className="bg-white rounded-2xl shadow-[0_12px_36px_-12px_rgba(0,0,0,0.12)] border border-neutral-200/90 p-5 sm:p-6">
        
        {/* Type Toggle & Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 mb-5">
          <div className="inline-flex p-1 bg-[#F4F1EA] rounded-xl border border-neutral-200/60">
            <button
              type="button"
              onClick={() => setBookingType('daily')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                bookingType === 'daily'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Thuê theo ngày' : 'Daily Booking'}</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingType('hourly')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                bookingType === 'hourly'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Thuê theo giờ' : 'Hourly Booking'}</span>
            </button>
          </div>

          <div className="hidden md:block text-xs text-neutral-500 font-medium">
            {lang === 'vi' ? 'Nhận phòng từ 14:00 • Trả phòng trước 12:00' : 'Check-in: 14:00 • Check-out: 12:00'}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          {bookingType === 'daily' ? (
            <>
              {/* Daily: Check In */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {lang === 'vi' ? 'Ngày nhận phòng' : 'Check-in Date'}
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  min={today}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>

              {/* Daily: Check Out */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {lang === 'vi' ? 'Ngày trả phòng' : 'Check-out Date'}
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || today}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Hourly: Date */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {lang === 'vi' ? 'Ngày đến' : 'Arrival Date'}
                </label>
                <input
                  type="date"
                  value={stayDate}
                  min={today}
                  onChange={(e) => setStayDate(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>

              {/* Hourly: Check-in Time */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {lang === 'vi' ? 'Giờ nhận phòng' : 'Check-in Time'}
                </label>
                <select
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = String(i).padStart(2, '0');
                    return (
                      <React.Fragment key={hour}>
                        <option value={`${hour}:00`}>{`${hour}:00`}</option>
                        <option value={`${hour}:30`}>{`${hour}:30`}</option>
                      </React.Fragment>
                    );
                  })}
                </select>
              </div>
            </>
          )}

          {/* Room Selection */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              {lang === 'vi' ? 'Hạng phòng' : 'Room Type'}
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="all">{lang === 'vi' ? 'Tất cả các hạng phòng' : 'All Room Types'}</option>
              {roomsData.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name[lang]}
                </option>
              ))}
            </select>
          </div>

          {/* Submit CTA */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="btn-magnetic w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-[#B89369]" />
              <span>{lang === 'vi' ? 'Tìm phòng trống' : 'Search Room'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
