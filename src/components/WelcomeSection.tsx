import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MapPin, Utensils, Waves, ShieldCheck } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const stats = [
    { num: '4.7★', label: lang === 'vi' ? 'Đánh giá (320+ lượt)' : 'Rating (320+ reviews)' },
    { num: '30+', label: lang === 'vi' ? 'Phòng tiện nghi' : 'Cozy Guest Rooms' },
    { num: '24/7', label: lang === 'vi' ? 'Lễ tân & An ninh' : 'Reception & Security' },
    { num: '100m', label: lang === 'vi' ? 'Phố đi bộ Bùi Viện' : 'To Bui Vien Street' },
  ];

  const highlights = [
    { icon: MapPin, text: t('about.hl1') },
    { icon: Utensils, text: t('about.hl2') },
    { icon: Waves, text: t('about.hl3') },
    { icon: ShieldCheck, text: t('about.hl4') },
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className={`py-24 bg-[#F5F2EB] relative overflow-hidden reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Clean Image presentation */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_-16px_rgba(0,0,0,0.15)] border border-neutral-200/80 bg-white">
              <img
                src="/images/welcome-1.jpg"
                alt="Galaxy Boutique Hotel"
                className="w-full h-[420px] sm:h-[500px] object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
              />
              
              {/* Minimal floating badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/75 backdrop-blur-md text-white flex items-center justify-between border border-white/10">
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#E8DCB9]">
                    Galaxy Boutique Hotel Saigon
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    269/19 Đề Thám, P. Bến Thành, Quận 1
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-serif font-bold text-sm">
                  4.7★
                </div>
              </div>
            </div>

            {/* Overlapping secondary image */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden border-4 border-white shadow-xl z-20">
              <img
                src="/images/welcome-2.jpg"
                alt="Cozy Room Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Editorial Text & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
                {lang === 'vi' ? 'VỀ CHÚNG TÔI' : 'ABOUT GALAXY'}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-tight tracking-tight">
                {t('about.title')}
              </h2>
            </div>

            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base font-sans">
              {t('about.desc1')}
            </p>

            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base font-sans">
              {t('about.desc2')}
            </p>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-[#E8DCB9]" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-neutral-200/80">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-neutral-200/70 shadow-sm text-center">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                    {stat.num}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
