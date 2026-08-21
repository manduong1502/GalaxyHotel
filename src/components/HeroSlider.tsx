import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSliderProps {
  onOpenBooking: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85',
      subtitle: t('hero.slide1.subtitle'),
      title: t('hero.slide1.title'),
      highlight: 'SANG TRỌNG & ĐẲNG CẤP',
    },
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85',
      subtitle: t('hero.slide2.subtitle'),
      title: t('hero.slide2.title'),
      highlight: 'TRẢI NGHIỆM ĐỈNH CAO',
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85',
      subtitle: t('hero.slide3.subtitle'),
      title: t('hero.slide3.title'),
      highlight: 'VỊ TRÍ ĐẮC ĐỊA QUẬN 1',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-[88vh] min-h-[600px] max-h-[920px] w-full overflow-hidden bg-black select-none">
      {/* Background Slides with Ken Burns Effect */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover object-center brightness-[0.62] ${
              index === currentSlide ? 'animate-ken-burns' : ''
            }`}
          />
          {/* Subtle cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark via-black/25 to-black/50" />
        </div>
      ))}

      {/* Hero Content with Staggered Fade-in */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white pt-16">
        
        {/* Luxury Badge */}
        <div 
          key={`badge-${currentSlide}`}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-hotel-gold/40 mb-6 shadow-gold-glow animate-fade-in"
          style={{ animationDuration: '0.6s' }}
        >
          <Sparkles className="w-4 h-4 text-hotel-gold animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-hotel-gold uppercase">
            {t('hero.badge')}
          </span>
        </div>

        {/* Dynamic Slide Title */}
        <h1 
          key={`title-${currentSlide}`}
          className="font-brand text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.08em] uppercase mb-4 text-white drop-shadow-2xl max-w-4xl animate-fade-in"
          style={{ animationDuration: '0.8s' }}
        >
          {slides[currentSlide].title}
        </h1>

        {/* Subtitle */}
        <p 
          key={`sub-${currentSlide}`}
          className="text-base sm:text-xl md:text-2xl text-gray-200 font-light max-w-2xl mb-8 tracking-wide drop-shadow animate-fade-in"
          style={{ animationDuration: '1s' }}
        >
          {slides[currentSlide].subtitle}
        </p>

        {/* Action Buttons with Magnetic kinetic physics */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#rooms"
            className="btn-magnetic w-full sm:w-auto px-8 py-3.5 rounded-full bg-hotel-gold text-hotel-navy font-bold text-sm tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>{t('hero.view_rooms')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
          <button
            onClick={onOpenBooking}
            className="btn-magnetic w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-hotel-gold" />
            <span>{t('hero.book_room')}</span>
          </button>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="btn-magnetic absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-hotel-gold hover:text-hotel-navy text-white backdrop-blur-md border border-white/20 flex items-center justify-center"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="btn-magnetic absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-hotel-gold hover:text-hotel-navy text-white backdrop-blur-md border border-white/20 flex items-center justify-center"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3 items-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              idx === currentSlide ? 'w-10 bg-hotel-gold shadow-gold-glow' : 'w-2.5 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
