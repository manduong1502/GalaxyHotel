import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Save, CheckCircle, Upload, FolderOpen, 
  Image as ImageIcon, Loader2, RefreshCw, Eye, Layers, Plus, Trash2 
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface HeroSlideData {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
}

export interface WelcomeImagesData {
  mainImage: string;
  secondaryImage: string;
}

export interface BannersConfig {
  heroSlides: HeroSlideData[];
  welcomeImages: WelcomeImagesData;
}

const defaultBannersConfig: BannersConfig = {
  heroSlides: [
    {
      id: 'hero-1',
      image: '/images/hero-1.jpg',
      title: 'Không Gian Ấm Cúng, Tiện Nghi & Riêng Tư',
      subtitle: 'Khách sạn boutique chuẩn mực tại trung tâm Quận 1 Sài Gòn, chỉ cách Phố đi bộ Bùi Viện vài bước chân.',
      highlight: 'SẠCH SẼ & ẤM CÚNG'
    },
    {
      id: 'hero-2',
      image: '/images/hero-2.jpg',
      title: 'Phòng Nghỉ Tiêu Chuẩn & Phòng Gia Đình Rộng Rãi',
      subtitle: 'Trang bị đầy đủ Smart TV, máy lạnh êm ái, wifi tốc độ cao và phòng tắm riêng hiện đại.',
      highlight: 'TIỆN NGHI HOÀN HẢO'
    },
    {
      id: 'hero-3',
      image: '/images/facility-1.jpg',
      title: 'Trải Nghiệm Du Lịch & Ẩm Thực Sài Gòn',
      subtitle: 'Hỗ trợ đặt tour miền Tây, Củ Chi, đặt vé máy bay và xe đưa đón sân bay 24/7.',
      highlight: 'TÂM ĐIỂM QUẬN 1'
    }
  ],
  welcomeImages: {
    mainImage: '/images/welcome-1.jpg',
    secondaryImage: '/images/welcome-2.jpg'
  }
};

export const BannersManager: React.FC = () => {
  const [config, setConfig] = useState<BannersConfig>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.heroSlides)) {
          return {
            heroSlides: parsed.heroSlides.length > 0 ? parsed.heroSlides : defaultBannersConfig.heroSlides,
            welcomeImages: parsed.welcomeImages || defaultBannersConfig.welcomeImages
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultBannersConfig;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Media Library Modal states
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState<string | null>(null);

  const heroFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const welcomeMainFileRef = useRef<HTMLInputElement | null>(null);
  const welcomeSecondaryFileRef = useRef<HTMLInputElement | null>(null);

  const fetchBannersFromServer = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/banners.php');
      const data = await res.json();
      if (data && data.success && data.data && Array.isArray(data.data.heroSlides)) {
        setConfig(data.data);
        localStorage.setItem('galaxy_hotel_banners', JSON.stringify(data.data));
      }
    } catch (err) {
      console.warn('Could not fetch banners from API', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBannersFromServer();
  }, []);

  const handleUpdateSlide = (slideIdx: number, field: keyof HeroSlideData, value: string) => {
    setConfig(prev => {
      const newSlides = [...prev.heroSlides];
      newSlides[slideIdx] = { ...newSlides[slideIdx], [field]: value };
      return { ...prev, heroSlides: newSlides };
    });
  };

  const handleUpdateWelcomeImage = (field: keyof WelcomeImagesData, value: string) => {
    setConfig(prev => ({
      ...prev,
      welcomeImages: {
        ...prev.welcomeImages,
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (target: string, file: File) => {
    setUploadingTarget(target);
    try {
      const compressed = await compressImage(file, 1920, 1920, 0.85);
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
        applyImageToTarget(target, finalUrl);
      }
    } catch (err) {
      console.warn('Upload error, fallback to base64', err);
      try {
        const compressed = await compressImage(file, 1920, 1920, 0.85);
        applyImageToTarget(target, compressed.base64);
      } catch (e) {
        console.error(e);
        alert('Không thể tải ảnh lên. Vui lòng thử lại.');
      }
    } finally {
      setUploadingTarget(null);
    }
  };

  const applyImageToTarget = (target: string, url: string) => {
    if (target.startsWith('hero-')) {
      const idx = parseInt(target.replace('hero-', ''), 10);
      if (!isNaN(idx)) {
        handleUpdateSlide(idx, 'image', url);
      }
    } else if (target === 'welcome-main') {
      handleUpdateWelcomeImage('mainImage', url);
    } else if (target === 'welcome-secondary') {
      handleUpdateWelcomeImage('secondaryImage', url);
    }
  };

  const handleSelectFromLibrary = (selectedUrls: string[]) => {
    if (mediaModalTarget && selectedUrls.length > 0) {
      applyImageToTarget(mediaModalTarget, selectedUrls[0]);
    }
    setMediaModalOpen(false);
    setMediaModalTarget(null);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    localStorage.setItem('galaxy_hotel_banners', JSON.stringify(config));

    try {
      await fetch('/api/banners.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (err) {
      console.warn('Failed to sync banners with server', err);
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
    alert('Đã lưu cấu hình Banner & Ảnh Trang Chủ thành công!');
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#8A6943]" />
            <span>Quản Lý Banner & Hình Ảnh Trang Chủ</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tùy chỉnh 3 slide banner lớn đầu trang chủ và 2 ảnh nổi bật của khối Giới Thiệu Khách Sạn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBannersFromServer}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold transition-all"
            title="Làm mới từ máy chủ"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#E8DCB9]" /> : <Save className="w-4 h-4 text-[#E8DCB9]" />}
            <span>{isSaving ? 'Đang Lưu...' : 'Lưu Toàn Bộ Banner'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Đã lưu banner & hình ảnh trang chủ lên máy chủ thành công!</span>
        </div>
      )}

      {/* SECTION 1: 3 HERO SLIDES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8A6943]" />
            <span>1. Khối Banner Trượt Đầu Trang Chủ (3 Slide)</span>
          </h3>
          <span className="text-xs text-neutral-500">Kích thước chuẩn: 1920x1080 (HD / 16:9)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {config.heroSlides.map((slide, slideIdx) => (
            <div key={slide.id || slideIdx} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-xs font-extrabold uppercase text-[#8A6943]">
                    Slide #{slideIdx + 1}
                  </span>
                  <span className="text-[10px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded">
                    {slide.highlight || 'BANNER'}
                  </span>
                </div>

                {/* Image Preview */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-950 group shadow-inner">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    onError={(e) => { e.currentTarget.src = defaultBannersConfig.heroSlides[slideIdx]?.image || '/images/hero-1.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                  />
                  
                  {/* Overlay Mock */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-end text-white bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <span className="text-[9px] font-bold text-[#E8DCB9] tracking-wider uppercase truncate">{slide.highlight}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{slide.title}</h4>
                  </div>

                  {uploadingTarget === `hero-${slideIdx}` && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#E8DCB9]" />
                      <span>Đang nén & tải ảnh...</span>
                    </div>
                  )}
                </div>

                {/* Upload Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => { heroFileRefs.current[slideIdx] = el; }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(`hero-${slideIdx}`, e.target.files[0]);
                      if (e.target) e.target.value = '';
                    }}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => heroFileRefs.current[slideIdx]?.click()}
                    disabled={uploadingTarget === `hero-${slideIdx}`}
                    className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#8A6943]" />
                    <span>Tải Từ Máy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalTarget(`hero-${slideIdx}`);
                      setMediaModalOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#8A6943] border border-[#E5D7BF] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Kho Uploads</span>
                  </button>
                </div>

                {/* Image URL */}
                <div>
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => handleUpdateSlide(slideIdx, 'image', e.target.value)}
                    placeholder="URL ảnh (/images/hero-1.jpg hoặc /uploads/...)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-mono text-neutral-600 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                {/* Highlight Tag */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Thẻ Điểm Nhấn (Highlight)</label>
                  <input
                    type="text"
                    value={slide.highlight}
                    onChange={(e) => handleUpdateSlide(slideIdx, 'highlight', e.target.value)}
                    placeholder="Ví dụ: SẠCH SẼ & ẤM CÚNG"
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800"
                  />
                </div>

                {/* Slide Title */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Tiêu Đề Slide Lớn</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleUpdateSlide(slideIdx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
                  />
                </div>

                {/* Slide Subtitle */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Đoạn Mô Tả Ngắn</label>
                  <textarea
                    rows={2}
                    value={slide.subtitle}
                    onChange={(e) => handleUpdateSlide(slideIdx, 'subtitle', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs leading-relaxed text-neutral-700 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: WELCOME SECTION IMAGES */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#8A6943]" />
            <span>2. Hình Ảnh Khối "Giới Thiệu Về Galaxy Hotel" (Welcome Section)</span>
          </h3>
          <span className="text-xs text-neutral-500">2 khung ảnh xếp chồng đẹp mắt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Welcome Image */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-extrabold uppercase text-[#8A6943]">
                Ảnh Chính (Khung Lớn Có Badge Đánh Giá 4.7★)
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 group shadow-inner">
              <img
                src={config.welcomeImages.mainImage}
                alt="Welcome Main"
                onError={(e) => { e.currentTarget.src = '/images/welcome-1.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {uploadingTarget === 'welcome-main' && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E8DCB9]" />
                  <span>Đang nén & tải ảnh...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                accept="image/*"
                ref={welcomeMainFileRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload('welcome-main', e.target.files[0]);
                  if (e.target) e.target.value = '';
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => welcomeMainFileRef.current?.click()}
                disabled={uploadingTarget === 'welcome-main'}
                className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#8A6943]" />
                <span>Tải Từ Máy</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaModalTarget('welcome-main');
                  setMediaModalOpen(true);
                }}
                className="py-2 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#8A6943] border border-[#E5D7BF] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Kho Uploads</span>
              </button>
            </div>

            <input
              type="text"
              value={config.welcomeImages.mainImage}
              onChange={(e) => handleUpdateWelcomeImage('mainImage', e.target.value)}
              placeholder="Đường dẫn ảnh (/images/welcome-1.jpg hoặc /uploads/...)"
              className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-mono text-neutral-600 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          {/* Secondary Welcome Image */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-extrabold uppercase text-[#8A6943]">
                Ảnh Phụ (Góc Nhỏ Chồng Lên Góc Phải Dưới)
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 group shadow-inner">
              <img
                src={config.welcomeImages.secondaryImage}
                alt="Welcome Secondary"
                onError={(e) => { e.currentTarget.src = '/images/welcome-2.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {uploadingTarget === 'welcome-secondary' && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E8DCB9]" />
                  <span>Đang nén & tải ảnh...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                accept="image/*"
                ref={welcomeSecondaryFileRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload('welcome-secondary', e.target.files[0]);
                  if (e.target) e.target.value = '';
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => welcomeSecondaryFileRef.current?.click()}
                disabled={uploadingTarget === 'welcome-secondary'}
                className="py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#8A6943]" />
                <span>Tải Từ Máy</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaModalTarget('welcome-secondary');
                  setMediaModalOpen(true);
                }}
                className="py-2 px-3 rounded-xl bg-[#FAF6EE] hover:bg-[#F3ECE0] text-[#8A6943] border border-[#E5D7BF] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Kho Uploads</span>
              </button>
            </div>

            <input
              type="text"
              value={config.welcomeImages.secondaryImage}
              onChange={(e) => handleUpdateWelcomeImage('secondaryImage', e.target.value)}
              placeholder="Đường dẫn ảnh (/images/welcome-2.jpg hoặc /uploads/...)"
              className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-[10px] font-mono text-neutral-600 focus:border-neutral-900 focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaModalTarget(null);
        }}
        onSelect={handleSelectFromLibrary}
        mode="single"
        title="Chọn Ảnh Cho Banner / Khối Giới Thiệu Từ Kho Uploads"
      />

    </div>
  );
};
