import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Check, CheckCircle, Save, Upload, FolderOpen, 
  Image as ImageIcon, Loader2, Sparkles, AlertCircle, RefreshCw, Globe
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ServiceBox } from '../../types';
import { getBilingualText, getBilingualList } from '../../utils/bilingual';

const defaultBoxes: ServiceBox[] = [
  {
    id: 'box-1',
    tag: {
      vi: 'TOUR TRẢI NGHIỆM',
      en: 'LOCAL TOURS'
    },
    title: {
      vi: 'Tour Trải Nghiệm & Khám Phá',
      en: 'Discovery & Sightseeing Tours'
    },
    desc: {
      vi: 'Hỗ trợ đặt tour chất lượng cao khám phá vẻ đẹp Nam Bộ và lịch sử Sài Gòn hào hùng.',
      en: 'High-quality local tour booking assistance exploring Southern Vietnam beauty and historical landmarks.'
    },
    image: '/images/tour-mekong.jpg',
    hours: {
      vi: '24/7 Hỗ trợ',
      en: '24/7 Support'
    },
    items: {
      vi: [
        'Hành Trình Miền Tây (Mekong delta)',
        'Khám phá Địa đạo Củ Chi (Cu Chi Tunnels)',
        'Một vòng Sài Gòn (City Tour)'
      ],
      en: [
        'Mekong Delta Discovery Tour',
        'Cu Chi Tunnels Historical Journey',
        'Ho Chi Minh City Highlights Tour'
      ]
    }
  },
  {
    id: 'box-2',
    tag: {
      vi: 'GIẶT ỦI LẤY NHANH',
      en: 'EXPRESS LAUNDRY'
    },
    title: {
      vi: 'Dịch Vụ Giặt Sấy',
      en: 'Laundry & Dry Cleaning'
    },
    desc: {
      vi: 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, giao nhận tận phòng nhanh chóng và chu đáo.',
      en: 'Same-day fresh and clean laundry service with convenient room pickup and delivery.'
    },
    image: '/images/towels.png',
    hours: {
      vi: 'Lấy trong ngày',
      en: 'Same day return'
    },
    items: {
      vi: [
        'Giặt sấy khô thơm tho lấy ngay trong ngày',
        'Ủi và chăm sóc trang phục theo yêu cầu',
        'Giá cả bình dân, hỗ trợ giao nhận tại phòng'
      ],
      en: [
        'Fresh express wash & dry within the day',
        'Garment steaming & ironing upon request',
        'Affordable rates with room doorstep delivery'
      ]
    }
  },
  {
    id: 'box-3',
    tag: {
      vi: 'TRUNG TÂM QUẬN 1',
      en: 'PRIME DISTRICT 1'
    },
    title: {
      vi: 'Vị Trí Vàng Trung Tâm Sài Gòn',
      en: 'Golden Central Location'
    },
    desc: {
      vi: 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
      en: 'Quiet alley at 269 De Tham, steps away from vibrant Bui Vien Walking Street & Ben Thanh Market.'
    },
    image: '/images/bui-vien-night.jpg',
    hours: {
      vi: 'Vị trí đắc địa',
      en: 'Heart of city'
    },
    items: {
      vi: [
        'Đi bộ 2 phút ra Phố Tây Bùi Viện',
        'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
        'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng'
      ],
      en: [
        '2-minute walk to Bui Vien Walking Street',
        '5-minute walk to Ben Thanh Market & September 23rd Park',
        'Close to Independence Palace, Notre Dame Cathedral & Bach Dang Wharf'
      ]
    }
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

  const [activeBoxLangs, setActiveBoxLangs] = useState<Record<number, 'vi' | 'en'>>({
    0: 'vi',
    1: 'vi',
    2: 'vi'
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

  const handleUpdateBoxImage = (boxIdx: number, imageUrl: string) => {
    const updated = [...boxes];
    updated[boxIdx] = { ...updated[boxIdx], image: imageUrl };
    setBoxes(updated);
  };

  const handleUpdateBoxText = (boxIdx: number, field: 'tag' | 'title' | 'desc' | 'hours', lang: 'vi' | 'en', value: string) => {
    const updated = [...boxes];
    const currentVal = updated[boxIdx][field];
    const existingObj = typeof currentVal === 'object' && currentVal !== null
      ? currentVal
      : { vi: typeof currentVal === 'string' ? currentVal : '', en: typeof currentVal === 'string' ? currentVal : '' };

    updated[boxIdx] = {
      ...updated[boxIdx],
      [field]: {
        ...existingObj,
        [lang]: value
      }
    };
    setBoxes(updated);
  };

  const handleUpdateBoxItem = (boxIdx: number, itemIdx: number, lang: 'vi' | 'en', value: string) => {
    const updated = [...boxes];
    const currentItems = updated[boxIdx].items;
    
    let viItems: string[] = [];
    let enItems: string[] = [];

    if (Array.isArray(currentItems)) {
      viItems = [...currentItems];
      enItems = [...currentItems];
    } else if (typeof currentItems === 'object' && currentItems !== null) {
      viItems = Array.isArray(currentItems.vi) ? [...currentItems.vi] : [];
      enItems = Array.isArray(currentItems.en) ? [...currentItems.en] : [];
    }

    while (viItems.length < 3) viItems.push('');
    while (enItems.length < 3) enItems.push('');

    if (lang === 'vi') {
      viItems[itemIdx] = value;
    } else {
      enItems[itemIdx] = value;
    }

    updated[boxIdx] = {
      ...updated[boxIdx],
      items: {
        vi: viItems,
        en: enItems
      }
    };
    setBoxes(updated);
  };

  const getBoxTextVal = (box: ServiceBox, field: 'tag' | 'title' | 'desc' | 'hours', lang: 'vi' | 'en'): string => {
    const val = box[field];
    if (typeof val === 'object' && val !== null) {
      return (val as any)[lang] || '';
    }
    if (typeof val === 'string') {
      return lang === 'vi' ? val : '';
    }
    return '';
  };

  const getBoxItemsList = (box: ServiceBox, lang: 'vi' | 'en'): string[] => {
    const items = box.items;
    if (typeof items === 'object' && items !== null && !Array.isArray(items)) {
      const list = (items as any)[lang];
      if (Array.isArray(list)) return list;
    }
    if (Array.isArray(items)) {
      return items;
    }
    return ['', '', ''];
  };

  // Upload single image from device with compression
  const handleDeviceUpload = async (boxIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(boxIdx);
    try {
      const compressed = await compressImage(file, 1600, 1600, 0.82);
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
        handleUpdateBoxImage(boxIdx, finalUrl);
      }
    } catch (err) {
      console.warn('Upload API error, fallback to compressed base64', err);
      try {
        const compressed = await compressImage(file, 1600, 1600, 0.82);
        handleUpdateBoxImage(boxIdx, compressed.base64);
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
      handleUpdateBoxImage(activeMediaModalBoxIdx, selectedUrls[0]);
    }
    setActiveMediaModalBoxIdx(null);
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    localStorage.setItem('galaxy_hotel_services_boxes', JSON.stringify(boxes));

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
    alert('Đã lưu nội dung song ngữ & hình ảnh Dịch Vụ & Tour thành công!');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6943] uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Quản Lý Song Ngữ (VIE & EN)</span>
          </div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#8A6943]" />
            <span>Quản Lý Dịch Vụ & Tour Trải Nghiệm</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Thay đổi hình ảnh, thẻ nhãn, tiêu đề và các gạch đầu dòng nổi bật song ngữ (VIE & EN) cho 3 ô dịch vụ.
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
          <span>Đã lưu nội dung song ngữ & ảnh các ô dịch vụ lên máy chủ & website thành công!</span>
        </div>
      )}

      {/* 3 Boxes Editor with Bilingual Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {boxes.map((box, boxIdx) => {
          const currentTab = activeBoxLangs[boxIdx] || 'vi';
          const itemsList = getBoxItemsList(box, currentTab);

          return (
            <div key={box.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Box Header Badge & Tab Switcher */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-extrabold uppercase text-[#8A6943] tracking-wide">
                    Ô {boxIdx + 1}: {getBilingualText(box.tag, 'vi', `Dịch Vụ ${boxIdx + 1}`)}
                  </span>

                  {/* Language Switcher Tabs for this Box */}
                  <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setActiveBoxLangs(prev => ({ ...prev, [boxIdx]: 'vi' }))}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                        currentTab === 'vi'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <span>🇻🇳</span>
                      <span>VIE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBoxLangs(prev => ({ ...prev, [boxIdx]: 'en' }))}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                        currentTab === 'en'
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>EN</span>
                    </button>
                  </div>
                </div>

                {/* IMAGE PREVIEW & CHANGER SECTION (Shared) */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-700">
                    Hình Ảnh Hiển Thị (Banner Ô {boxIdx + 1})
                  </label>
                  
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 group shadow-inner">
                    <img
                      src={box.image || defaultBoxes[boxIdx]?.image}
                      alt={getBilingualText(box.title, 'vi')}
                      onError={(e) => { e.currentTarget.src = defaultBoxes[boxIdx]?.image || '/images/tour-mekong.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Tag Overlay Preview */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] font-bold tracking-wider text-white bg-neutral-950/85 backdrop-blur-md px-2.5 py-0.5 rounded uppercase shadow">
                        {getBilingualText(box.tag, currentTab)}
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
                      onChange={(e) => handleUpdateBoxImage(boxIdx, e.target.value)}
                      placeholder="Đường dẫn ảnh (/images/... hoặc /uploads/...)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-mono text-neutral-600 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* BILINGUAL TAB INPUTS: VI vs EN */}
                <div className={`p-3 rounded-xl border space-y-3 ${currentTab === 'vi' ? 'bg-[#FAF9F5] border-neutral-200' : 'bg-blue-50/30 border-blue-200'}`}>
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-700">
                    <span>{currentTab === 'vi' ? '🇻🇳 Nội Dung Tiếng Việt' : '🇬🇧 English Content'}</span>
                    <span className="text-[10px] font-normal text-neutral-500">
                      {currentTab === 'vi' ? 'Giao diện VI' : 'Giao diện EN'}
                    </span>
                  </div>

                  {/* Tag / Badge */}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">
                      {currentTab === 'vi' ? 'Thẻ Nhãn (Tag VI)' : 'Service Tag (EN)'}
                    </label>
                    <input
                      type="text"
                      value={getBoxTextVal(box, 'tag', currentTab)}
                      onChange={(e) => handleUpdateBoxText(boxIdx, 'tag', currentTab, e.target.value)}
                      placeholder={currentTab === 'vi' ? 'Ví dụ: TOUR TRẢI NGHIỆM' : 'e.g. LOCAL TOURS'}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800 bg-white"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">
                      {currentTab === 'vi' ? 'Tiêu Đề Dịch Vụ (VI)' : 'Service Title (EN)'}
                    </label>
                    <input
                      type="text"
                      value={getBoxTextVal(box, 'title', currentTab)}
                      onChange={(e) => handleUpdateBoxText(boxIdx, 'title', currentTab, e.target.value)}
                      placeholder={currentTab === 'vi' ? 'Ví dụ: Tour Trải Nghiệm & Khám Phá' : 'e.g. Discovery & Sightseeing Tours'}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">
                      {currentTab === 'vi' ? 'Mô Tả Dịch Vụ (VI)' : 'Description (EN)'}
                    </label>
                    <textarea
                      rows={2}
                      value={getBoxTextVal(box, 'desc', currentTab)}
                      onChange={(e) => handleUpdateBoxText(boxIdx, 'desc', currentTab, e.target.value)}
                      placeholder={currentTab === 'vi' ? 'Hỗ trợ đặt tour chất lượng cao...' : 'High quality tour booking assistance...'}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs leading-relaxed text-neutral-700 bg-white resize-none"
                    />
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 pt-1 border-t border-neutral-200/60">
                    <label className="block text-[10px] font-bold text-neutral-600 mb-1">
                      {currentTab === 'vi' ? '3 Điểm Nổi Bật (Bullets VI):' : '3 Highlight Points (Bullets EN):'}
                    </label>
                    {[0, 1, 2].map((itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">#{itemIdx + 1}</span>
                        <input
                          type="text"
                          value={itemsList[itemIdx] || ''}
                          onChange={(e) => handleUpdateBoxItem(boxIdx, itemIdx, currentTab, e.target.value)}
                          placeholder={currentTab === 'vi' ? `Gạch đầu dòng ${itemIdx + 1}...` : `Bullet point ${itemIdx + 1}...`}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="w-full mt-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-[#E8DCB9]" />
                <span>Lưu Song Ngữ Ô Này</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Media Library Modal for picking uploaded image */}
      <MediaLibraryModal
        isOpen={activeMediaModalBoxIdx !== null}
        onClose={() => setActiveMediaModalBoxIdx(null)}
        onSelect={handleSelectFromLibrary}
        mode="single"
        title={activeMediaModalBoxIdx !== null ? `Chọn Ảnh Cho Ô ${activeMediaModalBoxIdx + 1}: ${getBilingualText(boxes[activeMediaModalBoxIdx]?.tag, 'vi', '')}` : 'Chọn Ảnh Từ Kho Uploads'}
      />

    </div>
  );
};
