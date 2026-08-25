import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Dumbbell, Waves, HeartHandshake, Clock, Check } from 'lucide-react';

export const GymFacilitySection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const facilities = [
    {
      icon: Dumbbell,
      title: t('facilities.gym_title'),
      desc: t('facilities.gym_desc'),
      image: '/images/rooms/phong-d.jpg',
      tag: t('facilities.gym_tag'),
      hours: '24/7',
      highlights: [t('facilities.gym_hl1'), t('facilities.gym_hl2'), t('facilities.gym_hl3')]
    },
    {
      icon: HeartHandshake,
      title: t('facilities.spa_title'),
      desc: t('facilities.spa_desc'),
      image: '/images/facility-1.jpg',
      tag: t('facilities.spa_tag'),
      hours: '24/7',
      highlights: [t('facilities.spa_hl1'), t('facilities.spa_hl2'), t('facilities.spa_hl3')]
    },
    {
      icon: Waves,
      title: t('facilities.pool_title'),
      desc: t('facilities.pool_desc'),
      image: '/images/hero-1.jpg',
      tag: t('facilities.pool_tag'),
      hours: '24/7',
      highlights: [t('facilities.pool_hl1'), t('facilities.pool_hl2'), t('facilities.pool_hl3')]
    }
  ];

  return (
    <section 
      id="facilities" 
      ref={sectionRef} 
      className={`py-24 bg-[#F5F2EB] relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
            {lang === 'vi' ? 'TIỆN NGHI CAO CẤP' : 'HOTEL FACILITIES'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 mb-4 tracking-tight">
            {t('facilities.title')}
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base font-sans">
            {t('facilities.sub')}
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {facilities.map((fac, index) => {
            const Icon = fac.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold tracking-wider text-white bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded uppercase">
                        {fac.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#E8DCB9]" />
                      <span>{fac.hours}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif font-bold text-xl text-neutral-900 mb-2 group-hover:text-[#8A6943] transition-colors">
                      {fac.title}
                    </h3>

                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {fac.desc}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                      {fac.highlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-[#8A6943] flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href="#contact"
                    className="btn-magnetic block w-full py-2.5 rounded-lg border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 text-center font-semibold text-xs transition-colors"
                  >
                    {t('facilities.contact_btn')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
