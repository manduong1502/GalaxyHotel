import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Eye, X, Camera, Heart } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'checkin' | 'facilities';
}

const initialGallery: GalleryItem[] = [
  { id: '1', url: '/images/checkin-1.jpg', title: 'Check-in nụ cười du khách tại sảnh', category: 'checkin' },
  { id: '2', url: '/images/welcome-1.jpg', title: 'Phòng Hạng Sang Máy Chiếu ấm cúng', category: 'checkin' },
  { id: '3', url: '/images/hero-1.jpg', title: 'Sảnh đón tiếp & Quầy thông tin Tour', category: 'facilities' },
  { id: '4', url: '/images/facility-1.jpg', title: 'Khu vực tiếp khách & thư giãn', category: 'facilities' },
  { id: '5', url: '/images/welcome-2.jpg', title: 'Góc phòng xinh xắn đón nắng sáng', category: 'checkin' },
  { id: '6', url: '/images/hero-2.jpg', title: 'Không gian ấm cúng Galaxy Boutique', category: 'facilities' },
];

export const GallerySection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const [activeTab, setActiveTab] = useState<'all' | 'checkin' | 'facilities'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [photos, setPhotos] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_gallery_photos');
      if (saved) {
        return JSON.parse(saved) as GalleryItem[];
      }
    } catch (e) {
      console.error(e);
    }
    return initialGallery;
  });

  // Fetch live photos from server
  React.useEffect(() => {
    fetch('/api/gallery.php')
      .then(res => res.json())
      .then(res => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPhotos(res.data);
          localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const filteredImages = photos.filter((img) => {
    if (activeTab === 'all') return true;
    return img.category === activeTab;
  });

  return (
    <section 
      id="gallery" 
      ref={sectionRef} 
      className={`py-24 bg-white relative reveal-fade-up ${isVisible ? 'is-revealed' : ''} font-sans`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#8A6943] text-[11px] font-bold tracking-widest uppercase mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#8A6943]" />
            <span>{t('gallery.eyebrow')}</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
            {t('gallery.title')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            {lang === 'vi' 
              ? 'Lưu giữ những khoảnh khắc đáng nhớ và nụ cười rạng rỡ của du khách khắp mọi nơi khi dừng chân tại Galaxy Boutique Hotel.'
              : 'Cherishing memorable moments and cheerful smiles of our beloved travelers at Galaxy Boutique Hotel.'}
          </p>

          {/* Category Tabs: All, Check-in photos, Common spaces (Removed Room & Service tabs) */}
          <div className="inline-flex p-1 bg-[#F4F1EA] rounded-xl border border-neutral-200/70 mt-6 gap-1">
            {[
              { key: 'all', label: t('gallery.tab_all') },
              { key: 'checkin', label: t('gallery.tab_checkin') },
              { key: 'facilities', label: t('gallery.tab_facilities') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item.url)}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-neutral-200/80 bg-neutral-100"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                <Camera className="w-6 h-6 text-[#E8DCB9] mb-2 transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="font-bold text-sm leading-snug">
                  {item.title}
                </span>
                <span className="text-[10px] uppercase font-semibold text-neutral-300 mt-1.5 px-2.5 py-0.5 rounded-full bg-white/20">
                  Phóng to ảnh
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-backdrop">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20 animate-modal-pop">
            <img
              src={lightboxImage}
              alt="Full Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
