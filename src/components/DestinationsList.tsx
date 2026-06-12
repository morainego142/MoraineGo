import React, { useState } from 'react';
import { POPULAR_DESTINATIONS } from '../data';
import { Compass, Sparkles, MapPin, Map, Navigation, ArrowUpRight, ChevronRight, Activity } from 'lucide-react';

import moraineImg from '../assets/images/moraine_lake_ten_peaks_1781244850942.jpg';
import louiseImg from '../assets/images/lake_louise_glacier_1781244864163.jpg';
import shuttleImg from '../assets/images/shuttle_van_1781302534888.jpg';

const IMAGES = [moraineImg, louiseImg, shuttleImg];

export default function DestinationsList() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#F8FAFC] py-20 px-6" id="destinations">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER (Replicating elegant guidebook aesthetics) */}
        <div className="text-center mb-16">
          <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase">
            EXPLORE THE ROCKIES LANDMARKS
          </span>
          <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-brand-dark mt-2.5 tracking-tight leading-tight">
            Our Popular Destinations
          </h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
            Moraine Lake and Lake Louise are the crown jewels of the Canadian Rockies. Let Moraine Go take you directly from Banff to these restricted and breathtaking waters.
          </p>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {POPULAR_DESTINATIONS.map((dest, idx) => {
            const isTabOpen = activeTab === idx;
            const cardImg = IMAGES[idx];

            return (
              <div
                key={dest.title}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
                id={`destination-card-${idx}`}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-60 md:h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={cardImg}
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating altitude tag */}
                  <div className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-brand-gold" />
                    <span>ALT: {dest.altitude}</span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                      {dest.tagline}
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-1 tracking-wider leading-none">
                      {dest.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-650 leading-relaxed font-sans mb-5">
                      {dest.description}
                    </p>

                    {/* Highly interactive Trails collapsible view toggle */}
                    <div className="border-t border-gray-100 pt-4">
                      <button
                        onClick={() => setActiveTab(isTabOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-xs font-bold text-brand-blue hover:text-brand-cyan transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 uppercase tracking-wide">
                          <Activity className="w-4 h-4 text-brand-cyan" />
                          Recommended Treks &amp; Trails
                        </span>
                        <ChevronRight className={`w-4 h-4 text-brand-gold transform transition-transform ${isTabOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {isTabOpen && (
                        <div className="mt-3.5 bg-slate-50 border border-gray-100 p-3.5 rounded-xl flex flex-col gap-2.5 animate-slide-down">
                          {dest.highlights.map((trail, tIdx) => (
                            <div key={tIdx} className="flex gap-2 items-start text-xs text-slate-700">
                              <span className="w-4.5 h-4.5 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                                {tIdx + 1}
                              </span>
                              <div className="flex flex-col">
                                <p className="font-bold text-[#0D1B2A]">{trail}</p>
                                <p className="text-[10px] text-gray-400">Must Explore Golden Lookout</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Link inside the card */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[#077B8A] font-bold text-[11px] flex items-center gap-1 select-none">
                      <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                      Moraine Go Active Transit Area
                    </span>
                    <a
                      href="#header-root"
                      className="text-brand-blue font-bold hover:text-[#077B8A] flex items-center gap-0.5"
                    >
                      <span>Book connection</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 10 PEAKS SPECIFIC PROMO (Direct response to user "10 peaks mountains photos" request) */}
        <div className="bg-gradient-to-r from-brand-dark to-[#0A3254] text-white rounded-3xl p-8 md:p-12 mt-16 shadow-xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center" id="moraine">
          {/* Subtle logo background */}
          <div className="absolute right-0 bottom-0 opacity-5 -mr-16 -mb-16 pointer-events-none select-none">
            <Compass className="w-96 h-96" />
          </div>

          {/* Left panel text */}
          <div className="flex-1 z-10">
            <span className="text-[10px] font-accent font-extrabold tracking-[0.25em] text-brand-gold uppercase">
              THE MAGNIFICENT VALLEY OF THE TEN PEAKS
            </span>
            <h3 className="font-serif font-extrabold text-2xl md:text-3.5xl text-white mt-2 leading-tight">
              Spectacular 10 Peaks Moraine GO Tours Panoramic
            </h3>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed max-w-xl">
              Moraine Lake lies nested at the foot of Mount Temple, surrounded by the towering 10 serrated peaks of the Bow Range. This amphitheater of rock, ice, and turquoise water was famously depicted on the Canadian twenty-dollar bill.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>Peak 1: Mt. Fay (3,235m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>Peak 2: Mt. Little (3,088m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>Peak 3: Mt. Bowlen (3,072m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>Peak 4: Tonsa (3,057m)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>Plus: Babel, Allen, Tuzo &amp; Temple</span>
              </div>
            </div>
          </div>

          {/* Right panel photography */}
          <div className="md:w-1/3 flex-shrink-0 z-10 relative overflow-hidden rounded-2xl h-48 md:h-56 shadow-lg border border-white/10 group">
            <img
              src={moraineImg}
              alt="Real 10 Peaks reflection mountains"
              className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/3D via-black/10 to-transparent flex items-end p-4">
              <div className="bg-black/40 backdrop-blur-sm p-2 rounded text-[11px] text-gray-100 w-full text-center">
                🏔️ Stunning real-life Valley of the 10 Peaks
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
