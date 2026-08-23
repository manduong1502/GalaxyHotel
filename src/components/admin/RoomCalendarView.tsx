import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { BookingRecord } from '../../types';
import { ChevronLeft, ChevronRight, Calendar, User, Clock, BedDouble, AlertCircle } from 'lucide-react';

export const RoomCalendarView: React.FC = () => {
  const { bookings, rooms } = useBookings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Get bookings for a specific date (YYYY-MM-DD)
  const getBookingsForDate = (dateStr: string): BookingRecord[] => {
    return bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (b.bookingType === 'hourly') {
        return b.checkInDate === dateStr;
      }
      // Daily booking spans from checkInDate to checkOutDate
      return dateStr >= b.checkInDate && dateStr <= b.checkOutDate;
    });
  };

  const selectedDayBookings = getBookingsForDate(selectedDay);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-2xl text-hotel-navy">
            Sơ Đồ Lịch Phòng Trực Quan
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Theo dõi tình trạng phòng trống và lịch đón khách từng ngày
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-hotel-sand text-hotel-navy flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-serif font-bold text-sm text-hotel-navy px-3 min-w-[120px] text-center">
            {monthNames[month]}, {year}
          </span>

          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-white hover:bg-hotel-sand text-hotel-navy flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <span>CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-gray-50/50 border border-transparent" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayBookings = getBookingsForDate(dateStr);
              const isSelected = selectedDay === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-hotel-gold bg-hotel-sand/40 ring-2 ring-hotel-gold shadow-md' 
                      : isToday 
                        ? 'border-blue-300 bg-blue-50/40' 
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]' : 'text-gray-700'}`}>
                      {dayNum}
                    </span>

                    {dayBookings.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-hotel-goldDark" />
                    )}
                  </div>

                  {/* Booking count tags */}
                  <div className="space-y-1">
                    {dayBookings.length > 0 ? (
                      <div className="text-[10px] bg-hotel-navy text-white px-1.5 py-0.5 rounded-md font-bold truncate">
                        {dayBookings.length} đơn đặt
                      </div>
                    ) : (
                      <div className="text-[10px] text-green-600 font-semibold truncate hidden sm:block">
                        Còn phòng
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Day Bookings Detail Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
              <Calendar className="w-5 h-5 text-hotel-goldDark" />
              <div>
                <h3 className="font-serif font-bold text-lg text-hotel-navy">
                  Lịch Ngày: {new Date(selectedDay).toLocaleDateString('vi-VN')}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {selectedDayBookings.length} lượt đặt phòng đang hoạt động
                </p>
              </div>
            </div>

            {selectedDayBookings.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <BedDouble className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>Chưa có đơn đặt phòng nào trong ngày này.</p>
                <p className="text-[11px] text-green-600 font-semibold mt-1">Toàn bộ 8 hạng phòng đang sẵn sàng!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {selectedDayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-hotel-sand/30 border border-gray-100 hover:border-hotel-gold transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-hotel-navy">{b.bookingCode}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {b.bookingType === 'daily' ? 'Theo Ngày' : 'Theo Giờ'}
                      </span>
                    </div>

                    <div className="font-semibold text-gray-800">{b.roomName}</div>
                    
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <User className="w-3.5 h-3.5 text-hotel-goldDark" />
                      <span>{b.guestName} ({b.guestPhone})</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{b.checkInTime} đến {b.checkOutTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 text-[11px] text-gray-500 border border-gray-100">
            💡 <strong>Mẹo lễ tân:</strong> Nhấp vào bất kỳ ngày nào trên lịch để xem nhanh danh sách khách đến và đi.
          </div>
        </div>

      </div>

    </div>
  );
};
