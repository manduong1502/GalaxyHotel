import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { galleryImages } from '../data/mockData';
import { Eye, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const [activeTab, setActiveTab] = useState<'all' | 'rooms' | 'dining' | 'facilities'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages = galleryImages.filter((img) => {
    if (activeTab === 'all') return true;
    return img.category === activeTab;
  });

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className={`py-24 bg-white relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
            {lang === 'vi' ? 'THƯ VIỆN HÌNH ẢNH' : 'PHOTO GALLERY'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 mb-4 tracking-tight">
            {t('gallery.title')}
          </h2>

          {/* Category Tabs */}
          <div className="inline-flex p-1 bg-[#F4F1EA] rounded-xl border border-neutral-200/70 mt-6 gap-1">
            {[
              { key: 'all', label: t('gallery.tab_all') },
              { key: 'rooms', label: t('gallery.tab_rooms') },
              { key: 'dining', label: t('gallery.tab_dining') },
              { key: 'facilities', label: t('gallery.tab_facilities') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item.url)}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm group cursor-pointer border border-neutral-200/80 bg-neutral-100"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                <Eye className="w-6 h-6 text-[#E8DCB9] mb-2 transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="font-serif font-semibold text-sm">
                  {item.title}
                </span>
                <span className="text-[10px] uppercase text-neutral-300 mt-1">Phóng to</span>
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
