import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Compass, Shirt, MapPin, Clock, Check, Sparkles } from 'lucide-react';

export const GymFacilitySection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  // Load custom admin edited boxes if any
  const customBoxes = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_services_boxes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  }, []);

  const defaultServices = [
    {
      icon: Compass,
      title: t('facilities.gym_title'),
      desc: t('facilities.gym_desc'),
      image: '/images/tour-mekong.jpg',
      tag: t('facilities.gym_tag'),
      hours: '24/7 Hỗ trợ',
      highlights: [t('facilities.gym_hl1'), t('facilities.gym_hl2'), t('facilities.gym_hl3')]
    },
    {
      icon: Shirt,
      title: t('facilities.spa_title'),
      desc: t('facilities.spa_desc'),
      image: '/images/towels.png',
      tag: t('facilities.spa_tag'),
      hours: 'Lấy trong ngày',
      highlights: [t('facilities.spa_hl1'), t('facilities.spa_hl2'), t('facilities.spa_hl3')]
    },
    {
      icon: MapPin,
      title: t('facilities.pool_title'),
      desc: t('facilities.pool_desc'),
      image: '/images/bui-vien-night.jpg',
      tag: t('facilities.pool_tag'),
      hours: 'Vị trí đắc địa',
      highlights: [t('facilities.pool_hl1'), t('facilities.pool_hl2'), t('facilities.pool_hl3')]
    }
  ];

  const services = customBoxes ? [
    {
      icon: Compass,
      title: customBoxes[0]?.title || t('facilities.gym_title'),
      desc: customBoxes[0]?.desc || t('facilities.gym_desc'),
      image: '/images/tour-mekong.jpg',
      tag: customBoxes[0]?.tag || t('facilities.gym_tag'),
      hours: '24/7 Hỗ trợ',
      highlights: customBoxes[0]?.items || [t('facilities.gym_hl1'), t('facilities.gym_hl2'), t('facilities.gym_hl3')]
    },
    {
      icon: Shirt,
      title: customBoxes[1]?.title || t('facilities.spa_title'),
      desc: customBoxes[1]?.desc || t('facilities.spa_desc'),
      image: '/images/towels.png',
      tag: customBoxes[1]?.tag || t('facilities.spa_tag'),
      hours: 'Lấy trong ngày',
      highlights: customBoxes[1]?.items || [t('facilities.spa_hl1'), t('facilities.spa_hl2'), t('facilities.spa_hl3')]
    },
    {
      icon: MapPin,
      title: customBoxes[2]?.title || t('facilities.pool_title'),
      desc: customBoxes[2]?.desc || t('facilities.pool_desc'),
      image: '/images/bui-vien-night.jpg',
      tag: customBoxes[2]?.tag || t('facilities.pool_tag'),
      hours: 'Vị trí đắc địa',
      highlights: customBoxes[2]?.items || [t('facilities.pool_hl1'), t('facilities.pool_hl2'), t('facilities.pool_hl3')]
    }
  ] : defaultServices;

  return (
    <section 
      id="facilities" 
      ref={sectionRef} 
      className={`py-24 bg-[#F5F2EB] relative reveal-fade-up ${isVisible ? 'is-revealed' : ''} font-sans`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE3D2] text-[#8A6943] text-[11px] font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8A6943]" />
            <span>{t('facilities.eyebrow')}</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
            {t('facilities.title')}
          </h2>

          <p className="text-neutral-600 text-xs sm:text-sm font-sans max-w-2xl mx-auto leading-relaxed">
            {t('facilities.sub')}
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((fac, index) => {
            const Icon = fac.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group"
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
                      <span className="text-[10px] font-bold tracking-wider text-white bg-neutral-950/85 backdrop-blur-md px-3 py-1 rounded-lg uppercase shadow">
                        {fac.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#E8DCB9]" />
                      <span>{fac.hours}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#8A6943] flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-sans font-bold text-lg text-neutral-900 group-hover:text-[#8A6943] transition-colors leading-tight">
                        {fac.title}
                      </h3>
                    </div>

                    <p className="text-neutral-600 text-xs leading-relaxed mb-4">
                      {fac.desc}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-neutral-100">
                      {fac.highlights.map((hl: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-neutral-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-[#8A6943] flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href="#contact"
                    className="block w-full py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-800 text-center font-bold text-xs transition-all shadow-sm"
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
