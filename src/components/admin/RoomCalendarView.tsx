import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { BookingRecord, RoomLock } from '../../types';
import { 
  ChevronLeft, ChevronRight, Calendar, User, Clock, 
  BedDouble, AlertCircle, Lock, Unlock, Plus, Trash2, 
  CheckCircle2, XCircle, ShieldAlert, Sparkles 
} from 'lucide-react';
import { getLocalDateStr } from '../../utils/dateUtils';

export const RoomCalendarView: React.FC = () => {
  const { 
    bookings, rooms, roomLocks, lockRoom, unlockRoom, 
    getAvailableRoomsCount 
  } = useBookings();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(getLocalDateStr());
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');
  
  // Room Lock Modal state
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockRoomId, setLockRoomId] = useState<string>(rooms[0]?.id || 'phong-don-tiet-kiem');
  const [lockStartDate, setLockStartDate] = useState<string>(getLocalDateStr());
  const [lockEndDate, setLockEndDate] = useState<string>(getLocalDateStr());
  const [lockReason, setLockReason] = useState<string>('Bảo trì / Khóa phòng');
  const [isSubmittingLock, setIsSubmittingLock] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(getLocalDateStr(today));
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
      if (selectedRoomFilter !== 'all' && b.roomId !== selectedRoomFilter) return false;
      if (b.bookingType === 'hourly') {
        return b.checkInDate === dateStr;
      }
      return dateStr >= b.checkInDate && dateStr < b.checkOutDate;
    });
  };

  // Get room locks for a specific date
  const getLocksForDate = (dateStr: string): RoomLock[] => {
    return roomLocks.filter(l => {
      if (selectedRoomFilter !== 'all' && l.roomId !== selectedRoomFilter) return false;
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });
  };

  const selectedDayBookings = getBookingsForDate(selectedDay);
  const selectedDayLocks = getLocksForDate(selectedDay);

  const handleCreateLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockRoomId || !lockStartDate || !lockEndDate) {
      alert('Vui lòng điền đủ ngày bắt đầu và kết thúc');
      return;
    }
    if (lockStartDate > lockEndDate) {
      alert('Ngày bắt đầu không được lớn hơn ngày kết thúc');
      return;
    }

    setIsSubmittingLock(true);
    const success = await lockRoom({
      roomId: lockRoomId,
      startDate: lockStartDate,
      endDate: lockEndDate,
      reason: lockReason || 'Bảo trì / Khóa phòng'
    });
    setIsSubmittingLock(false);

    if (success) {
      setIsLockModalOpen(false);
      alert('Đã khóa phòng thành công!');
    } else {
      alert('Đã lưu khóa phòng');
      setIsLockModalOpen(false);
    }
  };

  const handleQuickUnlock = async (lockId: string) => {
    if (window.confirm('Bạn có chắc muốn mở khóa cho phòng này?')) {
      await unlockRoom(lockId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header with Month Navigation & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6943] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Sơ Đồ Phòng Realtime</span>
          </div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight font-serif">
            Sơ Đồ Lịch & Khóa Phòng
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Xem phòng trống theo ngày, số lượng phòng tồn thực tế và thiết lập khóa ngày (bảo trì / hết phòng).
          </p>
        </div>

        {/* Month Navigation & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Room Filter */}
          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="text-xs font-bold bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-[#C29A64]"
          >
            <option value="all">Tất cả {rooms.length} hạng phòng</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name.vi}</option>
            ))}
          </select>

          {/* Month Stepper */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-1.5 rounded-xl border border-neutral-200">
            <button
              onClick={prevMonth}
              title="Tháng trước"
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 flex items-center justify-center shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-sans font-bold text-xs sm:text-sm text-neutral-900 px-2 min-w-[120px] text-center">
              {monthNames[month]}, {year}
            </span>

            <button
              onClick={nextMonth}
              title="Tháng sau"
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 flex items-center justify-center shadow-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
          >
            Hôm nay
          </button>

          {/* Lock Room Button */}
          <button
            onClick={() => {
              setLockStartDate(selectedDay);
              setLockEndDate(selectedDay);
              setIsLockModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Khóa Phòng / Chặn Ngày</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Matrix (Left) + Selected Day Room Inventory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
            <div className="font-bold text-neutral-800 text-sm">
              Lịch Tháng {month + 1}/{year}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Có đơn đặt</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Đã khóa phòng</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Còn phòng</span>
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            <span className="text-red-500">CN</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-neutral-50/40 border border-transparent" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayBookings = getBookingsForDate(dateStr);
              const dayLocks = getLocksForDate(dateStr);
              const isSelected = selectedDay === dateStr;
              const isToday = getLocalDateStr() === dateStr;
              const dayOfWeek = new Date(year, month, dayNum).getDay();
              const isSunday = dayOfWeek === 0;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-[#C29A64] bg-[#FAF6F0] ring-2 ring-[#C29A64] shadow-md' 
                      : isToday 
                        ? 'border-blue-400 bg-blue-50/40 shadow-xs' 
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${
                      isToday 
                        ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]' 
                        : isSunday ? 'text-red-600' : 'text-neutral-800'
                    }`}>
                      {dayNum}
                    </span>

                    <div className="flex items-center gap-1">
                      {dayLocks.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Có phòng bị khóa" />
                      )}
                      {dayBookings.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Có đơn đặt phòng" />
                      )}
                    </div>
                  </div>

                  {/* Booking / Lock summary badges */}
                  <div className="space-y-1">
                    {dayLocks.length > 0 && (
                      <div className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-bold truncate flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-red-600 shrink-0" />
                        <span>{dayLocks.length} khóa</span>
                      </div>
                    )}

                    {dayBookings.length > 0 ? (
                      <div className="text-[9px] bg-neutral-900 text-white px-1.5 py-0.5 rounded font-bold truncate">
                        {dayBookings.length} đơn đặt
                      </div>
                    ) : (
                      dayLocks.length === 0 && (
                        <div className="text-[9px] text-emerald-600 font-bold truncate hidden sm:block">
                          ✓ Trống
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Day Room Availability & Bookings Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card: Selected Date Overview */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8A6943]" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-neutral-900 tracking-tight">
                    Ngày: {new Date(selectedDay).toLocaleDateString('vi-VN')}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {selectedDayBookings.length} đơn đặt • {selectedDayLocks.length} phòng khóa
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setLockStartDate(selectedDay);
                  setLockEndDate(selectedDay);
                  setIsLockModalOpen(true);
                }}
                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Khóa phòng vào ngày này"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Khóa</span>
              </button>
            </div>

            {/* Room Inventory & Availability Matrix on this selected day */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Tình Trạng Từng Hạng Phòng ({selectedDay}):
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {rooms.map(room => {
                  const total = room.totalInventory ?? 4;
                  const available = getAvailableRoomsCount(room.id, selectedDay);
                  const isLocked = selectedDayLocks.some(l => l.roomId === room.id);
                  const activeBookingsCount = total - available - (isLocked ? 1 : 0);

                  return (
                    <div
                      key={room.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        isLocked
                          ? 'bg-red-50/70 border-red-200 text-red-900'
                          : available === 0
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-500'
                            : 'bg-[#FAF9F5] border-neutral-200/70 text-neutral-900'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold truncate">{room.name.vi}</div>
                        <div className="text-[10px] text-neutral-500">
                          Tổng tồn: <strong>{total} phòng</strong> • Đã đặt: <strong>{activeBookingsCount}</strong>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-800">
                            <Lock className="w-3 h-3" /> Đã khóa
                          </span>
                        ) : available === 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                            Hết phòng
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Còn {available}/{total} phòng
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Locks on this day */}
            {selectedDayLocks.length > 0 && (
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Phòng Đang Bị Khóa ({selectedDayLocks.length})</span>
                </div>

                <div className="space-y-1.5">
                  {selectedDayLocks.map(lock => {
                    const roomObj = rooms.find(r => r.id === lock.roomId);
                    return (
                      <div key={lock.id} className="p-2.5 rounded-xl bg-red-100/60 border border-red-200 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-red-900">{roomObj?.name.vi || lock.roomId}</div>
                          <div className="text-[10px] text-red-700">
                            {lock.startDate} ➔ {lock.endDate} ({lock.reason || 'Bảo trì'})
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickUnlock(lock.id)}
                          className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded text-[10px] font-bold shadow-xs flex items-center gap-1"
                        >
                          <Unlock className="w-3 h-3" /> Mở khóa
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bookings on this day */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Đơn Đặt Phòng Trong Ngày ({selectedDayBookings.length}):
              </div>

              {selectedDayBookings.length === 0 ? (
                <div className="py-6 text-center text-neutral-400 text-xs">
                  <BedDouble className="w-8 h-8 mx-auto mb-1 text-neutral-300" />
                  <p>Không có đơn đặt phòng nào trong ngày này.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedDayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">{b.bookingCode}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                          {b.bookingType === 'daily' ? 'Theo Ngày' : 'Theo Giờ'}
                        </span>
                      </div>
                      <div className="font-medium text-neutral-700">{b.roomName}</div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-neutral-400" />
                        <span>{b.guestName} - {b.guestPhone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Lock Room Modal */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2 text-red-600">
                <Lock className="w-5 h-5" />
                <h3 className="font-bold text-base text-neutral-900">Khóa Phòng / Chặn Ngày Đặt</h3>
              </div>
              <button
                onClick={() => setIsLockModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Chọn Hạng Phòng Cần Khóa *</label>
                <select
                  value={lockRoomId}
                  onChange={(e) => setLockRoomId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 font-bold text-neutral-900 focus:outline-none focus:border-red-500"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name.vi} (Tồn: {r.totalInventory ?? 4} phòng)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Từ Ngày *</label>
                  <input
                    type="date"
                    required
                    value={lockStartDate}
                    onChange={(e) => setLockStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-300 font-bold focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Đến Hết Ngày *</label>
                  <input
                    type="date"
                    required
                    value={lockEndDate}
                    onChange={(e) => setLockEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-300 font-bold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Lý Do Khóa / Ghi Chú</label>
                <input
                  type="text"
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  placeholder="VD: Sửa chữa máy lạnh / Khách đoàn bao phòng..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-800 text-[11px] leading-relaxed">
                ⚠️ <strong>Lưu ý:</strong> Khi đã khóa, khách hàng trên website sẽ thấy phòng này báo <strong>"Đã khóa" / "Hết phòng"</strong> và hệ thống sẽ tự động chặn không cho đặt trong khoảng ngày đã chọn.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsLockModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-600 font-bold hover:bg-neutral-50"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLock}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition-all"
                >
                  {isSubmittingLock ? 'Đang khóa...' : 'Xác Nhận Khóa Phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
