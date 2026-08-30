import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Home, ChevronRight, Maximize2, X, ChevronLeft, ChevronRight as RightIcon } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const { lang } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems = [
    { id: 1, category: 'rooms', title: 'Phòng VIP King Bed Ban Công', src: '/images/rooms/phong-vip.jpg' },
    { id: 2, category: 'rooms', title: 'Phòng A (Standard Deluxe)', src: '/images/rooms/phong-a.jpg' },
    { id: 3, category: 'rooms', title: 'Phòng C (Family Suite 5 Khách)', src: '/images/rooms/phong-c.jpg' },
    { id: 4, category: 'rooms', title: 'Phòng AD (Deluxe Triple 3 Khách)', src: '/images/rooms/phong-ad.jpg' },
    { id: 5, category: 'rooms', title: 'Phòng E (Balcony View)', src: '/images/rooms/phong-e.jpg' },
    { id: 6, category: 'rooms', title: 'Phòng G (Standard Double)', src: '/images/rooms/phong-g.jpg' },
    { id: 7, category: 'spaces', title: 'Sảnh Đón Tiếp & Quầy Lễ Tân 24/7', src: '/images/welcome-1.jpg' },
    { id: 8, category: 'spaces', title: 'Không Gian Phòng Nghỉ Ấm Cúng', src: '/images/welcome-2.jpg' },
    { id: 9, category: 'facilities', title: 'Khu Vực Sky Lounge Tầng Thượng', src: '/images/facility-1.jpg' },
    { id: 10, category: 'spaces', title: 'Mặt Tiền Galaxy Boutique Hotel', src: '/images/hero-1.jpg' },
    { id: 11, category: 'spaces', title: 'Không Gian Khách Sạn Về Đêm', src: '/images/hero-2.jpg' },
    { id: 12, category: 'facilities', title: 'Tiện Nghi Khăn Tắm & Vệ Sinh Khử Khuẩn', src: '/images/towels.png' },
  ];

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
              {lang === 'vi' ? 'Thư viện hình ảnh' : 'Photo Gallery'}
            </span>
          </nav>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8DCB9] block mb-2">
            GALAXY BOUTIQUE HOTEL SAIGON
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {lang === 'vi' ? 'Thư Viện Hình Ảnh Thực Tế' : 'Real Photo Showcase'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            {lang === 'vi'
              ? 'Toàn bộ hình ảnh phòng ốc, sảnh tiếp đón và không gian tại Galaxy Boutique Hotel đều là ảnh chụp thực tế 100% để quý khách hoàn toàn an tâm khi đặt phòng.'
              : 'Explore genuine 100% unedited photographs of our rooms, reception, and amenities at Galaxy Boutique Hotel Saigon.'}
          </p>

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-neutral-200 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-[#FAF9F5] text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {lang === 'vi' ? 'Tất Cả Hình Ảnh (12)' : 'All Photos (12)'}
          </button>
          <button
            onClick={() => setSelectedFilter('rooms')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'rooms'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-[#FAF9F5] text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {lang === 'vi' ? 'Phòng Nghỉ Thực Tế' : 'Guest Rooms'}
          </button>
          <button
            onClick={() => setSelectedFilter('spaces')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'spaces'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-[#FAF9F5] text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {lang === 'vi' ? 'Sảnh & Không Gian' : 'Lobby & Spaces'}
          </button>
          <button
            onClick={() => setSelectedFilter('facilities')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'facilities'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-[#FAF9F5] text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {lang === 'vi' ? 'Tiện Ích & Sky Lounge' : 'Amenities & Lounge'}
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-200 shadow-sm cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#E8DCB9] font-bold block">
                    {item.category === 'rooms' ? 'Hạng phòng' : 'Không gian'}
                  </span>
                  <h4 className="text-xs font-bold truncate">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <RightIcon className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredItems[lightboxIndex]?.src}
              alt={filteredItems[lightboxIndex]?.title}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-sm sm:text-base font-bold">
                {filteredItems[lightboxIndex]?.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
