import React, { useState } from 'react';
import { X, ZoomIn, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/images/moraine_go_logo_1781297349753.jpg';

interface LogoProps {
  className?: string;
  showText?: boolean;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showText = true, light = false, size = 'lg' }: LogoProps) {
  const primaryColor = light ? 'text-white' : 'text-[#0a1e33]';
  const [isZoomed, setIsZoomed] = useState(false);

  // Define sizes for the logo image, text, and gap
  let imgSizeClasses = "h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44";
  let titleTextClasses = "text-[18px] sm:text-[20px] md:text-[22px] tracking-wider";
  let subtitleTextClasses = "text-[9px] sm:text-[10px] md:text-[11px] mt-1 tracking-[0.16em]";
  let containerGapClasses = "gap-4";

  if (size === 'sm') {
    imgSizeClasses = "h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18";
    titleTextClasses = "text-[13px] sm:text-[14px] md:text-[15px] tracking-wide";
    subtitleTextClasses = "text-[7.5px] sm:text-[8px] md:text-[8.5px] mt-0.5 tracking-[0.10em]";
    containerGapClasses = "gap-2.5";
  } else if (size === 'md') {
    imgSizeClasses = "h-18 w-18 sm:h-22 sm:w-22 md:h-26 md:w-26";
    titleTextClasses = "text-[15px] sm:text-[17px] md:text-[18px] tracking-wider";
    subtitleTextClasses = "text-[8px] sm:text-[9px] md:text-[9.5px] mt-1 tracking-[0.12em]";
    containerGapClasses = "gap-3";
  }

  return (
    <>
      <div className={`flex items-center ${containerGapClasses} ${className}`}>
        {/* High-Fidelity Custom Generated Brand Logo with Zoom Trigger */}
        <button
          onClick={() => setIsZoomed(true)}
          className="group/logo relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-white p-1.5 shadow-md hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0 cursor-zoom-in focus:outline-none"
          title="Click to zoom logo details"
        >
          <img
            src={logoImg}
            alt="Moraine Go Tours Logo"
            className={`${imgSizeClasses} object-contain`}
            referrerPolicy="no-referrer"
          />
          {/* Zoom Overlay Indicator */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 p-2 rounded-full shadow-lg transform translate-y-2 group-hover/logo:translate-y-0 transition-transform duration-300">
              <ZoomIn className="w-5 h-5 text-slate-800" strokeWidth={2.5} />
            </div>
          </div>
        </button>

        {/* Typography side of Logo */}
        {showText && (
          <div className="flex flex-col select-none leading-tight font-sans min-w-0">
            <span className={`font-black uppercase ${titleTextClasses} ${primaryColor}`}>
              MORAINE GO TOURS
            </span>
            <span className={`font-bold text-gray-500 uppercase mt-1 ${subtitleTextClasses}`}>
              BANFF • LAKE LOUISE • MORAINE LAKE
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in">
          {/* Close button outside / click shield */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsZoomed(false)} />
          
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row z-10 animate-scale-up">
            
            {/* The Logo Image at full, glorious size (5 times larger) */}
            <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-150">
              <img
                src={logoImg}
                alt="Moraine Go Master Emblem Logo - High Resolution Closeup"
                className="w-full h-auto max-h-[75vh] object-contain drop-shadow-2xl rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Logo Details Guide Column */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-white text-slate-800">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">
                      Official Brand Book
                    </span>
                    <h3 className="font-sans font-black text-2xl text-slate-900 mt-1 uppercase">
                      Moraine Go Crest
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsZoomed(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                    aria-label="Close detailed viewer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans mb-6">
                  Artisanal travel emblem detailing our signature routes and natural heritage in Banff National Park. Click outside or use the close button to return to the booking page.
                </p>

                {/* Wildlife & Route Explanations */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xl">🏔️</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">Dynamic Route Map</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        A winding trail connecting our premium shuttle hubs: <strong>Banff</strong>, <strong>Lake Louise</strong>, and <strong>Moraine Lake</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xl">🦌</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide font-sans">The Bull Elk</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Standing proudly on the left peak, overlooking the pristine forests that frame our transport lanes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xl">🐻</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide font-sans">The Grizzly Bear</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        The ultimate symbol of wilderness preservation in Banff National Park.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xl">🐺</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide font-sans">The Gray Wolf</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Positioned in the center foreground, depicting our commitment to safe journeys in deep pine forests.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-xl">🐏</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide font-sans">The Bighorn Sheep</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Standing vigil on the right crag representing agile mountain navigation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer bar within the modal */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-400">
                <div className="flex items-center gap-1.5 uppercase tracking-wide font-bold text-[10px] text-cyan-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Licensed Shuttle Service</span>
                </div>
                <span>Slogan: "Your Journey, Our Nature"</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
