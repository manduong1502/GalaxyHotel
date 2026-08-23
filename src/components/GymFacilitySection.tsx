import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Dumbbell, Sparkles, Waves, HeartHandshake, Clock, CheckCircle2 } from 'lucide-react';

export const GymFacilitySection: React.FC = () => {
  const { t } = useLanguage();
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
      className={`py-20 bg-hotel-cream relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span>{t('facilities.eyebrow')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy mb-4">
            {t('facilities.title')}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {t('facilities.sub')}
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((fac, index) => {
            const Icon = fac.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-luxury card-hover-effect flex flex-col group"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold tracking-widest text-hotel-navy bg-hotel-gold px-3 py-1 rounded-full uppercase shadow">
                      {fac.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-hotel-gold" />
                    <span>{fac.hours}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-full bg-hotel-navy text-hotel-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-xl text-hotel-navy group-hover:text-hotel-goldDark transition-colors duration-300">
                        {fac.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {fac.desc}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      {fac.highlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-hotel-goldDark flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-4">
                    <a
                      href="#contact"
                      className="btn-magnetic block w-full py-2.5 rounded-xl bg-hotel-sand/70 hover:bg-hotel-navy hover:text-white text-hotel-navy text-center font-bold text-xs uppercase tracking-wider"
                    >
                      {t('facilities.contact_btn')}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
