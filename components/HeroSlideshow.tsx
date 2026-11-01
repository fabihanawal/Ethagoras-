import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Pause, Play } from 'lucide-react';
import { Slide } from '../lib/types';

interface HeroSlideshowProps {
  slides: Slide[];
  navigate: (route: string) => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ slides, navigate }) => {
  const activeSlides = slides.filter(s => s.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused]);

  if (!activeSlides.length) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div 
        className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] lg:rounded-[4rem] min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] shadow-2xl border border-white/20 transition-all duration-700 bg-gray-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Slide Image with subtle zoom and overlay */}
        <div
          key={currentSlide.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 group-hover:scale-100 brightness-75"
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
        />

        {/* Gradient Backdrop with Ether Emerald & Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#183919]/95 via-[#2c5f2d]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Slide Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-3xl min-h-[500px] sm:min-h-[560px] lg:min-h-[620px]">
          <div>
            {currentSlide.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffd700]/25 backdrop-blur-md border border-[#ffd700]/50 text-[#ffd700] text-xs sm:text-sm font-bold mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>{currentSlide.badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md mb-5">
              {currentSlide.title}
            </h1>

            <p className="text-base sm:text-xl text-gray-200 font-medium leading-relaxed max-w-2xl drop-shadow">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(currentSlide.ctaLink || '#/admission')}
              className="px-8 py-4 rounded-3xl bg-gradient-to-r from-[#ffd700] via-[#ffd700] to-[#f0c400] text-gray-900 font-extrabold text-base shadow-xl shadow-[#ffd700]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
            >
              <span>{currentSlide.ctaText || 'শুরু করুন'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('#/quiz')}
              className="px-6 py-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-base hover:bg-white/25 transition-all duration-300 flex items-center gap-2"
            >
              <span>কুইজ যাচাই</span>
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute right-6 bottom-8 z-20 hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-[#ffd700] hover:text-gray-900 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-[#ffd700] hover:text-gray-900 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
          {activeSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-10 bg-[#ffd700] shadow-md shadow-[#ffd700]/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
