import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { Room, RoomStatus } from '../../types';
import { 
  BedDouble, DollarSign, Clock, Users, Maximize2, 
  Edit, Check, X, AlertCircle, Sparkles, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export const RoomsManager: React.FC = () => {
  const { rooms, updateRoomPrice, updateRoomStatus, updateRoom } = useBookings();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Edit form state
  const [editPriceNight, setEditPriceNight] = useState<number>(0);
  const [editPriceFirst2h, setEditPriceFirst2h] = useState<number>(0);
  const [editPriceExtra, setEditPriceExtra] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<RoomStatus>('available');
  const [editNameVi, setEditNameVi] = useState('');
  const [editMaxAdults, setEditMaxAdults] = useState(2);
  const [editMaxChildren, setEditMaxChildren] = useState(1);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setEditPriceNight(room.pricePerNight);
    setEditPriceFirst2h(room.priceHourlyFirst2h);
    setEditPriceExtra(room.priceHourlyExtra);
    setEditStatus(room.status || 'available');
    setEditNameVi(room.name.vi);
    setEditMaxAdults(room.maxAdults);
    setEditMaxChildren(room.maxChildren);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const updated: Room = {
      ...editingRoom,
      name: {
        ...editingRoom.name,
        vi: editNameVi
      },
      pricePerNight: Number(editPriceNight),
      priceHourlyFirst2h: Number(editPriceFirst2h),
      priceHourlyExtra: Number(editPriceExtra),
      status: editStatus,
      maxAdults: Number(editMaxAdults),
      maxChildren: Number(editMaxChildren),
    };

    updateRoom(updated);
    setEditingRoom(null);
    alert(`Đã cập nhật bảng giá và trạng thái cho ${updated.name.vi}!`);
  };

  const getStatusBadge = (status?: RoomStatus) => {
    switch (status) {
      case 'available':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">● Sẵn sàng (Trống)</span>;
      case 'occupied':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">● Đang có khách</span>;
      case 'cleaning':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">● Đang dọn phòng</span>;
      case 'maintenance':
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">● Bảo trì / Khóa</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">● Sẵn sàng</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-2xl text-hotel-navy">
            Quản Lý Hạng Phòng & Bảng Giá
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cập nhật giá theo đêm, giá theo giờ và trạng thái phòng tức thì trên website
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-hotel-sand/60 text-hotel-navy text-xs font-bold">
            Tổng {rooms.length} Hạng Phòng Thực Tế
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Room Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={room.images[0]}
                  alt={room.name.vi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(room.status)}
                </div>
                {room.isPopular && (
                  <div className="absolute top-3 left-3 bg-hotel-gold text-hotel-navy font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                    Phổ Biến Nhất
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif font-bold text-lg text-hotel-navy mb-1">
                  {room.name.vi}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-1 mb-4">
                  {room.subtitle.vi}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 text-[11px] text-gray-600 mb-4 text-center">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Diện Tích</span>
                    <strong>{room.areaSqm} m²</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Số Khách</span>
                    <strong>{room.maxAdults}L {room.maxChildren > 0 ? `+${room.maxChildren}T` : ''}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Giường</span>
                    <strong className="truncate block" title={room.bedType.vi}>{room.bedType.vi.split('(')[0]}</strong>
                  </div>
                </div>

                {/* Price Display Boxes */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="text-[10px] text-blue-700 block font-semibold">Theo Đêm</span>
                    <span className="font-bold text-hotel-navy text-sm">{formatVND(room.pricePerNight)}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                    <span className="text-[10px] text-purple-700 block font-semibold">Theo Giờ</span>
                    <span className="font-bold text-purple-900 text-sm">{formatVND(room.priceHourlyFirst2h)}<span className="text-[10px] font-normal text-gray-500">/2h</span></span>
                    <div className="text-[10px] text-purple-600">+{formatVND(room.priceHourlyExtra)}/h</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(room)}
                className="btn-magnetic w-full py-2 rounded-xl bg-hotel-navy hover:bg-hotel-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-hotel-gold" />
                <span>Chỉnh Sửa Giá & Trạng Thái</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-modal-pop">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-hotel-gold bg-hotel-navy px-3 py-1 rounded-full">
                  MÃ PHÒNG: {editingRoom.id}
                </span>
                <h3 className="font-serif font-bold text-xl text-hotel-navy mt-1.5">
                  Cập Nhật Phòng & Giá
                </h3>
              </div>
              <button
                onClick={() => setEditingRoom(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              {/* Tên phòng */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên Hạng Phòng</label>
                <input
                  type="text"
                  required
                  value={editNameVi}
                  onChange={(e) => setEditNameVi(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-semibold"
                />
              </div>

              {/* Trạng thái phòng */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Trạng Thái Thực Tế</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'available', label: 'Sẵn Sàng (Trống)' },
                    { id: 'occupied', label: 'Đang Có Khách' },
                    { id: 'cleaning', label: 'Đang Dọn Phòng' },
                    { id: 'maintenance', label: 'Bảo Trì / Khóa' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setEditStatus(st.id as RoomStatus)}
                      className={`py-2 px-3 rounded-xl font-bold transition-all text-[11px] ${
                        editStatus === st.id
                          ? 'bg-hotel-navy text-hotel-gold shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Form */}
              <div className="p-4 rounded-2xl bg-hotel-sand/50 border border-hotel-gold/30 space-y-3">
                <h4 className="font-bold text-hotel-navy uppercase tracking-wider text-[11px]">
                  Cài Đặt Bảng Giá (VNĐ)
                </h4>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Giá Theo Đêm (Qua Đêm)</label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={editPriceNight}
                    onChange={(e) => setEditPriceNight(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-hotel-navy"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">{formatVND(editPriceNight)} / đêm</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Giá 2 Giờ Đầu</label>
                    <input
                      type="number"
                      step="10000"
                      required
                      value={editPriceFirst2h}
                      onChange={(e) => setEditPriceFirst2h(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-900"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">{formatVND(editPriceFirst2h)}</span>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Mỗi Giờ Thêm</label>
                    <input
                      type="number"
                      step="10000"
                      required
                      value={editPriceExtra}
                      onChange={(e) => setEditPriceExtra(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-900"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">+{formatVND(editPriceExtra)}/h</span>
                  </div>
                </div>
              </div>

              {/* Sức chứa */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Người Lớn Tối Đa</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editMaxAdults}
                    onChange={(e) => setEditMaxAdults(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Trẻ Em Tối Đa</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={editMaxChildren}
                    onChange={(e) => setEditMaxChildren(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="btn-magnetic flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="btn-magnetic flex-1 py-2.5 rounded-xl bg-hotel-gold hover:bg-hotel-goldDark text-hotel-navy font-bold text-xs uppercase tracking-wider shadow"
                >
                  Lưu Cập Nhật
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
