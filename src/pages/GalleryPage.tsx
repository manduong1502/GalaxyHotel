import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Home, ChevronRight, Maximize2, X, ChevronLeft, ChevronRight as RightIcon, Heart, Camera } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const { lang } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const initialItems = [
    { id: 1, category: 'checkin', title: 'Check-in nụ cười du khách tại sảnh lễ tân', src: '/images/checkin-1.jpg' },
    { id: 2, category: 'checkin', title: 'Phòng Hạng Sang Máy Chiếu ấm cúng', src: '/images/welcome-1.jpg' },
    { id: 3, category: 'spaces', title: 'Sảnh Đón Tiếp & Quầy Thông Tin Tour', src: '/images/hero-1.jpg' },
    { id: 4, category: 'spaces', title: 'Khu Vực Tiếp Khách & Thư Giãn', src: '/images/facility-1.jpg' },
    { id: 5, category: 'checkin', title: 'Góc phòng xinh xắn đón nắng sớm', src: '/images/welcome-2.jpg' },
    { id: 6, category: 'spaces', title: 'Không gian khách sạn ấm cúng về đêm', src: '/images/hero-2.jpg' },
    { id: 7, category: 'spaces', title: 'Mặt tiền Galaxy Boutique Hotel hẻm 269 Đề Thám', src: '/images/hero-1.jpg' },
    { id: 8, category: 'checkin', title: 'Khăn tắm & Tiện nghi thơm tho', src: '/images/towels.png' },
  ];

  const galleryItems = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_gallery_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, i) => ({
            id: p.id || i + 1,
            category: p.category || 'checkin',
            title: p.title || 'Khoảnh khắc check-in',
            src: p.url || p.src || '/images/checkin-1.jpg'
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return initialItems;
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F5] min-h-screen animate-fade-in font-sans">
      
      {/* Page Hero & Breadcrumb */}
      <div className="bg-neutral-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E8DCB9_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-4 font-sans">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#E8DCB9] font-medium">
              {lang === 'vi' ? 'Góc nhỏ yêu thương' : 'Love & Memories Corner'}
            </span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8DCB9] text-[11px] font-bold tracking-widest uppercase mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#E8DCB9]" />
            <span>GALAXY BOUTIQUE HOTEL SAIGON</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Góc Nhỏ Yêu Thương • Khoảnh Khắc Check-in' : 'Love & Memories Corner • Guest Check-in Moments'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Nơi lưu giữ từng nụ cười rạng rỡ, kỷ niệm đẹp và những khoảnh khắc check-in đáng nhớ của quý du khách khi dừng chân tại Galaxy Boutique Hotel.'
              : 'Cherishing cheerful smiles, pleasant memories, and authentic guest moments at Galaxy Boutique Hotel.'}
          </p>

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-neutral-200 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {lang === 'vi' ? 'Tất cả ảnh' : 'All Photos'}
          </button>
          
          <button
            onClick={() => setSelectedFilter('checkin')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'checkin'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {lang === 'vi' ? 'Ảnh khách check-in' : 'Guest Check-in'}
          </button>

          <button
            onClick={() => setSelectedFilter('spaces')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'spaces'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {lang === 'vi' ? 'Không gian chung' : 'Common Spaces'}
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl border border-neutral-200 transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8DCB9] block mb-1">
                      {item.category === 'checkin' ? 'KHOẢNH KHẮC CHECK-IN' : 'KHÔNG GIAN KHÁCH SẠN'}
                    </span>
                    <h3 className="font-bold text-sm leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <RightIcon className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <img
              src={filteredItems[lightboxIndex]?.src}
              alt={filteredItems[lightboxIndex]?.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <p className="text-white text-sm font-semibold mt-4 text-center">
              {filteredItems[lightboxIndex]?.title}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
