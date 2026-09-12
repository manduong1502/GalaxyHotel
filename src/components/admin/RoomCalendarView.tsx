import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { BookingRecord, RoomLock } from '../../types';
import { 
  ChevronLeft, ChevronRight, Calendar, User, Clock, 
  BedDouble, AlertCircle, Lock, Unlock, Plus, Trash2, 
  CheckCircle2, XCircle, ShieldAlert, Sparkles, Layers, 
  Sliders, RefreshCw, Info, Edit3, ArrowRight
} from 'lucide-react';
import { getLocalDateStr, getTomorrowDateStr, formatDateVi } from '../../utils/dateUtils';

export const RoomCalendarView: React.FC = () => {
  const { 
    bookings, rooms, roomLocks, lockRoom, unlockRoom, 
    getAvailableRoomsCount 
  } = useBookings();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(getLocalDateStr());
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'inventory' | 'lock'>('inventory');
  const [targetRoomId, setTargetRoomId] = useState<string>(rooms[0]?.id || 'phong-don-tiet-kiem');
  const [startDate, setStartDate] = useState<string>(getLocalDateStr());
  const [endDate, setEndDate] = useState<string>(getLocalDateStr());
  const [customInventoryCount, setCustomInventoryCount] = useState<number>(4);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Calendar calculations (Monday = 0 ... Sunday = 6)
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0 is Sun
  const firstDayIndex = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
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

  // Get active settings (locks or custom inventory) for a specific date
  const getSettingsForDate = (dateStr: string): RoomLock[] => {
    return roomLocks.filter(l => {
      if (selectedRoomFilter !== 'all' && l.roomId !== selectedRoomFilter) return false;
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });
  };

  const selectedDayBookings = getBookingsForDate(selectedDay);
  const selectedDaySettings = getSettingsForDate(selectedDay);
  const selectedDayLocks = selectedDaySettings.filter(s => s.isLocked === true && (!s.customInventory || s.customInventory <= 0));
  const selectedDayCustomInventories = selectedDaySettings.filter(s => typeof s.customInventory === 'number' && s.customInventory > 0 && !s.isLocked);

  // Open modal pre-configured
  const handleOpenSetupModal = (mode: 'inventory' | 'lock', roomId?: string, date?: string) => {
    setModalMode(mode);
    const chosenRoomId = roomId || (selectedRoomFilter !== 'all' ? selectedRoomFilter : (rooms[0]?.id || 'phong-don-tiet-kiem'));
    setTargetRoomId(chosenRoomId);
    
    const targetRoom = rooms.find(r => r.id === chosenRoomId);
    const targetDate = date || selectedDay;
    setStartDate(targetDate);
    setEndDate(targetDate);
    
    if (mode === 'inventory') {
      const activeSetting = roomLocks.find(l => l.roomId === chosenRoomId && targetDate >= l.startDate && targetDate <= l.endDate);
      const currentQuota = (activeSetting && typeof activeSetting.customInventory === 'number' && activeSetting.customInventory > 0)
        ? activeSetting.customInventory
        : (targetRoom?.totalInventory ?? 4);
      setCustomInventoryCount(currentQuota);
      setReason(activeSetting?.reason || 'Điều chỉnh tồn mở bán theo ngày');
    } else {
      setReason('Bảo trì / Tạm khóa phòng');
    }
    
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoomId || !startDate || !endDate) {
      alert('Vui lòng điền đủ ngày bắt đầu và kết thúc');
      return;
    }
    if (startDate > endDate) {
      alert('Ngày bắt đầu không được lớn hơn ngày kết thúc');
      return;
    }

    setIsSubmitting(true);
    const isLockMode = modalMode === 'lock';

    const success = await lockRoom({
      roomId: targetRoomId,
      startDate: startDate,
      endDate: endDate,
      isLocked: isLockMode,
      customInventory: isLockMode ? 0 : Math.max(0, customInventoryCount),
      reason: reason || (isLockMode ? 'Bảo trì / Khóa phòng' : `Cài tồn ${customInventoryCount} phòng`)
    });

    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      alert(isLockMode ? 'Đã khóa phòng thành công!' : `Đã cài đặt tồn ${customInventoryCount} phòng thành công!`);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleQuickUnlockOrDelete = async (lockId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa cài đặt này và hoàn về mặc định?')) {
      await unlockRoom(lockId);
    }
  };

  const handleQuickToggleLock = async (roomId: string, dateStr: string) => {
    const existingLock = roomLocks.find(l => l.roomId === roomId && dateStr >= l.startDate && dateStr <= l.endDate && l.isLocked);
    if (existingLock) {
      await unlockRoom(existingLock.id);
    } else {
      await lockRoom({
        roomId: roomId,
        startDate: dateStr,
        endDate: dateStr,
        isLocked: true,
        customInventory: 0,
        reason: 'Khóa nhanh từ sơ đồ lịch'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header with Month Navigation & Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6943] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Sơ Đồ Phòng Realtime & Tồn Theo Ngày</span>
          </div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight font-serif">
            Sơ Đồ Lịch & Tồn Phòng Theo Ngày
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cài đặt số lượng phòng tồn/mở bán theo từng ngày, thiết lập khóa ngày (bảo trì) và kiểm tra đơn đặt realtime.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Room Selector Filter */}
          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="text-xs font-bold bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-[#C29A64]"
          >
            <option value="all">Tất cả {rooms.length} hạng phòng</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name.vi} (Mặc định: {r.totalInventory ?? 4}p)</option>
            ))}
          </select>

          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-neutral-200">
            <button
              onClick={prevMonth}
              title="Tháng trước"
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 flex items-center justify-center shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-sans font-bold text-xs sm:text-sm text-neutral-900 px-2.5 min-w-[120px] text-center">
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

          {/* Button: Cài Tồn Phòng Theo Ngày */}
          <button
            onClick={() => handleOpenSetupModal('inventory')}
            className="px-3.5 py-2 rounded-xl bg-[#8A6943] hover:bg-[#725433] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cài Tồn Ngày</span>
          </button>

          {/* Button: Khóa Phòng / Chặn Ngày */}
          <button
            onClick={() => handleOpenSetupModal('lock')}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Khóa / Chặn Ngày</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Matrix (Left) + Selected Day Room Inventory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid (8 Cols on Desktop) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          
          {/* Header Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
            <div className="font-bold text-neutral-800 text-sm">
              Lịch {monthNames[month]}/{year} {selectedRoomFilter !== 'all' && `— ${rooms.find(r => r.id === selectedRoomFilter)?.name.vi}`}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Còn phòng</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Có tồn riêng</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Có đơn đặt</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Đã khóa</span>
              </span>
            </div>
          </div>

          {/* Weekday headers (Monday first) */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-black text-neutral-400 uppercase tracking-wider">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span className="text-red-500">CN</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-neutral-50/40 border border-transparent" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayBookings = getBookingsForDate(dateStr);
              const daySettings = getSettingsForDate(dateStr);
              const isSelected = selectedDay === dateStr;
              const isToday = getLocalDateStr() === dateStr;
              const dayOfWeek = new Date(year, month, dayNum).getDay();
              const isSunday = dayOfWeek === 0;

              // If filtered by specific room
              let singleRoomAvailable = 0;
              let singleRoomLocked = false;
              let singleRoomCustomInv: number | null = null;
              if (selectedRoomFilter !== 'all') {
                singleRoomAvailable = getAvailableRoomsCount(selectedRoomFilter, dateStr);
                const sSetting = daySettings.find(s => s.roomId === selectedRoomFilter);
                if (sSetting?.isLocked && (!sSetting.customInventory || sSetting.customInventory <= 0)) {
                  singleRoomLocked = true;
                }
                if (sSetting && typeof sSetting.customInventory === 'number' && sSetting.customInventory > 0 && !sSetting.isLocked) {
                  singleRoomCustomInv = sSetting.customInventory;
                }
              }

              const hasLocks = daySettings.some(s => s.isLocked === true && (!s.customInventory || s.customInventory <= 0));
              const hasCustomInv = daySettings.some(s => typeof s.customInventory === 'number' && s.customInventory > 0 && !s.isLocked);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected 
                      ? 'border-[#C29A64] bg-[#FAF6F0] ring-2 ring-[#C29A64] shadow-md' 
                      : isToday 
                        ? 'border-blue-400 bg-blue-50/30 shadow-xs' 
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
                      {hasLocks && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Có phòng bị khóa" />
                      )}
                      {hasCustomInv && (
                        <span className="w-2 h-2 rounded-full bg-purple-600" title="Có tồn mở bán riêng" />
                      )}
                      {dayBookings.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Có đơn đặt" />
                      )}
                    </div>
                  </div>

                  {/* Cell details */}
                  <div className="space-y-1">
                    {selectedRoomFilter !== 'all' ? (
                      /* Single room view */
                      singleRoomLocked ? (
                        <div className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-1 py-0.5 rounded font-bold truncate flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5 shrink-0" />
                          <span>Khóa</span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div className={`text-[9px] px-1 py-0.2 rounded font-bold truncate ${
                            singleRoomAvailable > 0 
                              ? 'text-emerald-700 bg-emerald-50' 
                              : 'text-neutral-500 bg-neutral-100'
                          }`}>
                            {singleRoomAvailable > 0 ? `Còn ${singleRoomAvailable}p` : 'Hết phòng'}
                          </div>
                          {singleRoomCustomInv !== null && (
                            <div className="text-[8px] text-purple-700 font-bold truncate">
                              Tồn: {singleRoomCustomInv}p
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      /* All rooms view */
                      <div className="space-y-0.5">
                        {hasLocks && (
                          <div className="text-[9px] bg-red-100 text-red-800 px-1 py-0.2 rounded font-bold truncate flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5 shrink-0 text-red-600" />
                            <span>Khóa</span>
                          </div>
                        )}
                        {dayBookings.length > 0 && (
                          <div className="text-[9px] bg-neutral-900 text-white px-1 py-0.2 rounded font-bold truncate">
                            {dayBookings.length} đơn
                          </div>
                        )}
                        {!hasLocks && dayBookings.length === 0 && (
                          <div className="text-[9px] text-emerald-600 font-bold truncate hidden sm:block">
                            ✓ Trống
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-600">
              <Info className="w-4 h-4 text-[#8A6943] shrink-0" />
              <span>
                Nhấp vào bất kỳ ngày nào để xem chi tiết tồn từng phòng, khóa phòng nhanh hoặc điều chỉnh số lượng tồn mở bán.
              </span>
            </div>
            <button
              onClick={() => handleOpenSetupModal('inventory', undefined, selectedDay)}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-800 shadow-2xs shrink-0 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#8A6943]" />
              <span>Cài Tồn Ngày {formatDateVi(selectedDay)}</span>
            </button>
          </div>

        </div>

        {/* Selected Day Inspector Sidebar (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card: Selected Date Overview & Room Availability Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#8A6943]" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-neutral-900 tracking-tight">
                    {formatDateVi(selectedDay)}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {selectedDayBookings.length} đơn đặt • {selectedDayLocks.length} khóa • {selectedDayCustomInventories.length} tồn riêng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenSetupModal('inventory', undefined, selectedDay)}
                  className="p-1.5 bg-[#FAF6F0] text-[#8A6943] hover:bg-[#F2ECE1] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Cài đặt tồn phòng cho ngày này"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cài Tồn</span>
                </button>
                <button
                  onClick={() => handleOpenSetupModal('lock', undefined, selectedDay)}
                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Khóa phòng vào ngày này"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Khóa</span>
                </button>
              </div>
            </div>

            {/* Room Inventory & Availability Matrix on this selected day */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Tình Trạng Từng Hạng Phòng:</span>
                <span>Ngày: {selectedDay}</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {rooms.map(room => {
                  const defaultTotal = room.totalInventory ?? 4;
                  const available = getAvailableRoomsCount(room.id, selectedDay);
                  const activeSetting = selectedDaySettings.find(s => s.roomId === room.id);
                  
                  const isLocked = activeSetting?.isLocked === true && (!activeSetting.customInventory || activeSetting.customInventory <= 0);
                  const hasCustomInv = activeSetting && typeof activeSetting.customInventory === 'number' && activeSetting.customInventory > 0 && !activeSetting.isLocked;
                  const activeTotal = hasCustomInv ? activeSetting.customInventory! : defaultTotal;
                  
                  // Count active bookings for this room on this day
                  const dayRoomBookings = selectedDayBookings.filter(b => b.roomId === room.id);
                  const activeBookingsCount = dayRoomBookings.length;

                  return (
                    <div
                      key={room.id}
                      className={`p-3 rounded-2xl border text-xs space-y-2 transition-all ${
                        isLocked
                          ? 'bg-red-50/60 border-red-200'
                          : hasCustomInv
                            ? 'bg-purple-50/40 border-purple-200'
                            : available === 0
                              ? 'bg-neutral-50 border-neutral-200'
                              : 'bg-[#FAF9F5] border-neutral-200/80'
                      }`}
                    >
                      {/* Room title & badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-neutral-900">{room.name.vi}</div>
                          <div className="text-[10px] text-neutral-500">
                            Mặc định: <strong>{defaultTotal} phòng</strong>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <div>
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                              <Lock className="w-2.5 h-2.5" /> Đã khóa
                            </span>
                          ) : hasCustomInv ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              <Sliders className="w-2.5 h-2.5" /> Tồn ngày: {activeTotal}p
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                              Tồn gốc: {defaultTotal}p
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock calculation line */}
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-neutral-200/60 text-[11px]">
                        <div className="text-neutral-600">
                          Mở bán: <strong>{activeTotal}</strong> • Đã đặt: <strong>{activeBookingsCount}</strong>
                        </div>
                        <div>
                          {isLocked ? (
                            <span className="text-red-700 font-bold">Chặn đặt</span>
                          ) : available === 0 ? (
                            <span className="text-neutral-500 font-bold">Hết phòng</span>
                          ) : (
                            <span className="text-emerald-700 font-bold">Còn {available} phòng</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Action Buttons for this specific room */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100 text-[10px] font-bold">
                        <button
                          onClick={() => handleOpenSetupModal('inventory', room.id, selectedDay)}
                          className="flex-1 py-1 px-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Edit3 className="w-3 h-3 text-[#8A6943]" />
                          <span>Cài Tồn</span>
                        </button>

                        <button
                          onClick={() => handleQuickToggleLock(room.id, selectedDay)}
                          className={`flex-1 py-1 px-2 border rounded-lg flex items-center justify-center gap-1 shadow-2xs ${
                            isLocked 
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Unlock className="w-3 h-3" /> Mở Khóa
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" /> Khóa
                            </>
                          )}
                        </button>

                        {activeSetting && (
                          <button
                            onClick={() => handleQuickUnlockOrDelete(activeSetting.id)}
                            title="Xóa cài đặt riêng và về tồn mặc định"
                            className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Overrides / Locks List on this day */}
            {selectedDaySettings.length > 0 && (
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <div className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#8A6943]" />
                    <span>Cài Đặt Riêng Áp Dụng ({selectedDaySettings.length})</span>
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                  {selectedDaySettings.map(setting => {
                    const roomObj = rooms.find(r => r.id === setting.roomId);
                    const isLock = setting.isLocked && (!setting.customInventory || setting.customInventory <= 0);
                    return (
                      <div 
                        key={setting.id} 
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          isLock 
                            ? 'bg-red-100/60 border-red-200 text-red-900' 
                            : 'bg-purple-100/60 border-purple-200 text-purple-900'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div className="font-bold truncate">
                            {roomObj?.name.vi || setting.roomId} — {isLock ? 'Đã Khóa' : `Tồn: ${setting.customInventory}p`}
                          </div>
                          <div className="text-[10px] opacity-80 truncate">
                            {setting.startDate} ➔ {setting.endDate} • {setting.reason || (isLock ? 'Bảo trì' : 'Tồn riêng')}
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickUnlockOrDelete(setting.id)}
                          className="px-2 py-1 bg-white hover:bg-neutral-50 border border-neutral-300 rounded text-[10px] font-bold shadow-xs shrink-0 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bookings on this day */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Đơn Đặt Phòng Trong Ngày:</span>
                <span className="font-bold text-neutral-800">{selectedDayBookings.length} đơn</span>
              </div>

              {selectedDayBookings.length === 0 ? (
                <div className="py-4 text-center text-neutral-400 text-xs">
                  <BedDouble className="w-6 h-6 mx-auto mb-1 text-neutral-300" />
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

      {/* Unified Setup Modal: Cài Tồn Phòng & Khóa Phòng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-neutral-200 shadow-2xl space-y-5 animate-modal-pop">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {modalMode === 'inventory' ? 'Cài Đặt Tồn Phòng Theo Ngày' : 'Khóa Phòng / Chặn Đặt'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Thiết lập cho từng khoảng ngày hoặc ngày cụ thể
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalMode('inventory')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === 'inventory' 
                    ? 'bg-white text-[#8A6943] shadow-xs' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Cài Tồn Mở Bán</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode('lock')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === 'lock' 
                    ? 'bg-white text-red-600 shadow-xs' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Khóa Bảo Trì / Chặn</span>
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              {/* Room Selector */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Chọn Hạng Phòng Áp Dụng *</label>
                <select
                  value={targetRoomId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setTargetRoomId(newId);
                    const rm = rooms.find(r => r.id === newId);
                    if (modalMode === 'inventory') {
                      setCustomInventoryCount(rm?.totalInventory ?? 4);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 font-bold text-neutral-900 focus:outline-none focus:border-[#C29A64]"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name.vi} (Mặc định gốc: {r.totalInventory ?? 4} phòng)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Từ Ngày *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-300 font-bold focus:outline-none focus:border-[#C29A64]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Đến Hết Ngày *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-neutral-300 font-bold focus:outline-none focus:border-[#C29A64]"
                  />
                </div>
              </div>

              {/* Custom Inventory Counter (Only in inventory mode) */}
              {modalMode === 'inventory' && (
                <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-neutral-900 text-xs">
                        Số Lượng Phòng Mở Bán (Tồn Ngày) *
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Số phòng cho phép khách đặt vào các ngày đã chọn
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomInventoryCount(prev => Math.max(0, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 hover:bg-neutral-100 flex items-center justify-center text-sm shadow-2xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={customInventoryCount}
                        onChange={(e) => setCustomInventoryCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-14 text-center py-1 rounded-lg border border-neutral-300 font-bold text-sm focus:outline-none focus:border-[#C29A64]"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomInventoryCount(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-neutral-300 font-bold text-neutral-800 hover:bg-neutral-100 flex items-center justify-center text-sm shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-200/60">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Gợi ý nhanh:</span>
                    {[0, 1, 2, 3, 4, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCustomInventoryCount(num)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          customInventoryCount === num 
                            ? 'bg-[#8A6943] text-white border-[#8A6943]' 
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        {num}p
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason / Note */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Lý Do / Ghi Chú</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={modalMode === 'inventory' ? 'VD: Mở thêm phòng ngày lễ / Sự kiện' : 'VD: Sửa máy lạnh / Bao đoàn'}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#C29A64]"
                />
              </div>

              {/* Explanatory banner */}
              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                modalMode === 'lock' 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                {modalMode === 'lock' ? (
                  <>
                    🔒 <strong>Khóa phòng:</strong> Khách đặt phòng trên web trong khoảng ngày từ <strong>{startDate}</strong> đến <strong>{endDate}</strong> sẽ thấy phòng báo <strong>"Đã Khóa"</strong> và bị chặn không thể đặt.
                  </>
                ) : (
                  <>
                    📦 <strong>Tồn theo ngày:</strong> Trong khoảng ngày từ <strong>{startDate}</strong> đến <strong>{endDate}</strong>, số lượng phòng mở bán thực tế của loại phòng này sẽ là <strong>{customInventoryCount} phòng</strong> (ghi đè số tồn mặc định).
                  </>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-600 font-bold hover:bg-neutral-50"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-sm transition-all active:scale-95 ${
                    modalMode === 'lock' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-[#8A6943] hover:bg-[#725433]'
                  }`}
                >
                  {isSubmitting 
                    ? 'Đang lưu...' 
                    : modalMode === 'lock' 
                      ? 'Xác Nhận Khóa Phòng' 
                      : 'Lưu Cài Đặt Tồn Ngày'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
