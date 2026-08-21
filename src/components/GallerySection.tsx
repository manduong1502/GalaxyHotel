import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { galleryImages } from '../data/mockData';
import { Sparkles, Eye, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { t } = useLanguage();
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
      className={`py-20 bg-white relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hotel-sand border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span>{t('gallery.eyebrow')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy mb-4">
            {t('gallery.title')}
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { key: 'all', label: t('gallery.tab_all') },
              { key: 'rooms', label: t('gallery.tab_rooms') },
              { key: 'dining', label: t('gallery.tab_dining') },
              { key: 'facilities', label: t('gallery.tab_facilities') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`btn-magnetic px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-hotel-navy text-hotel-gold shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              style={{ animationDelay: `${idx * 60}ms` }}
              className="relative h-52 sm:h-64 rounded-2xl overflow-hidden shadow-md group cursor-pointer animate-fade-in"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-hotel-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out flex flex-col items-center justify-center text-white p-4">
                <Eye className="w-8 h-8 text-hotel-gold mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-400" />
                <span className="font-serif font-bold text-sm tracking-wide text-center">
                  {item.title}
                </span>
                <span className="text-[10px] uppercase text-hotel-gold mt-1">Bấm để phóng to</span>
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
            className="btn-magnetic absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-6 h-6" />
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
