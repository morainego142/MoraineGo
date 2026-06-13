import React from 'react';
import { ArrowUpRight, ArrowRight, Play, Compass, MapPin, Sparkles } from 'lucide-react';
import heroBg from '../assets/images/moraine_lake_ten_peaks_1781244850942.jpg';

interface HeroProps {
  onBookClick: () => void;
  onConciergeClick: () => void;
}

export default function Hero({ onBookClick, onConciergeClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[78vh] flex items-center justify-center overflow-hidden">
      {/* Cinematic Widescreen Background Photo (Generated real photo of Moraine Lake and 10 Peaks) */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <img
          src={heroBg}
          alt="Majestic Moraine Lake and Valley of the Ten Peaks"
          className="w-full h-full object-cover object-[center_35%] scale-102 hover:scale-105 transition-all duration-10000 ease-out opacity-90 sm:opacity-100"
          referrerPolicy="no-referrer"
        />
        {/* Dual Gradient Overlay: Darkening bottom/top for high legibility, keeping a lighter vibrance on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-brand-dark/60 sm:from-brand-dark/90 sm:via-brand-dark/35 sm:to-brand-dark/75" />
        <div className="absolute inset-0 bg-[#077B8A]/10 sm:bg-[#077B8A]/20 mix-blend-overlay" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-6">
          <h1 className="font-sans font-extrabold text-[36px] sm:text-[54px] md:text-[68px] lg:text-[76px] text-white tracking-tight leading-[1.1] drop-shadow-2xl select-none">
            Explore Banff, Lake Louise <br />
            <span className="text-[#3fc5f0]">&amp;</span> Moraine Lake
          </h1>
        </div>

        {/* Short welcoming subtitle matching picture text */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-white max-w-2xl leading-relaxed font-semibold drop-shadow opacity-95">
          Experience the breathtaking beauty of the Canadian Rockies with comfortable transportation and guided tours.
        </p>

        {/* Pill-shaped Check Availability CTA matching the picture */}
        <div className="mt-8">
          <button
            onClick={onBookClick}
            className="bg-[#12b3eb] hover:bg-[#0ea0d4] text-white font-bold text-[14px] sm:text-[15px] px-8 py-3.5 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Check Availability</span>
            <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Hero Bottom wave break divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 translate-y-[1px]">
        <svg className="relative block w-full h-[30px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
