import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Check, CheckCircle, Save, Upload, FolderOpen, 
  Image as ImageIcon, Loader2, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface ServiceBox {
  id: string;
  tag: string;
  title: string;
  desc: string;
  items: string[];
  image: string;
  hours?: string;
}

const defaultBoxes: ServiceBox[] = [
  {
    id: 'box-1',
    tag: 'TOUR TRẢI NGHIỆM',
    title: 'Tour Trải Nghiệm & Khám Phá',
    desc: 'Hỗ trợ đặt tour chất lượng cao khám phá vẻ đẹp Nam Bộ và lịch sử Sài Gòn hào hùng.',
    image: '/images/tour-mekong.jpg',
    hours: '24/7 Hỗ trợ',
    items: [
      'Hành Trình Miền Tây (Mekong delta)',
      'Khám phá Địa đạo Củ Chi (Cu Chi Tunnels)',
      'Một vòng Sài Gòn (City Tour)'
    ]
  },
  {
    id: 'box-2',
    tag: 'GIẶT ỦI LẤY NHANH',
    title: 'Dịch Vụ Giặt Sấy',
    desc: 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, giao nhận tận phòng nhanh chóng và chu đáo.',
    image: '/images/towels.png',
    hours: 'Lấy trong ngày',
    items: [
      'Giặt sấy khô thơm tho lấy ngay trong ngày',
      'Ủi và chăm sóc trang phục theo yêu cầu',
      'Giá cả bình dân, hỗ trợ giao nhận tại phòng'
    ]
  },
  {
    id: 'box-3',
    tag: 'TRUNG TÂM QUẬN 1',
    title: 'Vị Trí Vàng Trung Tâm Sài Gòn',
    desc: 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
    image: '/images/bui-vien-night.jpg',
    hours: 'Vị trí đắc địa',
    items: [
      'Đi bộ 2 phút ra Phố Tây Bùi Viện',
      'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
      'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng'
    ]
  }
];

export const ServicesManager: React.FC = () => {
  const [boxes, setBoxes] = useState<ServiceBox[]>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_services_boxes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.map((item: any, idx: number) => ({
            ...defaultBoxes[idx],
            ...item,
            image: item.image || defaultBoxes[idx].image
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultBoxes;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeMediaModalBoxIdx, setActiveMediaModalBoxIdx] = useState<number | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch from server on mount
  const fetchServicesFromServer = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/services.php');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length >= 3) {
        const merged = data.data.map((item: any, idx: number) => ({
          ...defaultBoxes[idx],
          ...item,
          image: item.image || defaultBoxes[idx].image
        }));
        setBoxes(merged);
        localStorage.setItem('galaxy_hotel_services_boxes', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Could not fetch services from API, using cached data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesFromServer();
  }, []);

  const handleUpdateBox = (index: number, field: keyof ServiceBox, value: any) => {
    const updated = [...boxes];
    updated[index] = { ...updated[index], [field]: value };
    setBoxes(updated);
  };

  const handleUpdateItem = (boxIndex: number, itemIndex: number, value: string) => {
    const updated = [...boxes];
    const newItems = [...updated[boxIndex].items];
    newItems[itemIndex] = value;
    updated[boxIndex] = { ...updated[boxIndex], items: newItems };
    setBoxes(updated);
  };

  // Upload single image from device with compression
  const handleDeviceUpload = async (boxIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(boxIdx);
    try {
      // 1. Compress image client-side to ~250KB
      const compressed = await compressImage(file, 1600, 1600, 0.82);

      // 2. Upload to /api/upload_image.php
      const formData = new FormData();
      formData.append('image', compressed.compressedFile);

      const res = await fetch('/api/upload_image.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      let finalUrl = '';
      if (data && data.success && data.url) {
        finalUrl = data.url;
      } else if (compressed.base64) {
        finalUrl = compressed.base64;
      }

      if (finalUrl) {
        handleUpdateBox(boxIdx, 'image', finalUrl);
      }
    } catch (err) {
      console.warn('Upload API error, fallback to compressed base64', err);
      try {
        const compressed = await compressImage(file, 1600, 1600, 0.82);
        handleUpdateBox(boxIdx, 'image', compressed.base64);
      } catch (e) {
        console.error(e);
        alert('Không thể xử lý ảnh tải lên. Vui lòng thử lại.');
      }
    } finally {
      setUploadingIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  // Select image from Media Library modal
  const handleSelectFromLibrary = (selectedUrls: string[]) => {
    if (activeMediaModalBoxIdx !== null && selectedUrls.length > 0) {
      handleUpdateBox(activeMediaModalBoxIdx, 'image', selectedUrls[0]);
    }
    setActiveMediaModalBoxIdx(null);
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    // 1. LocalStorage
    localStorage.setItem('galaxy_hotel_services_boxes', JSON.stringify(boxes));

    // 2. Server API sync
    try {
      await fetch('/api/services.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boxes)
      });
    } catch (err) {
      console.warn('API sync failed, saved locally', err);
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
    alert('Đã lưu nội dung & hình ảnh Dịch Vụ & Tour thành công!');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#8A6943]" />
            <span>Quản Lý Dịch Vụ & Tour Trải Nghiệm</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Thay đổi hình ảnh, thẻ nhãn, tiêu đề và các gạch đầu dòng nổi bật cho 3 ô dịch vụ trên trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServicesFromServer}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold transition-all"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#E8DCB9]" /> : <Save className="w-4 h-4 text-[#E8DCB9]" />}
            <span>{isSaving ? 'Đang Lưu...' : 'Lưu Toàn Bộ Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Đã lưu nội dung & ảnh các ô dịch vụ lên máy chủ & website thành công!</span>
        </div>
      )}

      {/* 3 Boxes Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {boxes.map((box, boxIdx) => (
          <div key={box.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Box Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-extrabold uppercase text-[#8A6943] tracking-wide">
                  Ô {boxIdx + 1}: {box.tag || `Dịch Vụ ${boxIdx + 1}`}
                </span>
              </div>

              {/* IMAGE PREVIEW & CHANGER SECTION */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-neutral-700">
                  Hình Ảnh Hiển Thị (Banner Ô {boxIdx + 1})
                </label>
                
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 group shadow-inner">
                  <img
                    src={box.image || defaultBoxes[boxIdx]?.image}
                    alt={box.title}
                    onError={(e) => { e.currentTarget.src = defaultBoxes[boxIdx]?.image || '/images/tour-mekong.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Tag Overlay Preview */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] font-bold tracking-wider text-white bg-neutral-950/85 backdrop-blur-md px-2.5 py-0.5 rounded uppercase shadow">
                      {box.tag}
                    </span>
                  </div>

                  {uploadingIdx === boxIdx && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E8DCB9]" />
                      <span>Đang nén & tải ảnh...</span>
                    </div>
                  )}
                </div>

                {/* Upload Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Device File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => { fileInputRefs.current[boxIdx] = el; }}
                    onChange={(e) => handleDeviceUpload(boxIdx, e)}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[boxIdx]?.click()}
                    disabled={uploadingIdx === boxIdx}
                    className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#8A6943]" />
                    <span>Tải Từ Máy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMediaModalBoxIdx(boxIdx)}
                    className="py-2 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#8A6943] border border-[#E5D7BF] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Kho Uploads</span>
                  </button>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <input
                    type="text"
                    value={box.image}
                    onChange={(e) => handleUpdateBox(boxIdx, 'image', e.target.value)}
                    placeholder="Đường dẫn ảnh (/images/... hoặc /uploads/...)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-mono text-neutral-600 focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tag / Badge */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Thẻ Nhãn (Tag)</label>
                <input
                  type="text"
                  value={box.tag}
                  onChange={(e) => handleUpdateBox(boxIdx, 'tag', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Tiêu Đề Dịch Vụ</label>
                <input
                  type="text"
                  value={box.title}
                  onChange={(e) => handleUpdateBox(boxIdx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Mô Tả</label>
                <textarea
                  rows={2}
                  value={box.desc}
                  onChange={(e) => handleUpdateBox(boxIdx, 'desc', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs leading-relaxed text-neutral-700 focus:border-neutral-900 focus:outline-none resize-none"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  3 Điểm Nổi Bật (Bullets):
                </label>
                {box.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400">#{itemIdx + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateItem(boxIdx, itemIdx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="w-full mt-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cập Nhật Ô Này</span>
            </button>
          </div>
        ))}
      </div>

      {/* Media Library Modal for picking uploaded image */}
      <MediaLibraryModal
        isOpen={activeMediaModalBoxIdx !== null}
        onClose={() => setActiveMediaModalBoxIdx(null)}
        onSelect={handleSelectFromLibrary}
        mode="single"
        title={activeMediaModalBoxIdx !== null ? `Chọn Ảnh Cho Ô ${activeMediaModalBoxIdx + 1}: ${boxes[activeMediaModalBoxIdx]?.tag}` : 'Chọn Ảnh Từ Kho Uploads'}
      />

    </div>
  );
};
