import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';

import { getBilingualText } from '../utils/bilingual';

interface HeroSliderProps {
  onOpenBooking: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenBooking }) => {
  const { t, lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      image: '/images/hero-1.jpg',
      subtitle: t('hero.slide1.subtitle'),
      title: t('hero.slide1.title'),
      highlight: lang === 'vi' ? 'SẠCH SẼ & ẤM CÚNG' : 'CLEAN & COZY',
    },
    {
      image: '/images/hero-2.jpg',
      subtitle: t('hero.slide2.subtitle'),
      title: t('hero.slide2.title'),
      highlight: lang === 'vi' ? 'TIỆN NGHI HOÀN HẢO' : 'PERFECT AMENITIES',
    },
    {
      image: '/images/facility-1.jpg',
      subtitle: t('hero.slide3.subtitle'),
      title: t('hero.slide3.title'),
      highlight: lang === 'vi' ? 'TÂM ĐIỂM QUẬN 1' : 'DISTRICT 1 HEART',
    }
  ];

  const [customSlides, setCustomSlides] = useState<any[] | null>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0) {
          return parsed.heroSlides;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Fetch live banners from API
  useEffect(() => {
    fetch('/api/banners.php')
      .then(res => res.json())
      .then(res => {
        if (res && res.success && res.data && Array.isArray(res.data.heroSlides) && res.data.heroSlides.length > 0) {
          setCustomSlides(res.data.heroSlides);
          localStorage.setItem('galaxy_hotel_banners', JSON.stringify(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const slides = customSlides ? customSlides.map((s, idx) => ({
    image: s.image || defaultSlides[idx % defaultSlides.length].image,
    title: getBilingualText(s.title, lang, defaultSlides[idx % defaultSlides.length].title),
    subtitle: getBilingualText(s.subtitle, lang, defaultSlides[idx % defaultSlides.length].subtitle),
    highlight: getBilingualText(s.highlight, lang, defaultSlides[idx % defaultSlides.length].highlight)
  })) : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-[90vh] min-h-[640px] max-h-[960px] w-full overflow-hidden bg-neutral-950 select-none">
      {/* Background Slides with Ken Burns Effect */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            onError={(e) => {
              e.currentTarget.src = defaultSlides[index % defaultSlides.length]?.image || '/images/hero-1.jpg';
            }}
            className={`w-full h-full object-cover object-center brightness-[0.65] ${
              index === currentSlide ? 'animate-ken-burns' : ''
            }`}
          />
          {/* Subtle cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black/20 to-black/40" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white pt-20">
        
        {/* Subtle Brand Tag */}
        <span 
          key={`tag-${currentSlide}`}
          className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#E8DCB9] uppercase mb-4 animate-fade-in block"
        >
          {slides[currentSlide]?.highlight ? `GALAXY BOUTIQUE HOTEL • ${slides[currentSlide].highlight}` : 'GALAXY BOUTIQUE HOTEL • QUẬN 1'}
        </span>

        {/* Dynamic Slide Title with Plus Jakarta Sans */}
        <h1 
          key={`title-${currentSlide}`}
          className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 max-w-4xl animate-fade-in leading-[1.12]"
        >
          {slides[currentSlide].title}
        </h1>

        {/* Subtitle */}
        <p 
          key={`sub-${currentSlide}`}
          className="text-sm sm:text-lg md:text-xl text-neutral-200 font-normal max-w-2xl mb-8 tracking-normal leading-relaxed animate-fade-in"
        >
          {slides[currentSlide].subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <a
            href="#rooms"
            className="btn-magnetic w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white text-neutral-950 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 group shadow-md"
          >
            <span>{t('hero.view_rooms')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={onOpenBooking}
            className="btn-magnetic w-full sm:w-auto px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-[#E8DCB9]" />
            <span>{t('hero.book_room')}</span>
          </button>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-white hover:text-neutral-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors shadow-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-white hover:text-neutral-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors shadow-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
