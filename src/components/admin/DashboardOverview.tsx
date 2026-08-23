import React from 'react';
import { useBookings } from '../../context/BookingContext';
import { BookingRecord } from '../../types';
import { CalendarCheck, DollarSign, Clock, Users, BedDouble, AlertCircle, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateToTab }) => {
  const { bookings, rooms } = useBookings();

  // Calculations
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length;
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(b => b.checkInDate === today && b.status !== 'cancelled').length;
  const todayCheckOuts = bookings.filter(b => b.checkOutDate === today && b.status !== 'cancelled').length;

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const dailyCount = bookings.filter(b => b.bookingType === 'daily').length;
  const hourlyCount = bookings.filter(b => b.bookingType === 'hourly').length;

  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRooms / (rooms.length || 1)) * 100);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Chờ duyệt</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đã duyệt</span>;
      case 'checked_in':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 flex items-center gap-1"><BedDouble className="w-3 h-3" /> Đang ở</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">Hoàn tất</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Alert if pending bookings */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">
                Có {pendingCount} đơn đặt phòng mới đang chờ duyệt!
              </h4>
              <p className="text-xs text-amber-800">
                Vui lòng kiểm tra và gọi điện xác nhận cho khách hàng sớm nhất.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('bookings')}
            className="btn-magnetic px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Duyệt ngay →
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Doanh thu ước tính */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Doanh Thu Dự Kiến</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif font-extrabold text-2xl text-hotel-navy">
            {formatVND(totalRevenue)}
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-green-600 font-bold">+{confirmedCount} đơn</span> đã xác nhận & hoàn tất
          </div>
        </div>

        {/* Tổng số đơn đặt */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Đơn Đặt</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif font-extrabold text-2xl text-hotel-navy">
            {totalBookings} <span className="text-sm font-sans font-normal text-gray-500">đơn</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-2">
            <span className="text-blue-600 font-bold">{dailyCount} theo Ngày</span> • 
            <span className="text-purple-600 font-bold">{hourlyCount} theo Giờ</span>
          </div>
        </div>

        {/* Check-in / Out Hôm Nay */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Nhận / Trả Hôm Nay</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif font-extrabold text-2xl text-hotel-navy">
            {todayCheckIns} <span className="text-sm font-sans font-normal text-gray-500">vào /</span> {todayCheckOuts} <span className="text-sm font-sans font-normal text-gray-500">ra</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            Ngày: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* Tỷ lệ phòng có khách */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Tình Trạng Phòng</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif font-extrabold text-2xl text-hotel-navy">
            {rooms.length} <span className="text-sm font-sans font-normal text-gray-500">hạng phòng</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-2">
            <span className="text-green-600 font-bold">{rooms.filter(r => r.status === 'available').length} Trống</span> •
            <span className="text-red-500 font-bold">{rooms.filter(r => r.status === 'occupied').length} Có khách</span>
          </div>
        </div>

      </div>

      {/* Second Row: Breakdown Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking Distribution Card */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-hotel-navy">
                Phân Bố Loại Hình Thuê Phòng
              </h3>
              <p className="text-xs text-gray-500">
                Thống kê đặt phòng theo đêm và đặt phòng theo giờ
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('bookings')}
              className="text-xs text-hotel-goldDark hover:underline font-bold flex items-center gap-1"
            >
              <span>Xem chi tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span>Thuê Theo Ngày / Qua Đêm ({dailyCount} đơn)</span>
                <span>{totalBookings ? Math.round((dailyCount / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-hotel-navy to-hotel-gold rounded-full transition-all duration-1000"
                  style={{ width: `${totalBookings ? (dailyCount / totalBookings) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span>Thuê Theo Giờ Linh Hoạt ({hourlyCount} đơn)</span>
                <span>{totalBookings ? Math.round((hourlyCount / totalBookings) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-1000"
                  style={{ width: `${totalBookings ? (hourlyCount / totalBookings) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="bg-hotel-sand/40 p-3 rounded-2xl">
              <span className="text-[11px] text-gray-500 block">Đang Ở</span>
              <span className="font-bold text-hotel-navy text-base">{bookings.filter(b => b.status === 'checked_in').length}</span>
            </div>
            <div className="bg-hotel-sand/40 p-3 rounded-2xl">
              <span className="text-[11px] text-gray-500 block">Đã Xác Nhận</span>
              <span className="font-bold text-hotel-navy text-base">{bookings.filter(b => b.status === 'confirmed').length}</span>
            </div>
            <div className="bg-hotel-sand/40 p-3 rounded-2xl">
              <span className="text-[11px] text-gray-500 block">Chờ Duyệt</span>
              <span className="font-bold text-amber-600 text-base">{pendingCount}</span>
            </div>
            <div className="bg-hotel-sand/40 p-3 rounded-2xl">
              <span className="text-[11px] text-gray-500 block">Hoàn Tất</span>
              <span className="font-bold text-green-600 text-base">{bookings.filter(b => b.status === 'completed').length}</span>
            </div>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="bg-gradient-to-br from-hotel-navy to-hotel-dark text-white p-6 sm:p-8 rounded-3xl shadow-luxury flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-hotel-gold bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
              LỄ TÂN GALAXY
            </span>
            <h3 className="font-serif font-bold text-xl mb-2 text-white">
              Thao Tác Nhanh
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Truy cập nhanh các nghiệp vụ lễ tân tiếp đón khách và quản lý phòng.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onNavigateToTab('bookings')}
                className="btn-magnetic w-full py-3 px-4 rounded-xl bg-hotel-gold text-hotel-navy font-bold text-xs uppercase tracking-wider flex items-center justify-between"
              >
                <span>Quản Lý Đơn Đặt Phòng</span>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigateToTab('rooms')}
                className="btn-magnetic w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-between"
              >
                <span>Cập Nhật Bảng Giá & Phòng</span>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigateToTab('calendar')}
                className="btn-magnetic w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-between"
              >
                <span>Xem Sơ Đồ Lịch Phòng</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-gray-400">
            Hotline khách sạn: <strong className="text-white">028 2248 7782</strong>
          </div>
        </div>

      </div>

      {/* Recent Bookings Table Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-hotel-navy">
              Đơn Đặt Phòng Gần Đây
            </h3>
            <p className="text-xs text-gray-500">
              5 đơn đặt phòng mới nhất được ghi nhận vào hệ thống
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('bookings')}
            className="btn-magnetic px-4 py-2 bg-hotel-sand hover:bg-hotel-sand/80 text-hotel-navy font-bold text-xs rounded-xl"
          >
            Xem tất cả đơn →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Hạng Phòng</th>
                <th className="py-3 px-4">Hình Thức</th>
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4 rounded-r-xl">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-hotel-navy">{b.bookingCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{b.guestName}</div>
                    <div className="text-gray-400 text-[11px]">{b.guestPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{b.roomName}</td>
                  <td className="py-3.5 px-4">
                    {b.bookingType === 'daily' ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">Theo Đêm ({b.nightsCount}N)</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">Theo Giờ ({b.hoursCount}H)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <div>{b.checkInDate} ({b.checkInTime})</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-hotel-navy">{formatVND(b.totalPrice)}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
