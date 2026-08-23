import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const DiningSection: React.FC = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const dishes = [
    {
      title: t('dining.dish1_title'),
      desc: t('dining.dish1_desc'),
      image: '/images/hero-1.jpg',
    },
    {
      title: t('dining.dish2_title'),
      desc: t('dining.dish2_desc'),
      image: '/images/welcome-1.jpg',
    },
    {
      title: t('dining.dish3_title'),
      desc: t('dining.dish3_desc'),
      image: '/images/welcome-2.jpg',
    }
  ];

  return (
    <section 
      id="dining" 
      ref={sectionRef}
      className={`py-20 bg-white relative overflow-hidden reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hotel-sand border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
              <span>{t('dining.eyebrow')}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy">
              {t('dining.title')}
            </h2>

            <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              {t('dining.desc')}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-hotel-navy bg-hotel-sand/60 px-4 py-2.5 rounded-xl border border-gray-200">
              <Clock className="w-4 h-4 text-hotel-goldDark flex-shrink-0" />
              <span>{t('dining.hours')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-hotel-navy bg-hotel-sand/60 px-4 py-2.5 rounded-xl border border-gray-200">
              <MapPin className="w-4 h-4 text-hotel-goldDark flex-shrink-0" />
              <span>{t('dining.location')}</span>
            </div>
          </div>
        </div>

        {/* Featured Dish Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-hotel-cream border border-gray-100 shadow-luxury card-hover-effect flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hotel-navy/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-hotel-gold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md font-brand">
                    GALAXY GOURMET
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-hotel-navy mb-2 group-hover:text-hotel-goldDark transition-colors duration-300">
                    {dish.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {dish.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between text-xs text-hotel-navy font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>{t('dining.daily_served')}</span>
                  </span>
                  <a href="#contact" className="btn-magnetic text-hotel-goldDark font-bold hover:underline cursor-pointer">
                    {t('dining.book_table')}
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
