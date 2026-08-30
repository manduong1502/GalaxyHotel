import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { Room, RoomStatus } from '../../types';
import { 
  BedDouble, DollarSign, Clock, Users, Maximize2, 
  Edit, Check, X, AlertCircle, Plus, Trash2, Upload, Image as ImageIcon, Sparkles
} from 'lucide-react';

export const RoomsManager: React.FC = () => {
  const { rooms, updateRoom, addNewRoom, deleteRoom } = useBookings();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Edit form state
  const [editPriceNight, setEditPriceNight] = useState<number>(650000);
  const [editPriceFirst2h, setEditPriceFirst2h] = useState<number>(150000);
  const [editPriceExtra, setEditPriceExtra] = useState<number>(50000);
  const [editStatus, setEditStatus] = useState<RoomStatus>('available');
  const [editNameVi, setEditNameVi] = useState('');
  const [editSubtitleVi, setEditSubtitleVi] = useState('');
  const [editDescVi, setEditDescVi] = useState('');
  const [editAreaSqm, setEditAreaSqm] = useState(18);
  const [editBedVi, setEditBedVi] = useState('1 Giường Đôi King');
  const [editMaxAdults, setEditMaxAdults] = useState(2);
  const [editMaxChildren, setEditMaxChildren] = useState(1);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editIsPopular, setEditIsPopular] = useState(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setIsAddingRoom(false);
    setEditPriceNight(room.pricePerNight);
    setEditPriceFirst2h(room.priceHourlyFirst2h);
    setEditPriceExtra(room.priceHourlyExtra);
    setEditStatus(room.status || 'available');
    setEditNameVi(room.name.vi);
    setEditSubtitleVi(room.subtitle.vi);
    setEditDescVi(room.description.vi);
    setEditAreaSqm(room.areaSqm);
    setEditBedVi(room.bedType.vi);
    setEditMaxAdults(room.maxAdults);
    setEditMaxChildren(room.maxChildren);
    setEditImages([...room.images]);
    setEditIsPopular(!!room.isPopular);
  };

  const handleOpenAdd = () => {
    setIsAddingRoom(true);
    setEditingRoom(null);
    setEditNameVi('Phòng Mới (VIP Projector)');
    setEditSubtitleVi('Không gian hiện đại, trang bị máy chiếu xem phim cao cấp');
    setEditDescVi('Phòng nghỉ sang trọng đầy đủ tiện nghi ngay trung tâm Quận 1.');
    setEditPriceNight(750000);
    setEditPriceFirst2h(180000);
    setEditPriceExtra(60000);
    setEditAreaSqm(20);
    setEditBedVi('1 Giường Đôi King Size (1.8m x 2.0m)');
    setEditMaxAdults(2);
    setEditMaxChildren(1);
    setEditStatus('available');
    setEditImages(['/images/rooms/phong-may-chieu.jpg']);
    setEditIsPopular(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload_image.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditImages(prev => [data.url, ...prev]);
        alert('Tải ảnh phòng lên thành công!');
      } else {
        // Fallback preview
        const localUrl = URL.createObjectURL(file);
        setEditImages(prev => [localUrl, ...prev]);
      }
    } catch (err) {
      console.warn('Upload API error, using local url preview', err);
      const localUrl = URL.createObjectURL(file);
      setEditImages(prev => [localUrl, ...prev]);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (editImages.length <= 1) {
      alert('Mỗi phòng cần có ít nhất 1 hình ảnh');
      return;
    }
    setEditImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameVi.trim()) {
      alert('Vui lòng nhập tên phòng');
      return;
    }

    if (isAddingRoom) {
      const newId = 'phong-' + Date.now();
      const newRoom: Room = {
        id: newId,
        slug: newId,
        name: { vi: editNameVi, en: editNameVi },
        subtitle: { vi: editSubtitleVi, en: editSubtitleVi },
        description: { vi: editDescVi, en: editDescVi },
        pricePerNight: Number(editPriceNight),
        priceHourlyFirst2h: Number(editPriceFirst2h),
        priceHourlyExtra: Number(editPriceExtra),
        status: editStatus,
        areaSqm: Number(editAreaSqm),
        bedType: { vi: editBedVi, en: editBedVi },
        view: { vi: 'Cửa sổ đón gió tự nhiên', en: 'City View' },
        maxAdults: Number(editMaxAdults),
        maxChildren: Number(editMaxChildren),
        amenities: {
          vi: ['Máy chiếu phim HD', 'Máy lạnh Inverter', 'Wifi riêng', 'Tủ lạnh minibar', 'Nước nóng 24/7', 'Khăn tắm cao cấp'],
          en: ['HD Projector', 'Inverter AC', 'Private Wi-Fi', 'Minibar', '24/7 Hot water', 'Premium towels']
        },
        features: {
          vi: ['Miễn phí nước suối hàng ngày', 'Lễ tân 24/7'],
          en: ['Free water bottles', '24/7 Reception']
        },
        images: editImages.length > 0 ? editImages : ['/images/rooms/phong-a.jpg'],
        isPopular: editIsPopular
      };

      addNewRoom(newRoom);
      setIsAddingRoom(false);
      alert('Đã thêm phòng mới thành công!');
    } else if (editingRoom) {
      const updated: Room = {
        ...editingRoom,
        name: { ...editingRoom.name, vi: editNameVi },
        subtitle: { ...editingRoom.subtitle, vi: editSubtitleVi },
        description: { ...editingRoom.description, vi: editDescVi },
        pricePerNight: Number(editPriceNight),
        priceHourlyFirst2h: Number(editPriceFirst2h),
        priceHourlyExtra: Number(editPriceExtra),
        status: editStatus,
        areaSqm: Number(editAreaSqm),
        bedType: { ...editingRoom.bedType, vi: editBedVi },
        maxAdults: Number(editMaxAdults),
        maxChildren: Number(editMaxChildren),
        images: editImages,
        isPopular: editIsPopular
      };

      updateRoom(updated);
      setEditingRoom(null);
      alert(`Đã cập nhật thông tin và hình ảnh cho ${updated.name.vi}!`);
    }
  };

  const handleDeleteRoom = (roomId: string, roomName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hạng phòng "${roomName}"?`)) {
      deleteRoom(roomId);
      alert('Đã xóa phòng thành công!');
    }
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
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header with Add Room CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">
            Quản Lý Hạng Phòng, Bảng Giá & Hình Ảnh
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tải ảnh thực tế từ máy tính, điều chỉnh giá theo đêm/theo giờ và trạng thái phòng tức thì trên website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold font-sans">
            Tổng {rooms.length} Hạng Phòng
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#E8DCB9]" />
            <span>Thêm Hạng Phòng Mới</span>
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Room Image */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                <img
                  src={room.images[0]}
                  alt={room.name.vi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(room.status)}
                </div>
                {room.isPopular && (
                  <div className="absolute top-3 left-3 bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                    Phổ Biến Nhất
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{room.images.length} ảnh</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-sans font-bold text-lg text-neutral-900 mb-1 tracking-tight">
                  {room.name.vi}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-1 mb-3">
                  {room.subtitle.vi}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-[11px] text-gray-600 mb-3 text-center">
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
                    <strong className="line-clamp-1 text-[10px]">{room.bedType.vi}</strong>
                  </div>
                </div>

                {/* Pricing Badges */}
                <div className="space-y-1.5 bg-[#FAF9F5] p-3 rounded-xl border border-neutral-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[11px]">Giá Theo Đêm:</span>
                    <span className="font-extrabold text-neutral-900 text-sm">
                      {formatVND(room.pricePerNight)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500">Giá Theo Giờ:</span>
                    <span className="font-bold text-[#8A6943]">
                      {formatVND(room.priceHourlyFirst2h)} / 2h (+{formatVND(room.priceHourlyExtra)}/h)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-5 pt-0 flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(room)}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Edit className="w-3.5 h-3.5 text-[#E8DCB9]" />
                <span>Sửa Giá, Ảnh & Chi Tiết</span>
              </button>

              <button
                onClick={() => handleDeleteRoom(room.id, room.name.vi)}
                className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-colors border border-red-200"
                title="Xóa phòng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Room Modal with Direct Photo Upload */}
      {(editingRoom || isAddingRoom) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-backdrop">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-modal-pop">
            
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-6">
              <h3 className="font-sans font-bold text-xl text-neutral-900">
                {isAddingRoom ? 'Thêm Hạng Phòng Mới' : `Chỉnh Sửa: ${editingRoom?.name.vi}`}
              </h3>
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setIsAddingRoom(false);
                }}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#8A6943]" />
                    <span>Hình Ảnh Thực Tế Của Phòng ({editImages.length})</span>
                  </label>
                  
                  {/* File Upload Button */}
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#E8DCB9]" />
                    <span>{isUploadingImage ? 'Đang tải...' : 'Tải Ảnh Từ Máy'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Thumbnails list */}
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                  {editImages.map((imgUrl, i) => (
                    <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border-2 border-neutral-300 flex-shrink-0 group">
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-neutral-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          Ảnh chính
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tên Hạng Phòng *</label>
                  <input
                    type="text"
                    required
                    value={editNameVi}
                    onChange={(e) => setEditNameVi(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Trạng Thái Phòng</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RoomStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="available">● Sẵn sàng (Trống)</option>
                    <option value="occupied">● Đang có khách</option>
                    <option value="cleaning">● Đang dọn phòng</option>
                    <option value="maintenance">● Bảo trì / Khóa</option>
                  </select>
                </div>
              </div>

              {/* Subtitle & Desc */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mô tả ngắn gọn</label>
                <input
                  type="text"
                  value={editSubtitleVi}
                  onChange={(e) => setEditSubtitleVi(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Pricing section */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Cấu Hình Bảng Giá (VNĐ)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Giá Theo Đêm</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10000}
                      value={editPriceNight}
                      onChange={(e) => setEditPriceNight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Giá 2 Giờ Đầu</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10000}
                      value={editPriceFirst2h}
                      onChange={(e) => setEditPriceFirst2h(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-[#8A6943]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Thêm Mỗi Giờ</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10000}
                      value={editPriceExtra}
                      onChange={(e) => setEditPriceExtra(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-[#8A6943]"
                    />
                  </div>
                </div>
              </div>

              {/* Specs: Area, Bed, Guests */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Diện Tích (m²)</label>
                  <input
                    type="number"
                    value={editAreaSqm}
                    onChange={(e) => setEditAreaSqm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Người Lớn</label>
                  <input
                    type="number"
                    value={editMaxAdults}
                    onChange={(e) => setEditMaxAdults(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Trẻ Em</label>
                  <input
                    type="number"
                    value={editMaxChildren}
                    onChange={(e) => setEditMaxChildren(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={editIsPopular}
                  onChange={(e) => setEditIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-900"
                />
                <label htmlFor="popularCheck" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Đánh dấu là "Hạng Phòng Phổ Biến Nhất"
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsAddingRoom(false);
                  }}
                  className="flex-1 py-3 border border-neutral-300 rounded-xl text-neutral-700 font-bold text-xs hover:bg-neutral-50"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                >
                  <Check className="w-4 h-4 text-[#E8DCB9]" />
                  <span>{isAddingRoom ? 'Lưu & Thêm Phòng Mới' : 'Lưu Thay Đổi Ngay'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
