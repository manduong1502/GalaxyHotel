import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Sparkles, MapPin, Utensils, Waves, ShieldCheck } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.12);

  const stats = [
    { num: t('about.stat1_num'), label: t('about.stat1_label') },
    { num: t('about.stat2_num'), label: t('about.stat2_label') },
    { num: t('about.stat3_num'), label: t('about.stat3_label') },
    { num: t('about.stat4_num'), label: t('about.stat4_label') },
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
      className={`py-20 bg-hotel-cream relative overflow-hidden reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage with Double-Bezel frame */}
          <div className="lg:col-span-6 relative">
            <div className="p-2 sm:p-3 rounded-3xl bg-white/70 border border-hotel-gold/40 shadow-luxury transition-all duration-700 hover:shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/images/welcome-1.jpg"
                  alt="Galaxy Boutique Hotel"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hotel-navy/80 via-transparent to-transparent" />
                
                {/* Floating badge inside image */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-hotel-dark/85 backdrop-blur-md border border-hotel-gold/30 text-white flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-hotel-gold text-hotel-navy flex items-center justify-center font-bold text-base flex-shrink-0 font-brand">
                    4.7★
                  </div>
                  <div>
                    <h4 className="font-brand font-bold text-sm sm:text-base text-hotel-gold tracking-wider">
                      {t('about.badge_title')}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {t('about.badge_sub')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping secondary decorative image */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-20 hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <img
                src="/images/welcome-2.jpg"
                alt="Cozy Room Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Editorial Text & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hotel-sand border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
              <span>{t('about.eyebrow')}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy leading-tight">
              {t('about.title')}
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {t('about.desc1')}
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {t('about.desc2')}
            </p>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-hotel-gold/20 text-hotel-navy flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-3.5 h-3.5 text-hotel-navy" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm text-center card-hover-effect">
                  <div className="font-serif text-xl sm:text-2xl font-extrabold text-hotel-navy">
                    {stat.num}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">
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
