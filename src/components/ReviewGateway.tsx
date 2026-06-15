import React, { useState, useEffect } from 'react';
import { 
  Star, ExternalLink, MessageSquare, Sparkles, CheckCircle, Award, 
  MapPin, ShieldCheck, Heart, X, ChevronRight, ThumbsUp,
  Copy, Check, RefreshCw
} from 'lucide-react';

interface ReviewGatewayProps {
  onClose: () => void;
  googleReviewUrl?: string;
}

export default function ReviewGateway({ 
  onClose, 
  googleReviewUrl: propGoogleReviewUrl = 'https://www.google.com/maps/search/?api=1&query=Moraine+Go+Tours+Banff+Shuttle' 
}: ReviewGatewayProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [userComment, setUserComment] = useState('');
  const [step, setStep] = useState<'rate' | 'success'>('rate');
  const [copied, setCopied] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Dynamic Google Review destination URL state (supports query string extraction)
  const [googleReviewUrl, setGoogleReviewUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('target');
      if (urlParam) {
        try {
          return decodeURIComponent(urlParam);
        } catch (e) {
          return urlParam;
        }
      }
      try {
        const savedDirect = localStorage.getItem('moraine_direct_google_url');
        if (savedDirect) return savedDirect;
      } catch (e) {}
    }
    return propGoogleReviewUrl;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('target');
      if (urlParam) {
        try {
          setGoogleReviewUrl(decodeURIComponent(urlParam));
          return;
        } catch (e) {}
      }
    }
    if (propGoogleReviewUrl) {
      setGoogleReviewUrl(propGoogleReviewUrl);
    }
  }, [propGoogleReviewUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRedirecting && redirectCountdown > 0) {
      interval = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isRedirecting && redirectCountdown === 0) {
      // Trigger redirect to official Google Review URL safely in a new tab!
      try {
        window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
      } catch (innerErr) {
        console.warn('Blockable popup encountered:', innerErr);
      }
      
      // Show troubleshooting/diagnostics automatically if blocked or stuck on this page
      setShowDiagnostics(true);
      
      // ONLY change window location if we are NOT running in an iframe layout
      // on Google AI Studio or mobile sandboxes to prevent X-Frame-Options SAMEORIGIN crashes!
      const isIframe = typeof window !== 'undefined' && (window.self !== window.top || window.location.hostname.includes('run.app'));
      if (!isIframe) {
        setTimeout(() => {
          try {
            window.location.href = googleReviewUrl;
          } catch (navErr) {
            console.error('Navigation error:', navErr);
          }
        }, 200);
      }
    }
    return () => clearInterval(interval);
  }, [isRedirecting, redirectCountdown, googleReviewUrl]);

  const handleRatingSubmit = (rating: number) => {
    setSelectedRating(rating);
    setStep('success');
    setIsRedirecting(true);
  };

  const skipToGoogle = () => {
    try {
      window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
    } catch (innerErr) {
      console.warn('Popup blocked:', innerErr);
    }
    
    const isIframe = typeof window !== 'undefined' && (window.self !== window.top || window.location.hostname.includes('run.app'));
    if (!isIframe) {
      try {
        window.location.href = googleReviewUrl;
      } catch (navErr) {
        console.error('Frame navigation blocked:', navErr);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleReviewUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1B2A]/90 backdrop-blur-md animate-fadeIn" id="review-gateway-popup">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-white/10">
        
        {/* Top brand header with background visual pattern */}
        <div className="bg-gradient-to-br from-[#0D1B2A] to-[#077B8A] p-6 text-white text-center relative select-none">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-full p-1.5 transition cursor-pointer"
            title="Return to website"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-accent font-extrabold tracking-[0.3em] text-[#C5A059] uppercase block mb-1">
            MORAINE GO SHUTTLE &amp; TOURS
          </span>
          <h2 className="font-serif font-black text-xl tracking-tight leading-snug">
            Welcome Back, Traveler!
          </h2>
          <p className="text-[11px] text-teal-100 max-w-xs mx-auto mt-1 leading-normal">
            Thank you for riding our premium Rockies shuttle service today.
          </p>
        </div>

        {/* Dynamic Inner Step content */}
        {step === 'rate' ? (
          <div className="p-6 text-center">
            {/* Friendly prompt */}
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-cyan-50 border border-cyan-100 rounded-2xl text-[#077B8A]">
                <Heart className="w-7 h-7 fill-brand-cyan/25 text-[#077B8A] animate-pulse" />
              </span>
            </div>

            <h3 className="font-serif font-extrabold text-base text-brand-dark mb-1">
              How was your journey today?
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
              Our professional mountain drivers always strive for a perfect 5-star experience. Tap your rating below to continue to Google Reviews:
            </p>

            {/* Interactive Stars Selector */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => handleRatingSubmit(star)}
                  className="p-1 cursor-pointer transition transform hover:scale-115 active:scale-95"
                  title={`Star ${star} of 5`}
                >
                  <Star 
                    className={`w-9 h-9 transition-all duration-150 ${
                      star <= (hoveredRating ?? selectedRating ?? 0)
                        ? 'text-amber-500 fill-amber-400 drop-shadow-sm'
                        : 'text-gray-200'
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Quick Helper Badge */}
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3 text-left mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10.5px] text-gray-600 font-medium">
                  Verified guest feedback pathway
                </span>
              </div>
              <span className="text-[8.5px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold uppercase">
                Secure
              </span>
            </div>

            {/* Skip Option Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 select-none">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer py-1"
              >
                Go to website
              </button>
              <button
                onClick={skipToGoogle}
                className="text-[#077B8A] hover:text-[#066572] text-xs font-bold cursor-pointer py-1 flex items-center gap-1"
              >
                Direct Google link <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : (
          /* SUCCESS STATE - EXTREMELY SATISFYING REDIRECT TRANSITION ENGINE */
          <div className="p-8 text-center animate-fadeIn select-none">
            
            <div className="flex justify-center mb-4">
              <div className="relative animate-bounce">
                <span className="p-4 bg-amber-50 border border-amber-200 rounded-full text-amber-500 inline-block">
                  <Sparkles className="w-8 h-8 fill-amber-300 text-amber-500" />
                </span>
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white p-0.5 px-1.5 rounded-full text-[9px] font-bold">
                  ✓
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>

            <h3 className="font-serif font-extrabold text-base text-[#0D1B2A] mb-1">
              Outstanding! Thank You!
            </h3>
            
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
              You selected a premium support rating. We are now opening our official Google Business review card so you can write a short comment about your trip!
            </p>

            {/* Giant Countdown circle */}
            <div className="w-16 h-16 rounded-full border-4 border-[#077B8A]/15 border-t-[#077B8A] mx-auto flex items-center justify-center text-xl font-serif font-black text-brand-dark animate-spin-slow mb-4">
              <span className="animate-pulse">{redirectCountdown}</span>
            </div>

            <div className="bg-[#077B8A]/5 border border-[#077B8A]/10 p-2 text-[10.5px] text-[#077B8A] font-medium rounded-xl mb-4 max-w-xs mx-auto">
              ⏳ Redirecting to Google Maps...
            </div>

            {/* Manual button if redirect is slowed down */}
            <button
              onClick={skipToGoogle}
              className="w-full bg-[#077B8A] hover:bg-[#066572] text-white text-xs font-extrabold uppercase py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow cursor-pointer text-center"
            >
              Click if not redirected <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* DIAGNOSTIC OVERLAY / TROUBLESHOOTING DRAWER */}
            <div className="mt-5 border-t border-dashed border-gray-200 pt-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  QR Destination Guard
                </span>
                <button 
                  type="button"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="text-[11px] text-[#077B8A] hover:underline font-bold flex items-center gap-1 focus:outline-none cursor-pointer"
                >
                  <span>🔧</span> {showDiagnostics ? "Hide Diagnostics" : "Having Issues Redirecting?"}
                </button>
              </div>

              {showDiagnostics && (
                <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 animate-fadeIn">
                  <div className="text-[11px] font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                    <span>💡</span> Troubled scan, blocked popup, or expired link?
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal mb-3 font-medium">
                    Some mobile in-app browsers block automatic redirections. You can click "Retry" or copy the official link directly to bypass this!
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Retry Redirect Button */}
                    <button
                      type="button"
                      onClick={skipToGoogle}
                      className="bg-[#077B8A] hover:bg-[#066572] text-white text-[10.5px] font-extrabold uppercase py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer transition-all duration-150"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry Link
                    </button>

                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`text-[10.5px] font-extrabold uppercase py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer transition-all duration-150 border ${
                        copied 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-[9.5px] text-gray-500 font-sans">
                    <strong className="text-gray-700 block mb-1">Direct Target URL:</strong>
                    <a 
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono break-all text-[9.5px] select-all bg-[#077B8A]/5 hover:bg-[#077B8A]/10 text-[#077B8A] hover:text-[#066572] p-2.5 rounded-xl border border-[#077B8A]/15 block leading-relaxed font-bold flex items-center justify-between gap-2.5 transition active:scale-[0.99]"
                      title="Click directly to open this Google review link"
                    >
                      <span className="truncate flex-1">{googleReviewUrl}</span>
                      <span className="shrink-0 text-[10px] font-sans font-extrabold uppercase bg-[#077B8A] hover:bg-[#066572] text-white px-2 py-0.5 rounded-lg tracking-wide shadow-xs flex items-center gap-0.5">
                        Open Link ↗
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xs mt-4 font-semibold inline-block cursor-pointer"
            >
              Stay on Website instead
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
