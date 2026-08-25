import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Clock, MapPin, Check } from 'lucide-react';

export const DiningSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const services = [
    {
      title: t('dining.dish1_title'),
      desc: t('dining.dish1_desc'),
      image: '/images/hero-1.jpg',
      tag: lang === 'vi' ? 'Check-in Nhanh' : 'Express Check-in',
    },
    {
      title: t('dining.dish2_title'),
      desc: t('dining.dish2_desc'),
      image: '/images/welcome-1.jpg',
      tag: lang === 'vi' ? 'Miễn Phí' : 'Complimentary',
    },
    {
      title: t('dining.dish3_title'),
      desc: t('dining.dish3_desc'),
      image: '/images/welcome-2.jpg',
      tag: lang === 'vi' ? 'Khử Khuẩn Chuẩn' : 'Daily Cleaned',
    }
  ];

  return (
    <section 
      id="dining" 
      ref={sectionRef} 
      className={`py-24 bg-white relative overflow-hidden reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
              {lang === 'vi' ? 'DỊCH VỤ NGHỈ DƯỠNG' : 'GUEST SERVICES'}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight">
              {t('dining.title')}
            </h2>

            <p className="text-neutral-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed font-sans">
              {t('dining.desc')}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-[#F4F1EA] px-4 py-2.5 rounded-lg border border-neutral-200/80">
              <Clock className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
              <span>{t('dining.hours')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-[#F4F1EA] px-4 py-2.5 rounded-lg border border-neutral-200/80">
              <MapPin className="w-4 h-4 text-[#8A6943] flex-shrink-0" />
              <span>{t('dining.location')}</span>
            </div>
          </div>
        </div>

        {/* Featured Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F5] rounded-2xl overflow-hidden border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2 group-hover:text-[#8A6943] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-700 font-medium">
                  <span className="flex items-center gap-1.5 text-neutral-600">
                    <Check className="w-3.5 h-3.5 text-green-700" />
                    <span>{t('dining.daily_served')}</span>
                  </span>
                  <a href="#contact" className="text-[#8A6943] font-semibold hover:underline">
                    {t('dining.book_table')} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
