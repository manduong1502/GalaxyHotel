import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { Room, RoomStatus } from '../../types';
import { 
  BedDouble, DollarSign, Clock, Users, Maximize2, 
  Edit, Check, X, AlertCircle, Plus, Trash2, Upload, Image as ImageIcon, Sparkles,
  Star, ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, ArrowRight, FolderOpen,
  Languages, Globe
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { MediaLibraryModal } from './MediaLibraryModal';
import { getBilingualText, getBilingualList } from '../../utils/bilingual';

export const RoomsManager: React.FC = () => {
  const { rooms, updateRoom, addNewRoom, deleteRoom } = useBookings();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  // Edit form state - Shared fields
  const [editPriceNight, setEditPriceNight] = useState<number>(650000);
  const [editPriceFirst2h, setEditPriceFirst2h] = useState<number>(150000);
  const [editPriceExtra, setEditPriceExtra] = useState<number>(50000);
  const [editStatus, setEditStatus] = useState<RoomStatus>('available');
  const [editAreaSqm, setEditAreaSqm] = useState(18);
  const [editMaxAdults, setEditMaxAdults] = useState(2);
  const [editMaxChildren, setEditMaxChildren] = useState(1);
  const [editTotalInventory, setEditTotalInventory] = useState<number>(4);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editIsPopular, setEditIsPopular] = useState(false);

  // Edit form state - Vietnamese (VI)
  const [editNameVi, setEditNameVi] = useState('');
  const [editSubtitleVi, setEditSubtitleVi] = useState('');
  const [editDescVi, setEditDescVi] = useState('');
  const [editBedVi, setEditBedVi] = useState('1 Giường Đôi King');
  const [editViewVi, setEditViewVi] = useState('Cửa sổ đón gió tự nhiên');
  const [editAmenitiesVi, setEditAmenitiesVi] = useState('Smart TV 50 inch 4K, 2 Giường đôi nệm êm ái, Wifi cáp quang băng thông rộng, Máy lạnh Inverter siêu êm, Phòng tắm nóng lạnh 24/7, Bàn làm việc & Minibar');

  // Edit form state - English (EN)
  const [editNameEn, setEditNameEn] = useState('');
  const [editSubtitleEn, setEditSubtitleEn] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editBedEn, setEditBedEn] = useState('1 King Double Bed');
  const [editViewEn, setEditViewEn] = useState('Natural Breeze & Light Window');
  const [editAmenitiesEn, setEditAmenitiesEn] = useState('Smart TV 50 inch 4K, High-speed Wi-Fi, Inverter AC, 24/7 Hot Water Shower, Work Desk & Minibar');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setIsAddingRoom(false);
    setActiveLangTab('vi');

    // Shared
    setEditPriceNight(room.pricePerNight);
    setEditPriceFirst2h(room.priceHourlyFirst2h);
    setEditPriceExtra(room.priceHourlyExtra);
    setEditStatus(room.status || 'available');
    setEditAreaSqm(room.areaSqm);
    setEditMaxAdults(room.maxAdults);
    setEditMaxChildren(room.maxChildren);
    setEditTotalInventory(room.totalInventory ?? 4);
    setEditImages([...room.images]);
    setEditIsPopular(!!room.isPopular);

    // Vietnamese
    setEditNameVi(room.name?.vi || (typeof room.name === 'string' ? room.name : ''));
    setEditSubtitleVi(room.subtitle?.vi || (typeof room.subtitle === 'string' ? room.subtitle : ''));
    setEditDescVi(room.description?.vi || (typeof room.description === 'string' ? room.description : ''));
    setEditBedVi(room.bedType?.vi || (typeof room.bedType === 'string' ? room.bedType : '1 Giường Đôi King'));
    setEditViewVi(room.view?.vi || (typeof room.view === 'string' ? room.view : 'Cửa sổ đón gió tự nhiên'));
    setEditAmenitiesVi(room.amenities?.vi ? room.amenities.vi.join(', ') : 'Máy lạnh Inverter, Smart TV, Wifi riêng, Minibar, Nước nóng 24/7');

    // English
    setEditNameEn(room.name?.en || '');
    setEditSubtitleEn(room.subtitle?.en || '');
    setEditDescEn(room.description?.en || '');
    setEditBedEn(room.bedType?.en || '1 King Double Bed');
    setEditViewEn(room.view?.en || 'Natural Breeze & Light Window');
    setEditAmenitiesEn(room.amenities?.en ? room.amenities.en.join(', ') : 'Smart TV 50 inch 4K, High-speed Wi-Fi, Inverter AC, 24/7 Hot Water Shower, Minibar');
  };

  const handleOpenAdd = () => {
    setIsAddingRoom(true);
    setEditingRoom(null);
    setActiveLangTab('vi');

    // Shared
    setEditPriceNight(750000);
    setEditPriceFirst2h(180000);
    setEditPriceExtra(60000);
    setEditAreaSqm(20);
    setEditMaxAdults(2);
    setEditMaxChildren(1);
    setEditTotalInventory(4);
    setEditStatus('available');
    setEditImages(['/images/rooms/phong-may-chieu.jpg']);
    setEditIsPopular(false);

    // Vietnamese
    setEditNameVi('Phòng Mới (VIP Projector)');
    setEditSubtitleVi('Không gian hiện đại, trang bị máy chiếu xem phim cao cấp');
    setEditDescVi('Phòng nghỉ sang trọng đầy đủ tiện nghi ngay trung tâm Quận 1.');
    setEditBedVi('1 Giường Đôi King Size (1.8m x 2.0m)');
    setEditViewVi('Cửa sổ đón ánh sáng & gió tự nhiên');
    setEditAmenitiesVi('Smart TV 50 inch 4K, 2 Giường đôi nệm êm ái, Wifi cáp quang băng thông rộng, Máy lạnh Inverter siêu êm, Phòng tắm nóng lạnh 24/7, Bàn làm việc & Minibar');

    // English
    setEditNameEn('New VIP Room (Projector Cinema)');
    setEditSubtitleEn('Modern private suite equipped with premium cinema projector');
    setEditDescEn('Luxury room with full modern amenities in District 1 center.');
    setEditBedEn('1 King Size Bed (1.8m x 2.0m)');
    setEditViewEn('Natural daylight and breeze window');
    setEditAmenitiesEn('Smart TV 50 inch 4K, High-speed Wi-Fi, Inverter AC, 24/7 Hot Water Shower, Work Desk & Minibar');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploadingImage(true);
    const newUploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const compressed = await compressImage(file, 1600, 1600, 0.82);
        const formData = new FormData();
        formData.append('image', compressed.compressedFile);
        const res = await fetch('/api/upload_image.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data && data.success && data.url) {
          newUploadedUrls.push(data.url);
        } else if (compressed.base64) {
          newUploadedUrls.push(compressed.base64);
        }
      } catch (err) {
        console.warn('Upload API error, using safe compressed base64 fallback', err);
        try {
          const compressed = await compressImage(file, 1600, 1600, 0.82);
          newUploadedUrls.push(compressed.base64);
        } catch (e) {
          console.error('Failed to compress file', e);
        }
      }
    }

    if (newUploadedUrls.length > 0) {
      setEditImages(prev => [...prev, ...newUploadedUrls]);
    }
    setIsUploadingImage(false);
    if (e.target) e.target.value = '';
  };

  const handleSetAsMain = (index: number) => {
    if (index === 0) return;
    setEditImages(prev => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setEditImages(prev => {
      const newImages = [...prev];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      return newImages;
    });
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
      alert('Vui lòng nhập tên phòng (Tiếng Việt)');
      return;
    }

    const parsedAmenitiesVi = editAmenitiesVi
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const finalAmenitiesVi = parsedAmenitiesVi.length > 0 
      ? parsedAmenitiesVi 
      : ['Máy lạnh Inverter', 'Smart TV', 'Wifi tốc độ cao', 'Phòng tắm nước nóng 24/7', 'Tủ lạnh minibar'];

    const parsedAmenitiesEn = editAmenitiesEn
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const finalAmenitiesEn = parsedAmenitiesEn.length > 0
      ? parsedAmenitiesEn
      : finalAmenitiesVi;

    const finalNameEn = editNameEn.trim() || editNameVi.trim();
    const finalSubtitleEn = editSubtitleEn.trim() || editSubtitleVi.trim();
    const finalDescEn = editDescEn.trim() || editDescVi.trim();
    const finalBedEn = editBedEn.trim() || editBedVi.trim();
    const finalViewEn = editViewEn.trim() || editViewVi.trim();

    if (isAddingRoom) {
      const newId = 'phong-' + Date.now();
      const newRoom: Room = {
        id: newId,
        slug: newId,
        name: { vi: editNameVi.trim(), en: finalNameEn },
        subtitle: { vi: editSubtitleVi.trim(), en: finalSubtitleEn },
        description: { vi: editDescVi.trim(), en: finalDescEn },
        pricePerNight: Number(editPriceNight),
        priceHourlyFirst2h: Number(editPriceFirst2h),
        priceHourlyExtra: Number(editPriceExtra),
        status: editStatus,
        areaSqm: Number(editAreaSqm),
        bedType: { vi: editBedVi.trim(), en: finalBedEn },
        view: { vi: editViewVi.trim(), en: finalViewEn },
        maxAdults: Number(editMaxAdults),
        maxChildren: Number(editMaxChildren),
        totalInventory: Number(editTotalInventory) || 4,
        amenities: {
          vi: finalAmenitiesVi,
          en: finalAmenitiesEn
        },
        features: {
          vi: ['Miễn phí nước suối hàng ngày', 'Lễ tân phục vụ 24/7', 'Dọn phòng hàng ngày'],
          en: ['Complimentary bottled water daily', '24/7 Front desk support', 'Daily housekeeping']
        },
        images: editImages.length > 0 ? editImages : ['/images/rooms/phong-a.jpg'],
        isPopular: editIsPopular
      };

      addNewRoom(newRoom);
      setIsAddingRoom(false);
      alert('Đã thêm phòng mới song ngữ (VIE & EN) thành công!');
    } else if (editingRoom) {
      const updated: Room = {
        ...editingRoom,
        name: { vi: editNameVi.trim(), en: finalNameEn },
        subtitle: { vi: editSubtitleVi.trim(), en: finalSubtitleEn },
        description: { vi: editDescVi.trim(), en: finalDescEn },
        pricePerNight: Number(editPriceNight),
        priceHourlyFirst2h: Number(editPriceFirst2h),
        priceHourlyExtra: Number(editPriceExtra),
        status: editStatus,
        areaSqm: Number(editAreaSqm),
        bedType: { vi: editBedVi.trim(), en: finalBedEn },
        view: { vi: editViewVi.trim(), en: finalViewEn },
        totalInventory: Number(editTotalInventory) || 4,
        amenities: {
          vi: finalAmenitiesVi,
          en: finalAmenitiesEn
        },
        maxAdults: Number(editMaxAdults),
        maxChildren: Number(editMaxChildren),
        images: editImages,
        isPopular: editIsPopular
      };

      updateRoom(updated);
      setEditingRoom(null);
      alert(`Đã cập nhật thông tin song ngữ cho ${updated.name.vi}!`);
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

  const currentAmenitiesPreview = activeLangTab === 'vi'
    ? editAmenitiesVi.split(',').map(s => s.trim()).filter(Boolean)
    : editAmenitiesEn.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header with Add Room CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6943] uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Hỗ Trợ Quản Lý Song Ngữ (VIE & EN)</span>
          </div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">
            Quản Lý Hạng Phòng, Bảng Giá & Hình Ảnh
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tùy chỉnh thông tin Tiếng Việt & Tiếng Anh, tải ảnh thực tế, cài đặt giá theo đêm/giờ và trạng thái phòng tức thì
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
                  alt={room.name?.vi || 'Room photo'}
                  onError={(e) => { e.currentTarget.src = '/images/rooms/phong-a.jpg'; }}
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
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-bold text-lg text-neutral-900 tracking-tight">
                    {getBilingualText(room.name, 'vi')}
                  </h3>
                  {getBilingualText(room.name, 'en') && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                      EN: {getBilingualText(room.name, 'en')}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs line-clamp-1 mb-3">
                  {getBilingualText(room.subtitle, 'vi') || getBilingualText(room.subtitle, 'en')}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-4 gap-1.5 py-2 border-y border-gray-100 text-[11px] text-gray-600 mb-3 text-center">
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
                    <strong className="line-clamp-1 text-[10px]">{getBilingualText(room.bedType, 'vi')}</strong>
                  </div>
                  <div>
                    <span className="text-amber-700 block text-[10px] font-bold">Số Lượng</span>
                    <strong className="text-amber-900">{room.totalInventory ?? 4} phòng</strong>
                  </div>
                </div>

                {/* Amenities pills summary */}
                {(() => {
                  const ams = getBilingualList(room.amenities, 'vi');
                  if (ams.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ams.slice(0, 4).map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium">
                          ✓ {item}
                        </span>
                      ))}
                      {ams.length > 4 && (
                        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md font-medium">
                          +{ams.length - 4}
                        </span>
                      )}
                    </div>
                  );
                })()}

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
                <span>Sửa Song Ngữ, Giá & Ảnh</span>
              </button>

              <button
                onClick={() => handleDeleteRoom(room.id, room.name?.vi || 'Room')}
                className="p-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-colors border border-red-200"
                title="Xóa phòng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Room Modal with Bilingual Tab Switcher */}
      {(editingRoom || isAddingRoom) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-neutral-200 my-4 sm:my-8 animate-modal-pop max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-neutral-100 bg-white flex-shrink-0">
              <div>
                <h3 className="font-sans font-bold text-xl text-neutral-900">
                  {isAddingRoom ? 'Thêm Hạng Phòng Mới' : `Chỉnh Sửa: ${editingRoom?.name?.vi || 'Phòng'}`}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Cập nhật song ngữ Tiếng Việt & Tiếng Anh, tiện nghi và bảng giá linh hoạt
                </p>
              </div>

              {/* Language Switcher Tabs in Modal Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('vi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeLangTab === 'vi'
                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>🇻🇳</span>
                    <span>VIE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeLangTab === 'en'
                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>EN</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsAddingRoom(false);
                  }}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              
              {/* Photo Upload Section (Shared for both languages) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3.5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8A6943]" />
                      <span>Hình Ảnh Thực Tế Của Phòng ({editImages.length})</span>
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Ảnh ở vị trí đầu tiên (⭐ Ảnh chính) sẽ là ảnh bìa đại diện trên trang chủ và danh sách phòng.
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>Chọn Từ Kho Uploads</span>
                    </button>

                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95">
                      <Upload className="w-3.5 h-3.5 text-[#E8DCB9]" />
                      <span>{isUploadingImage ? 'Đang tải lên...' : 'Tải Thêm Ảnh Từ Máy'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Thumbnails list with Cover Photo Selection and Reordering */}
                <div className="flex items-center gap-3.5 overflow-x-auto py-2.5 px-1">
                  {editImages.map((imgUrl, i) => {
                    const isMain = i === 0;
                    return (
                      <div
                        key={i}
                        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 flex-shrink-0 flex flex-col justify-between transition-all group ${
                          isMain 
                            ? 'border-amber-500 ring-4 ring-amber-400/20 shadow-md scale-100' 
                            : 'border-neutral-200 hover:border-neutral-400 bg-neutral-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Room Photo ${i + 1}`} 
                          onError={(e) => { e.currentTarget.src = '/images/rooms/phong-a.jpg'; }}
                          className="absolute inset-0 w-full h-full object-cover" 
                        />

                        {/* Top Overlay Badge / Actions */}
                        <div className="relative z-10 p-1.5 flex justify-between items-start">
                          {isMain ? (
                            <span className="bg-amber-500 text-neutral-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Ảnh chính</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetAsMain(i)}
                              className="bg-neutral-900/90 hover:bg-amber-500 text-white hover:text-neutral-950 text-[9px] font-bold px-2 py-0.5 rounded-md shadow backdrop-blur-sm transition-all flex items-center gap-1"
                              title="Đặt ảnh này làm ảnh bìa đại diện"
                            >
                              <Star className="w-2.5 h-2.5" />
                              <span>Làm ảnh chính</span>
                            </button>
                          )}

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="w-6 h-6 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-sm transition-opacity"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bottom Reorder Controls */}
                        <div className="relative z-10 p-1.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex justify-between items-center text-white">
                          <span className="text-[10px] font-bold">#{i + 1}</span>
                          <div className="flex items-center gap-1">
                            {i > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(i, 'left')}
                                className="w-5 h-5 rounded bg-white/30 hover:bg-white text-neutral-900 flex items-center justify-center transition-colors"
                                title="Di chuyển sang trái"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            {i < editImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(i, 'right')}
                                className="w-5 h-5 rounded bg-white/30 hover:bg-white text-neutral-900 flex items-center justify-center transition-colors"
                                title="Di chuyển sang phải"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BILINGUAL LANGUAGE CONTENT AREA */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-neutral-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{activeLangTab === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                      {activeLangTab === 'vi' ? 'Nội Dung Tiếng Việt (VIE)' : 'English Content (EN)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {activeLangTab === 'vi' ? 'Hiển thị khi khách chọn Tiếng Việt' : 'Displayed when guest selects English'}
                  </span>
                </div>

                {activeLangTab === 'vi' ? (
                  /* --- VIETNAMESE FIELDS --- */
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Tên Hạng Phòng (Tiếng Việt) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editNameVi}
                        onChange={(e) => setEditNameVi(e.target.value)}
                        placeholder="VD: PHÒNG HẠNG SANG CÓ MÁY CHIẾU"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Mô tả ngắn gọn (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={editSubtitleVi}
                        onChange={(e) => setEditSubtitleVi(e.target.value)}
                        placeholder="VD: Không gian ấm cúng, thiết kế hiện đại và tiện nghi hoàn hảo cho 2 người lớn"
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Loại Giường (Tiếng Việt) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editBedVi}
                          onChange={(e) => setEditBedVi(e.target.value)}
                          placeholder="VD: 1 Giường Đôi Queen (1.4m x 2.0m)"
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Cửa Sổ / Hướng Nhìn (Tiếng Việt)
                        </label>
                        <input
                          type="text"
                          value={editViewVi}
                          onChange={(e) => setEditViewVi(e.target.value)}
                          placeholder="VD: Cửa sổ đón gió tự nhiên"
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Tiện Nghi Nổi Bật (Tiếng Việt, cách nhau bởi dấu phẩy)
                      </label>
                      <textarea
                        rows={2}
                        value={editAmenitiesVi}
                        onChange={(e) => setEditAmenitiesVi(e.target.value)}
                        placeholder="Smart TV 50 inch 4K, Máy chiếu phim, Wifi riêng, Máy lạnh Inverter, Nước nóng 24/7, Minibar"
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Mô tả chi tiết phòng (Tiếng Việt)
                      </label>
                      <textarea
                        rows={3}
                        value={editDescVi}
                        onChange={(e) => setEditDescVi(e.target.value)}
                        placeholder="Mô tả không gian, nội thất, ánh sáng và trải nghiệm nghỉ dưỡng..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                ) : (
                  /* --- ENGLISH FIELDS --- */
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center justify-between">
                        <span>Room Type Name (English) *</span>
                        <span className="text-[10px] font-normal text-neutral-500">Auto fallback to VIE if blank</span>
                      </label>
                      <input
                        type="text"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        placeholder="e.g. Superior Double Room with Projector"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/30 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">
                        Short Subtitle / Tagline (English)
                      </label>
                      <input
                        type="text"
                        value={editSubtitleEn}
                        onChange={(e) => setEditSubtitleEn(e.target.value)}
                        placeholder="e.g. Cozy space with modern private cinema projector for 2 adults"
                        className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/30 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-blue-900 mb-1">
                          Bed Type (English)
                        </label>
                        <input
                          type="text"
                          value={editBedEn}
                          onChange={(e) => setEditBedEn(e.target.value)}
                          placeholder="e.g. 1 Queen Double Bed (1.6m x 2.0m)"
                          className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/30 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-blue-900 mb-1">
                          Window / View (English)
                        </label>
                        <input
                          type="text"
                          value={editViewEn}
                          onChange={(e) => setEditViewEn(e.target.value)}
                          placeholder="e.g. Natural Daylight & Breeze Window"
                          className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/30 text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">
                        Key Amenities (English, comma separated)
                      </label>
                      <textarea
                        rows={2}
                        value={editAmenitiesEn}
                        onChange={(e) => setEditAmenitiesEn(e.target.value)}
                        placeholder="Smart TV 50 inch 4K, Home Projector, High-Speed Wi-Fi, Inverter AC, 24/7 Hot Water, Minibar"
                        className="w-full px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/30 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">
                        Detailed Description (English)
                      </label>
                      <textarea
                        rows={3}
                        value={editDescEn}
                        onChange={(e) => setEditDescEn(e.target.value)}
                        placeholder="Detailed room ambiance, comfort features, interior lighting and hospitality perks..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/30 text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Live Pill Preview for Active Language */}
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                    Xem trước thẻ tiện ích ({activeLangTab.toUpperCase()}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAmenitiesPreview.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                      >
                        <Check className="w-3 h-3 text-[#8A6943]" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SHARED FIELDS SECTION: Pricing, Specs, Inventory & Status */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70">
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                    ⚙️ Thông Số Chung & Bảng Giá (Dùng Chung Cho Cả 2 Ngôn Ngữ)
                  </span>
                  <div className="w-48">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as RoomStatus)}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="available">● Sẵn sàng (Trống)</option>
                      <option value="occupied">● Đang có khách</option>
                      <option value="cleaning">● Đang dọn phòng</option>
                      <option value="maintenance">● Bảo trì / Khóa</option>
                    </select>
                  </div>
                </div>

                {/* Pricing section */}
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

                {/* Specs: Area, Bed, Guests, Total Inventory */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1.5 truncate">
                      Diện Tích (m²)
                    </label>
                    <input
                      type="number"
                      value={editAreaSqm}
                      onChange={(e) => setEditAreaSqm(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1.5 truncate">
                      Người Lớn (Tối đa)
                    </label>
                    <input
                      type="number"
                      value={editMaxAdults}
                      onChange={(e) => setEditMaxAdults(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1.5 truncate">
                      Trẻ Em (Tối đa)
                    </label>
                    <input
                      type="number"
                      value={editMaxChildren}
                      onChange={(e) => setEditMaxChildren(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-800 mb-1.5 truncate">
                      Số Phòng Mặc Định *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={editTotalInventory}
                      onChange={(e) => setEditTotalInventory(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
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
                  <span>{isAddingRoom ? 'Lưu & Thêm Phòng Mới' : 'Lưu Thay Đổi Song Ngữ'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal for Rooms */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mode="multiple"
        title="Chọn Ảnh Phòng Từ Kho Thư Viện Uploads"
        onSelect={(urls) => {
          if (urls.length > 0) {
            setEditImages(prev => [...prev, ...urls]);
          }
        }}
      />

    </div>
  );
};
