import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { BookingRecord, BookingStatus, BookingFormData } from '../../types';
import { 
  Search, Filter, Plus, Download, Eye, CheckCircle2, 
  XCircle, Clock, BedDouble, AlertCircle, Phone, Mail, 
  User, Calendar, Trash2, Edit3, X, Save
} from 'lucide-react';

export const BookingsManager: React.FC = () => {
  const { bookings, rooms, updateBookingStatus, deleteBooking, addBooking, syncBookingToGoogleSheets } = useBookings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  
  // Staff notes inside detail modal
  const [editingNotes, setEditingNotes] = useState('');

  // Manual Walk-in Booking Form State
  const [manualForm, setManualForm] = useState<BookingFormData>({
    bookingType: 'daily',
    roomId: rooms[0]?.id || 'phong-a',
    checkInDate: new Date().toISOString().split('T')[0],
    checkInTime: '14:00',
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOutTime: '12:00',
    hoursCount: 2,
    adults: 2,
    children: 0,
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    specialRequests: 'Đặt trực tiếp tại quầy lễ tân',
  });

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestPhone.includes(searchTerm) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesType = typeFilter === 'all' || b.bookingType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setEditingNotes(booking.staffNotes || '');
    setIsDetailModalOpen(true);
  };

  const handleSaveNotes = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, selectedBooking.status, editingNotes);
      setSelectedBooking({ ...selectedBooking, staffNotes: editingNotes });
      alert('Đã lưu ghi chú nội bộ!');
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.guestName || !manualForm.guestPhone) {
      alert('Vui lòng nhập tên và số điện thoại khách hàng!');
      return;
    }

    const room = rooms.find(r => r.id === manualForm.roomId) || rooms[0];
    let calculatedTotal = room.pricePerNight;
    
    if (manualForm.bookingType === 'daily') {
      const d1 = new Date(manualForm.checkInDate);
      const d2 = new Date(manualForm.checkOutDate);
      const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      calculatedTotal = room.pricePerNight * nights;
    } else {
      const hours = manualForm.hoursCount || 2;
      calculatedTotal = hours <= 2 
        ? room.priceHourlyFirst2h 
        : room.priceHourlyFirst2h + (hours - 2) * room.priceHourlyExtra;
    }

    const created = await addBooking(manualForm, calculatedTotal);
    updateBookingStatus(created.id, 'confirmed', 'Đơn tạo trực tiếp tại quầy lễ tân');
    setIsManualBookingOpen(false);
    alert(`Tạo đơn đặt phòng thành công! Mã đơn: ${created.bookingCode}`);
  };

  const handleExportCSV = () => {
    const headers = ['Mã Đơn', 'Loại Đặt', 'Tên Khách', 'SĐT', 'Email', 'Hạng Phòng', 'Ngày Nhận', 'Ngày Trả', 'Tổng Tiền (VNĐ)', 'Trạng Thái', 'Ghi Chú'];
    const rows = filteredBookings.map(b => [
      b.bookingCode,
      b.bookingType === 'daily' ? 'Theo Ngày' : 'Theo Giờ',
      `"${b.guestName}"`,
      `"${b.guestPhone}"`,
      b.guestEmail || '',
      `"${b.roomName}"`,
      b.checkInDate,
      b.checkOutDate,
      b.totalPrice,
      b.status,
      `"${b.specialRequests || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GalaxyHotel_DanhSachDatPhong_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: BookingStatus) => {
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
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-2xl text-hotel-navy">
            Quản Lý Đơn Đặt Phòng
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng {bookings.length} đơn đặt phòng trong cơ sở dữ liệu
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="btn-magnetic px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            title="Xuất file CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất Excel / CSV</span>
          </button>

          <button
            onClick={() => setIsManualBookingOpen(true)}
            className="btn-magnetic px-5 py-2.5 rounded-xl bg-gradient-to-r from-hotel-gold to-hotel-goldDark text-hotel-navy font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Tại Quầy</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Tên khách, Số điện thoại, Mã đơn..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            >
              <option value="all">Tất Cả Trạng Thái</option>
              <option value="pending">Chờ Xác Nhận (Pending)</option>
              <option value="confirmed">Đã Xác Nhận (Confirmed)</option>
              <option value="checked_in">Đang Ở (Checked-In)</option>
              <option value="completed">Đã Hoàn Tất (Completed)</option>
              <option value="cancelled">Đã Hủy (Cancelled)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            >
              <option value="all">Tất Cả Hình Thức</option>
              <option value="daily">Thuê Theo Ngày (Đêm)</option>
              <option value="hourly">Thuê Theo Giờ (Linh Hoạt)</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-400 self-center text-[11px] mr-1">Bộ lọc nhanh:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'confirmed', label: 'Đã duyệt' },
            { id: 'checked_in', label: 'Đang ở' },
            { id: 'completed', label: 'Hoàn tất' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                statusFilter === pill.id
                  ? 'bg-hotel-navy text-hotel-gold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-4">Mã Đơn</th>
                <th className="py-4 px-4">Khách Hàng</th>
                <th className="py-4 px-4">Hạng Phòng</th>
                <th className="py-4 px-4">Loại Thuê</th>
                <th className="py-4 px-4">Thời Gian Nhận / Trả</th>
                <th className="py-4 px-4">Số Khách</th>
                <th className="py-4 px-4">Tổng Tiền</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    Không tìm thấy đơn đặt phòng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Mã Đơn */}
                    <td className="py-3.5 px-4 font-bold text-hotel-navy font-mono text-sm">
                      {b.bookingCode}
                    </td>

                    {/* Khách hàng */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{b.guestName}</div>
                      <a href={`tel:${b.guestPhone}`} className="text-hotel-goldDark text-[11px] font-semibold hover:underline block">
                        {b.guestPhone}
                      </a>
                    </td>

                    {/* Phòng */}
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      {b.roomName}
                    </td>

                    {/* Loại thuê */}
                    <td className="py-3.5 px-4">
                      {b.bookingType === 'daily' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          Theo Đêm ({b.nightsCount}Đ)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                          Theo Giờ ({b.hoursCount}H)
                        </span>
                      )}
                    </td>

                    {/* Thời gian */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="font-medium text-gray-800">{b.checkInDate} ({b.checkInTime})</div>
                      <div className="text-[11px] text-gray-400">đến {b.checkOutDate} ({b.checkOutTime})</div>
                    </td>

                    {/* Số khách */}
                    <td className="py-3.5 px-4 text-gray-700">
                      {b.adults} Lớn {b.children > 0 ? `, ${b.children} Trẻ` : ''}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3.5 px-4 font-bold text-hotel-navy text-sm">
                      {formatVND(b.totalPrice)}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(b)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-hotel-navy hover:text-white text-gray-700 transition-colors"
                          title="Xem chi tiết đơn"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition-colors"
                            title="Xác nhận duyệt đơn"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'checked_in')}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-600 hover:text-white text-green-600 transition-colors"
                            title="Nhận phòng (Check-in)"
                          >
                            <BedDouble className="w-4 h-4" />
                          </button>
                        )}

                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'completed')}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-800 hover:text-white text-gray-700 transition-colors"
                            title="Hoàn tất trả phòng (Check-out)"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa đơn ${b.bookingCode}?`)) {
                              deleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-500 transition-colors"
                          title="Xóa đơn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-modal-pop">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-hotel-gold bg-hotel-navy px-3 py-1 rounded-full">
                  MÃ ĐƠN: {selectedBooking.bookingCode}
                </span>
                <h3 className="font-serif font-bold text-xl text-hotel-navy mt-2">
                  Chi Tiết Đơn Đặt Phòng
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Guest & Room Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-hotel-sand/40 p-4 rounded-2xl space-y-2">
                  <h4 className="font-bold text-hotel-navy text-sm uppercase tracking-wider">Thông Tin Khách Hàng</h4>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-hotel-goldDark" />
                    <strong>{selectedBooking.guestName}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-hotel-goldDark" />
                    <a href={`tel:${selectedBooking.guestPhone}`} className="text-blue-600 font-bold hover:underline">
                      {selectedBooking.guestPhone}
                    </a>
                  </div>
                  {selectedBooking.guestEmail && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-hotel-goldDark" />
                      <span>{selectedBooking.guestEmail}</span>
                    </div>
                  )}
                </div>

                <div className="bg-hotel-sand/40 p-4 rounded-2xl space-y-2">
                  <h4 className="font-bold text-hotel-navy text-sm uppercase tracking-wider">Thông Tin Lưu Trú</h4>
                  <div className="text-gray-900 font-bold text-sm">{selectedBooking.roomName}</div>
                  <div className="text-gray-600">
                    Hình thức: <strong className="text-hotel-navy">{selectedBooking.bookingType === 'daily' ? `Theo Ngày (${selectedBooking.nightsCount} đêm)` : `Theo Giờ (${selectedBooking.hoursCount} giờ)`}</strong>
                  </div>
                  <div className="text-gray-600">
                    Check-in: <strong>{selectedBooking.checkInDate} ({selectedBooking.checkInTime})</strong>
                  </div>
                  <div className="text-gray-600">
                    Check-out: <strong>{selectedBooking.checkOutDate} ({selectedBooking.checkOutTime})</strong>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block mb-1">Yêu cầu đặc biệt từ khách hàng:</strong>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Change Status Fast Actions */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <strong className="block text-gray-700 mb-2">Đổi Trạng Thái Đơn:</strong>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedBooking.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        selectedBooking.status === st
                          ? 'bg-hotel-navy text-hotel-gold shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {st === 'pending' && 'Chờ duyệt'}
                      {st === 'confirmed' && 'Đã xác nhận'}
                      {st === 'checked_in' && 'Đang ở (Check-in)'}
                      {st === 'completed' && 'Hoàn tất (Check-out)'}
                      {st === 'cancelled' && 'Đã hủy'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi Chú Nội Bộ (Lễ tân/Chủ):</label>
                <textarea
                  rows={2}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Ghi lại thông tin khách cọc tiền, yêu cầu đặc biệt, lưu ý khi nhận phòng..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                />
                <button
                  onClick={handleSaveNotes}
                  className="btn-magnetic mt-2 px-4 py-2 rounded-xl bg-hotel-navy text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Ghi Chú</span>
                </button>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-2xl bg-hotel-navy text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-300">Tổng tiền thanh toán</span>
                  <div className="font-serif font-extrabold text-xl text-hotel-gold">
                    {formatVND(selectedBooking.totalPrice)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    syncBookingToGoogleSheets(selectedBooking);
                    alert('Đã gửi dữ liệu sang Google Sheets!');
                  }}
                  className="btn-magnetic px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Đẩy lại Google Sheets</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal (Tại quầy) */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-modal-pop">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="font-serif font-bold text-xl text-hotel-navy">
                Tạo Đơn Đặt Phòng Tại Quầy / Khách Gọi
              </h3>
              <button
                onClick={() => setIsManualBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-4 text-xs">
              
              {/* Booking Type */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setManualForm({ ...manualForm, bookingType: 'daily' })}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    manualForm.bookingType === 'daily' ? 'bg-hotel-navy text-white shadow' : 'text-gray-600'
                  }`}
                >
                  Theo Ngày (Đêm)
                </button>
                <button
                  type="button"
                  onClick={() => setManualForm({ ...manualForm, bookingType: 'hourly' })}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                    manualForm.bookingType === 'hourly' ? 'bg-hotel-navy text-white shadow' : 'text-gray-600'
                  }`}
                >
                  Theo Giờ (Linh Hoạt)
                </button>
              </div>

              {/* Room Choice */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Chọn Hạng Phòng *</label>
                <select
                  value={manualForm.roomId}
                  onChange={(e) => setManualForm({ ...manualForm, roomId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name.vi} - {formatVND(r.pricePerNight)}/đêm ({formatVND(r.priceHourlyFirst2h)}/2h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tên Khách Hàng *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.guestName}
                    onChange={(e) => setManualForm({ ...manualForm, guestName: e.target.value })}
                    placeholder="VD: Anh Nam"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số Điện Thoại *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.guestPhone}
                    onChange={(e) => setManualForm({ ...manualForm, guestPhone: e.target.value })}
                    placeholder="VD: 0908123456"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Stay Dates / Hours */}
              {manualForm.bookingType === 'daily' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ngày Check-in</label>
                    <input
                      type="date"
                      required
                      value={manualForm.checkInDate}
                      onChange={(e) => setManualForm({ ...manualForm, checkInDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ngày Check-out</label>
                    <input
                      type="date"
                      required
                      value={manualForm.checkOutDate}
                      onChange={(e) => setManualForm({ ...manualForm, checkOutDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ngày Đến</label>
                    <input
                      type="date"
                      required
                      value={manualForm.checkInDate}
                      onChange={(e) => setManualForm({ ...manualForm, checkInDate: e.target.value, checkOutDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Giờ Vào</label>
                    <input
                      type="time"
                      value={manualForm.checkInTime}
                      onChange={(e) => setManualForm({ ...manualForm, checkInTime: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Thời Lượng</label>
                    <select
                      value={manualForm.hoursCount}
                      onChange={(e) => setManualForm({ ...manualForm, hoursCount: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value={2}>2 Giờ</option>
                      <option value={3}>3 Giờ</option>
                      <option value={4}>4 Giờ</option>
                      <option value={6}>6 Giờ</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-magnetic w-full py-3 rounded-xl bg-gradient-to-r from-hotel-gold to-hotel-goldDark text-hotel-navy font-bold text-xs uppercase tracking-wider shadow-lg mt-4"
              >
                Xác Nhận Tạo Đơn Đặt Phòng
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
