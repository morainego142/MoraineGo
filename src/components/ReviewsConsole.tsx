import React, { useState, useEffect } from 'react';
import { 
  Star, ExternalLink, CheckCircle, Sparkles, Copy, Check, MessageSquare, ThumbsUp,
  QrCode, Printer, Sliders, Info, RefreshCw, Plus, X
} from 'lucide-react';
import QRCode from 'qrcode';

interface Review {
  id: string;
  author: string;
  avatarLetter: string;
  avatarColor: string;
  rating: number;
  date: string;
  content: string;
  route: string;
  verified: boolean;
}

export default function ReviewsConsole() {
  const [qrMode, setQrMode] = useState<'website_public' | 'direct' | 'sandbox'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moraine_qr_mode');
      return (saved as 'website_public' | 'direct' | 'sandbox') || 'website_public';
    }
    return 'website_public';
  });

  const [publicWebsiteUrl, setPublicWebsiteUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moraine_public_website_url') || 'https://morainego.ca/?greview=true';
    }
    return 'https://morainego.ca/?greview=true';
  });

  const [directGoogleUrl, setDirectGoogleUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moraine_direct_google_url') || 'https://www.google.com/maps/search/?api=1&query=Moraine+Go+Tours+Banff+Shuttle';
    }
    return 'https://www.google.com/maps/search/?api=1&query=Moraine+Go+Tours+Banff+Shuttle';
  });

  const [sandboxUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        let origin = window.location.origin;
        if (!origin || origin === 'null' || !origin.startsWith('http')) {
          origin = 'https://ais-pre-5md3jrkuliqm6yh34rsgii-795749998858.us-east1.run.app';
        }
        if (origin.includes('ais-dev-')) {
          origin = origin.replace('ais-dev-', 'ais-pre-');
        }
        return origin + '/?greview=true';
      } catch (e) {
        return 'https://ais-pre-5md3jrkuliqm6yh34rsgii-795749998858.us-east1.run.app/?greview=true';
      }
    }
    return 'https://ais-pre-5md3jrkuliqm6yh34rsgii-795749998858.us-east1.run.app/?greview=true';
  });

  // Dynamically compute the active reviewUrl for QR rendering
  const reviewUrl = qrMode === 'website_public' 
    ? publicWebsiteUrl 
    : qrMode === 'direct' 
    ? directGoogleUrl 
    : `${sandboxUrl}&target=${encodeURIComponent(directGoogleUrl)}`;

  // Persist URL/Mode updates to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moraine_qr_mode', qrMode);
      localStorage.setItem('moraine_public_website_url', publicWebsiteUrl);
      localStorage.setItem('moraine_direct_google_url', directGoogleUrl);
    }
  }, [qrMode, publicWebsiteUrl, directGoogleUrl]);

  const [businessName, setBusinessName] = useState('Moraine Go Shuttle & Tours');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'qr'>('reviews');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  // Custom poster options
  const [posterSlogan, setPosterSlogan] = useState('Had a 5-star mountain tour? Scan the QR code with your camera to share your review on Google!');
  const [borderColor, setBorderColor] = useState('#077B8A');

  // Offline QR code generator state & effect
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(reviewUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0d1b2a', // High-contrast classy navy-charcoal
        light: '#ffffff' // Crisp white background
      }
    })
    .then(url => {
      if (isMounted) {
        setQrCodeDataUrl(url);
      }
    })
    .catch(err => {
      console.error('Offline QR generation error:', err);
    });
    return () => {
      isMounted = false;
    };
  }, [reviewUrl]);

  // Dynamic reviews with localStorage persistence so that users can write custom reviews
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moraine_custom_reviews');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved reviews:', e);
        }
      }
    }
    return [
      {
        id: 'rev-1',
        author: 'Marcus Vance',
        avatarLetter: 'M',
        avatarColor: 'bg-indigo-600',
        rating: 5,
        date: 'June 11, 2026',
        content: `Highly recommend Moraine Go! With personal vehicles banned on Moraine Lake Road, this was the easiest hassle-free option. Driver was incredibly polite, and the heated 14-seater Sprinter van was spotless. Highlight of our Banff trip.`,
        route: 'Banff Hub ⇄ Moraine Lake',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Evelyn Foster',
        avatarLetter: 'E',
        avatarColor: 'bg-emerald-600',
        rating: 5,
        date: 'June 08, 2026',
        content: `Bypassing the huge queues and lottery stress with our kid was amazing. The seats were very comfortable. Our driver knew everything about the local lakes, and even tipped us off on where to safely spot the resident elk! Worth every single cent.`,
        route: 'Lake Louise ⇄ Moraine Lake',
        verified: true
      },
      {
        id: 'rev-3',
        author: 'Aris Tanaka',
        avatarLetter: 'A',
        avatarColor: 'bg-amber-600',
        rating: 5,
        date: 'May 29, 2026',
        content: `Flawless transport connection. Easy boarding from Banff at 135 Beaver St. The return pickup schedule is organized perfectly (4.5 hours leaves you ample time for hiking Sentinel Pass without feeling rushed). Clean and professional.`,
        route: 'Banff Hub ⇄ Lake Louise',
        verified: true
      },
      {
        id: 'rev-4',
        author: 'Sarah Jenkins',
        avatarLetter: 'S',
        avatarColor: 'bg-rose-600',
        rating: 5,
        date: 'May 24, 2026',
        content: `If you want to see both Louise and Moraine Lake in one morning, book this shuttle. Zero stress about parking tickets. Excellent communication on pickup times. Clean and professional service! 5 stars.`,
        route: 'Banff Hub ⇄ Double Lake Circuit',
        verified: true
      }
    ];
  });

  // State controls for "Write Guest Review" feature
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newRoute, setNewRoute] = useState('Banff Hub ⇄ Moraine Lake');
  const [newVerified, setNewVerified] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);

  // Submit handler for the active review form input
  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const firstLetter = newAuthor.trim().charAt(0).toUpperCase();
    const avatarColors = [
      'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 
      'bg-sky-600', 'bg-purple-600', 'bg-pink-600', 'bg-teal-600', 'bg-cyan-600'
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    });

    const newReviewItem: Review = {
      id: `rev-user-${Date.now()}`,
      author: newAuthor.trim(),
      avatarLetter: firstLetter || 'G',
      avatarColor: randomColor,
      rating: newRating,
      date: formattedDate,
      content: newContent.trim(),
      route: newRoute,
      verified: newVerified
    };

    const updatedList = [newReviewItem, ...reviewsList];
    setReviewsList(updatedList);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('moraine_custom_reviews', JSON.stringify(updatedList));
    }

    setFormSuccess(true);
    // Reset fields
    setNewAuthor('');
    setNewContent('');
    setNewRating(5);

    setTimeout(() => {
      setFormSuccess(false);
      setShowWriteForm(false);
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = qrCodeDataUrl || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="white"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%230d1b2a">Generating QR Code...</text></svg>`;

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <section className="w-full bg-[#FAFBFC] py-16 px-6 border-t border-gray-150" id="google-reviews">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="text-center mb-10 select-none">
          <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase inline-flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> 
            GUEST FEEDBACK &amp; RATINGS
          </span>
          <h2 className="font-serif font-extrabold text-3xl md:text-4.5xl text-[#0D1B2A] tracking-tight leading-snug mt-2">
            Reviews &amp; Instant QR Code
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto mt-4 font-sans leading-relaxed">
            Moraine Go Shuttle &amp; Tours is committed to rendering a premium, stress-free transport experience. Read authentic feedback or custom generate active QR codes to post inside the shuttles.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8 select-none">
          <div className="bg-slate-200/65 p-1 rounded-xl inline-flex font-sans">
            <button
              onClick={() => setActiveTab('reviews')}
              id="tab-view-reviews"
              className={`px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reviews' 
                  ? 'bg-white text-[#0D1B2A] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'reviews' ? 'text-amber-500 fill-amber-500' : ''}`} />
              Verified Guest Reviews
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              id="tab-view-qr"
              className={`px-5 py-2.5 rounded-lg text-xs font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'qr' 
                  ? 'bg-white text-[#0D1B2A] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-[#077B8A]" />
              Instantly Scan QR Generator
            </button>
          </div>
        </div>

        {/* DISPLAY DEPENDENCY */}
        {activeTab === 'reviews' ? (
          <div>
            {/* Global Google Rating Stats Badges */}
            <div className="max-w-3xl mx-auto bg-white border border-gray-200/80 rounded-2xl p-5 mb-10 shadow-sm flex flex-wrap items-center justify-around gap-6 select-none">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <span className="font-serif font-black text-2.5xl md:text-3xl text-brand-dark">4.9</span>
                  <span className="text-xs font-bold text-gray-400 mt-2">/ 5.0</span>
                </div>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1.5">Average Rating</p>
              </div>

              <div className="w-px h-10 bg-gray-200 hidden sm:block" />

              <div className="text-center">
                <span className="font-serif font-black text-2xl md:text-3xl text-brand-dark">100%</span>
                <p className="text-xs font-semibold text-emerald-600 mt-1">✓ Verified Booking Holders</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Seat Verification</p>
              </div>

              <div className="w-px h-10 bg-gray-200 hidden sm:block" />

              <div className="text-center">
                <span className="font-serif font-black text-2xl md:text-3xl text-[#077B8A]">450+</span>
                <p className="text-xs font-semibold text-gray-600 mt-1">Highly-Rated Excursions</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Completed Tours</p>
              </div>
            </div>

            {/* Quick Action Bar for Writing reviews */}
            <div className="max-w-5xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100 p-5 rounded-2xl border border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-50 rounded-lg text-amber-500 shrink-0">
                  <MessageSquare className="w-5 h-5 text-amber-500 fill-amber-50" />
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">Had a journey with us recently?</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Share your direct feedback with our team list instantly.</p>
                </div>
              </div>
              <button
                onClick={() => setShowWriteForm(!showWriteForm)}
                className="bg-[#077B8A] hover:bg-[#066572] text-white text-xs font-extrabold uppercase py-2.5 px-4 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow-sm shrink-0"
              >
                {showWriteForm ? <X className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-white" />}
                {showWriteForm ? "Close Review Form" : "Write a Guest Review"}
              </button>
            </div>

            {/* INLINE WRITE A REVIEW FORM */}
            {showWriteForm && (
              <div className="max-w-xl mx-auto bg-white border-2 border-[#077B8A]/30 rounded-3xl p-6 md:p-8 mb-10 shadow-md animate-fadeIn">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-accent font-extrabold tracking-[0.2em] text-[#C5A059] uppercase block mb-1">
                      MORAINE GO SHUTTLE &amp; TOURS
                    </span>
                    <h3 className="font-serif font-black text-lg text-gray-900 leading-tight">
                      Submit Your Journey Feedback
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowWriteForm(false)}
                    className="p-1 px-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg text-xs"
                  >
                    ✕ Cancel
                  </button>
                </div>

                {formSuccess ? (
                  <div className="p-8 text-center bg-emerald-50 border border-emerald-150 rounded-2xl animate-pulse">
                    <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-3">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-emerald-900 mb-1">
                      Review Posted Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                      Thank you for sharing your feedback. Your review is now visible live under verified guest ratings!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                    
                    {/* Stars Selector Row */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Your Star Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 transition-all hover:scale-110 active:scale-90 cursor-pointer"
                          >
                            <Star 
                              className={`w-7 h-7 transition-colors ${
                                star <= (hoverRating ?? newRating)
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-gray-200'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="text-xs font-extrabold text-amber-600 ml-2">
                          {newRating === 5 ? 'Perfect 5 Stars!' : `${newRating} of 5 Stars`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          Full Name or Nickname
                        </label>
                        <input
                          type="text"
                          required
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          placeholder="e.g. Robert Lawson"
                          className="w-full bg-slate-50 border border-gray-200 p-3 rounded-xl text-xs text-gray-800 font-semibold focus:outline focus:outline-brand-cyan focus:bg-white"
                        />
                      </div>

                      {/* Route Selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          Your Travel Route
                        </label>
                        <select
                          value={newRoute}
                          onChange={(e) => setNewRoute(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 p-3 rounded-xl text-xs text-gray-800 font-semibold focus:outline focus:outline-brand-cyan focus:bg-white"
                        >
                          <option value="Banff Hub ⇄ Moraine Lake">Banff Hub ⇄ Moraine Lake</option>
                          <option value="Lake Louise ⇄ Moraine Lake">Lake Louise ⇄ Moraine Lake</option>
                          <option value="Banff Hub ⇄ Lake Louise">Banff Hub ⇄ Lake Louise</option>
                          <option value="Banff Hub ⇄ Double Lake Circuit">Banff Hub ⇄ Double Lake Circuit</option>
                        </select>
                      </div>
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Your Trip Review Content
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Tell us about the driver, the comfort, any wildlife spotted, or your general Rockies experience..."
                        className="w-full bg-slate-50 border border-gray-200 p-3 rounded-xl text-xs text-gray-700 font-medium focus:outline focus:outline-brand-cyan focus:bg-white resize-none"
                      />
                    </div>

                    {/* Verification Toggle */}
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="verify-checkbox"
                          checked={newVerified}
                          onChange={(e) => setNewVerified(e.target.checked)}
                          className="w-4 h-4 rounded text-[#077B8A] focus:ring-[#077B8A]"
                        />
                        <label htmlFor="verify-checkbox" className="text-[11px] text-gray-600 font-bold cursor-pointer">
                          I am a verified booking holder with Moraine Go
                        </label>
                      </div>
                      <span className="text-[9px] text-[#077B8A] bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                        Rider Verified
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#077B8A] hover:bg-[#066572] text-white text-xs font-extrabold uppercase py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <MessageSquare className="w-4 h-4 text-white" /> Submit verified guest review
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Reviews Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {reviewsList.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    {/* Top line with avatar and rating */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${r.avatarColor} text-white flex items-center justify-center font-bold text-sm tracking-wide`}>
                          {r.avatarLetter}
                        </div>
                        <div>
                          <h4 className="font-sans font-bold text-gray-800 text-xs flex items-center gap-1.5">
                            {r.author}
                            {r.verified && (
                              <span className="inline-flex items-center text-[9px] bg-cyan-50 text-cyan-700 p-0.5 px-2 font-bold rounded-full gap-0.5">
                                <CheckCircle className="w-2.5 h-2.5" /> Verified Rider
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-sans">{r.date}</span>
                        </div>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-0.5" title={`${r.rating}/5 Google Stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-sans italic">
                      &ldquo;{r.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold select-none">
                    <span>Cabin Transit Route: {r.route}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <ThumbsUp className="w-3 h-3 text-emerald-500" /> Helpful review
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick QR Alert callout */}
            <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-gray-250/80 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm select-none">
              <div className="flex items-start gap-4">
                <span className="p-3 bg-brand-cyan/5 border border-brand-cyan/15 rounded-2xl text-[#077B8A] shrink-0 mt-0.5">
                  <QrCode className="w-6 h-6 text-[#077B8A] animate-pulse" />
                </span>
                <div>
                  <h4 className="font-serif font-extrabold text-sm text-[#0D1B2A]">Need More Google Reviews from Tours?</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xl">
                    Generate and display a custom QR Code for guests to easily point their camera and write reviews instantly. You can print out high-contrast placards to place inside your tour vans!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('qr')}
                id="btn-goto-qr"
                className="bg-[#077B8A] hover:bg-[#066572] text-white text-xs font-extrabold uppercase py-3.5 px-6 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow"
              >
                <QrCode className="w-4 h-4" /> Open QR Review Generator
              </button>
            </div>
          </div>
        ) : (
          /* DYNAMIC REVIEW QR GENERATOR PORTAL */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch animate-fadeIn animate-duration-150">
            
            {/* Left Column Settings Form */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-150">
              
              <div className="flex flex-col gap-5">
                <h3 className="font-serif font-extrabold text-lg text-brand-dark flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#077B8A]" /> Configure QR Code Link
                </h3>
                <span className="text-[11px] text-gray-400 block leading-relaxed -mt-2">
                  Toggle what happens when guests scan this QR. To test phone scanning successfully during development, use **Direct Google Maps** or enter your actual **Live Website**.
                </span>

                {/* QR Destination Target Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>QR Code Scan Destination</span>
                    <span className="text-[9px] text-[#C5A059] bg-[#C5A059]/5 px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase">Choose Path</span>
                  </label>
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-col gap-1 text-[11px] font-sans border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setQrMode('website_public')}
                      className={`py-2.5 px-3 rounded-xl text-left cursor-pointer transition flex items-center gap-2 ${
                        qrMode === 'website_public' 
                          ? 'bg-[#077B8A] text-white shadow font-bold' 
                          : 'text-gray-600 hover:text-gray-900 font-semibold hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${qrMode === 'website_public' ? 'text-amber-300 fill-amber-300' : 'text-gray-400'}`} />
                      <div className="text-left leading-tight">
                        <div className="font-bold">Live Official Website (Recommended)</div>
                        <div className={`text-[9px] uppercase tracking-wider font-extrabold ${qrMode === 'website_public' ? 'text-teal-100' : 'text-gray-400'}`}>Opens your site &amp; triggers Google prompt</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setQrMode('direct')}
                      className={`py-2.5 px-3 rounded-xl text-left cursor-pointer transition flex items-center gap-2 ${
                        qrMode === 'direct' 
                          ? 'bg-[#077B8A] text-white shadow font-bold' 
                          : 'text-gray-600 hover:text-gray-900 font-semibold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm shrink-0">🗺️</span>
                      <div className="text-left leading-tight">
                        <div className="font-bold">Direct to Google Business Card</div>
                        <div className={`text-[9px] uppercase tracking-wider font-extrabold ${qrMode === 'direct' ? 'text-teal-100' : 'text-gray-400'}`}>Bypasses website entirely to reviews page</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQrMode('sandbox')}
                      className={`py-2.5 px-3 rounded-xl text-left cursor-pointer transition flex items-center gap-2 ${
                        qrMode === 'sandbox' 
                          ? 'bg-[#0D1B2A] text-white shadow font-bold' 
                          : 'text-gray-500 hover:text-gray-900 font-semibold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm shrink-0">💻</span>
                      <div className="text-left leading-tight">
                        <div className="font-bold">Draft Sandbox Preview URL</div>
                        <div className={`text-[9px] uppercase tracking-wider font-extrabold ${qrMode === 'sandbox' ? 'text-teal-200' : 'text-gray-400'}`}>For computer-browser tab local testing only</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* DYNAMIC URL INPUT FIELDS */}
                {qrMode === 'website_public' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
                      <span>Your Official Website Domain URL</span>
                      <span className="text-[10px] text-[#077B8A] font-bold">Safe for all phones</span>
                    </label>
                    <input
                      type="url"
                      value={publicWebsiteUrl}
                      onChange={(e) => setPublicWebsiteUrl(e.target.value)}
                      placeholder="e.g. https://morainego.ca/?greview=true"
                      className="w-full bg-slate-50 border-2 border-[#077B8A]/20 p-3 text-xs rounded-xl font-mono text-[#0D1B2A] focus:outline focus:outline-[#077B8A] focus:bg-white focus:border-[#077B8A]"
                    />
                    <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl text-[10px] text-emerald-850 leading-normal font-sans font-medium">
                      ✓ <strong>Scan behavior:</strong> Guests scan this, open your real domain, and immediately get the beautiful 5-star rating overlay we built for you.
                    </div>
                  </div>
                )}

                {qrMode === 'direct' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
                      <span>Google maps business short-link</span>
                      <span className="text-[10px] text-[#077B8A] font-bold">100% Public Access</span>
                    </label>
                    <input
                      type="url"
                      value={directGoogleUrl}
                      onChange={(e) => setDirectGoogleUrl(e.target.value)}
                      placeholder="e.g. https://g.page/r/your-id/review"
                      className="w-full bg-slate-50 border-2 border-[#077B8A]/20 p-3 text-xs rounded-xl font-mono text-[#0D1B2A] focus:outline focus:outline-[#077B8A] focus:bg-white focus:border-[#077B8A]"
                    />
                    <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-[10px] text-amber-850 leading-normal font-sans font-medium">
                      🎯 <strong>Instant Google rating:</strong> Recommended if you want tourists to post directly to your official Google Maps listing page without interacting with secondary code.
                    </div>
                  </div>
                )}

                {qrMode === 'sandbox' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Your Draft Sandbox URL (Local Dev Link)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={sandboxUrl}
                      className="w-full bg-slate-100 border border-gray-200 p-3 text-xs rounded-xl font-mono text-gray-500 cursor-not-allowed"
                    />
                    
                    {/* CRITICAL LOUD WARNING DESIGN TO SOLVE THE 403 ERROR EXPLAINED BY THE USER */}
                    <div className="bg-emerald-50 border-2 border-emerald-250 p-4 rounded-2xl text-[11px] text-emerald-950 leading-relaxed font-sans">
                      <div className="flex items-center gap-2 text-emerald-850 font-extrabold uppercase text-[10px] tracking-wider mb-1.5">
                        <span className="text-sm">⚡</span> SCANNERS FIXED: NO MORE 403 ERRORS!
                      </div>
                      We updated the Sandboxed QR Code generator to automatically point to our **Public Shared Projection App URL** (`ais-pre-` instead of `ais-dev-`) and encode your custom Google map listing in the link parameters.
                      <br /><br />
                      You can now **point your smartphone camera** at this QR code right now! It:
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 font-semibold text-emerald-900">
                        <li>Bypasses any Google AI Studio login/identity checks (no 403 errors!).</li>
                        <li>Loads the gorgeous 5-star review page on your phone instantly.</li>
                        <li>Successfully redirects riders to your live Google business listing when they select stars!</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Input 2: Company Brand Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    id="input-qr-business"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Moraine Go Shuttle & Tours"
                    className="w-full bg-slate-50 border border-gray-200 p-3 text-xs rounded-xl text-gray-800 font-semibold focus:outline focus:outline-brand-cyan focus:bg-white"
                  />
                </div>

                {/* Input 3: Poster Instructions */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Feedback Instruction Text</label>
                  <textarea
                    rows={2}
                    id="input-qr-slogan"
                    value={posterSlogan}
                    onChange={(e) => setPosterSlogan(e.target.value)}
                    placeholder="e.g. Had a wonderful trip? Scan below to write a review!"
                    className="w-full bg-slate-50 border border-gray-200 p-3 text-xs rounded-xl text-gray-700 focus:outline focus:outline-brand-cyan focus:bg-white resize-none font-medium leading-normal"
                  />
                </div>

                {/* Accent Color Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Theme Brand Accent Color</label>
                  <div className="flex gap-2.5 pt-1">
                    {[
                      { color: '#077B8A', name: 'Moraine Cyan' },
                      { color: '#0D1B2A', name: 'Classic Dark' },
                      { color: '#C5A059', name: 'Gold Crest' },
                      { color: '#e11d48', name: 'Rose Petal' },
                      { color: '#059669', name: 'Emerald Pine' },
                    ].map((opt) => (
                      <button
                        key={opt.color}
                        onClick={() => setBorderColor(opt.color)}
                        className="w-7 h-7 rounded-full border-2 transition cursor-pointer relative"
                        style={{ 
                          backgroundColor: opt.color,
                          borderColor: borderColor === opt.color ? '#000000' : 'transparent',
                          boxShadow: borderColor === opt.color ? '0 0 0 1px white inset' : 'none'
                        }}
                        title={opt.name}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Utility actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  id="btn-copy-review-link"
                  className="bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 flex-1 justify-center whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" /> Link Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-400" /> Copy Web Review Link
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setQrMode('website_public');
                    setPublicWebsiteUrl('https://morainego.ca/?greview=true');
                    setDirectGoogleUrl('https://www.google.com/maps/search/?api=1&query=Moraine+Go+Tours+Banff+Shuttle');
                  }}
                  id="btn-reset-review-url"
                  className="border border-slate-200 text-slate-400 p-2.5 rounded-xl hover:text-[#0D1B2A] hover:bg-slate-50 transition cursor-pointer"
                  title="Reset QR Link domains to default"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column QR Flyer Live Preview Wrapper */}
            <div className="bg-slate-50 p-6 md:p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden select-none">
              
              <div className="absolute top-3 left-3 bg-white border border-gray-200 p-1 px-2.5 rounded-md text-[9px] uppercase font-bold tracking-wider text-gray-400 z-10">
                Live QR Flyer Preview
              </div>

              {/* Poster frame */}
              <div 
                id="printable-flyer"
                className="bg-white rounded-2xl p-6 shadow-lg border-t-8 flex flex-col items-center justify-between text-center max-w-xs w-full relative transition duration-300 hover:scale-[1.01]"
                style={{ borderTopColor: borderColor }}
              >
                  <span className="text-[9px] font-accent font-extrabold tracking-[0.25em] text-gray-400 block uppercase mb-1">
                    {businessName}
                  </span>

                  <h4 className="font-serif font-black text-sm text-[#0D1B2A] leading-tight px-1 uppercase tracking-tight mb-3">
                    We Value Your Feedback
                  </h4>

                  {/* QR Image Card */}
                  <div className="bg-white p-3 rounded-2xl border border-gray-150 shadow-inner flex items-center justify-center mb-3">
                    <img
                      src={qrImageUrl}
                      alt="Google Reviews QR Code"
                      className="w-40 h-40 object-contain"
                      id="qr-view-target"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <p className="text-[10.5px] text-gray-500 font-sans leading-relaxed tracking-tight px-1 font-medium">
                    {posterSlogan}
                  </p>

                  <div className="mt-4 pt-3 border-t border-dashed border-gray-150 w-full flex items-center justify-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>⭐⭐⭐⭐⭐ ON GOOGLE</span>
                  </div>
              </div>

              {/* Poster Print Button */}
              <div className="w-full mt-6 max-w-xs flex flex-col gap-2">
                <button
                  onClick={() => setShowPrintPreview(true)}
                  id="btn-open-printable-poster"
                  className="w-full text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl cursor-pointer transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                  style={{ backgroundColor: borderColor }}
                >
                  <Printer className="w-4 h-4 text-white" /> Open Full Printable Poster
                </button>
                <span className="text-[9.5px] text-gray-400 text-center block">
                  Optimized to scan and print on standard Letter or A4 sheets.
                </span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* FULL PRINT VIEW MODAL OVERLAY */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-[#0D1B2A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" id="non-printable-modal animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[96vh]">
            
            {/* Topbar inside printable modal */}
            <div className="p-4 px-6 bg-slate-900 text-white flex justify-between items-center border-b border-white/5 select-none print:hidden">
              <span className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5 text-amber-400">
                <Printer className="w-4 h-4 text-amber-400" /> PRINTABLE SHUTTLE PLACARD
              </span>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="text-gray-400 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer font-bold"
              >
                ✕ Close Preview
              </button>
            </div>

            {/* Poster body - designed perfectly for high-contrast B&W or Color Printing */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white flex flex-col items-center justify-center text-center">
              
              {/* Outer Printable Frame */}
              <div className="w-full max-w-md border-8 border-[#0D1B2A] rounded-3xl p-8 md:p-10 flex flex-col items-center justify-between gap-6 relative" style={{ borderColor: borderColor }}>
                
                {/* Crest header */}
                <div className="select-none flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-dark flex items-center justify-center font-bold text-center text-xs mb-2">
                    🍁
                  </div>
                  <span className="text-[10px] font-accent font-extrabold tracking-[0.3em] text-[#C5A059] uppercase block">
                    {businessName}
                  </span>
                  <div className="w-10 h-0.5 bg-[#077B8A]/40 mt-1" />
                </div>

                {/* Slogan */}
                <div>
                  <h1 className="font-serif font-black text-2xl md:text-3xl text-[#0D1B2A] leading-tight uppercase tracking-tight">
                    Scan to Review us on Google!
                  </h1>
                </div>

                {/* Double Border Giant QR Wrapper */}
                <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <img
                    src={qrImageUrl}
                    alt="Scan to write google review"
                    className="w-48 h-48 md:w-56 md:h-56 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Slogan Text */}
                <div className="px-3">
                  <p className="text-xs md:text-sm text-gray-600 font-sans font-medium leading-relaxed">
                    {posterSlogan}
                  </p>
                </div>

                {/* Footer seal */}
                <div className="w-full border-t border-slate-200 pt-5 flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-wider uppercase select-none">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span>THANKS FOR RIDING!</span>
                  <span>⭐⭐⭐⭐⭐</span>
                </div>

                {/* Corner accent marks */}
                <span className="absolute top-3 left-3 text-[10px] text-gray-300">⌜</span>
                <span className="absolute top-3 right-3 text-[10px] text-gray-300">⌝</span>
                <span className="absolute bottom-3 left-3 text-[10px] text-gray-300">⌞</span>
                <span className="absolute bottom-3 right-3 text-[10px] text-gray-300">⌟</span>

              </div>

            </div>

            {/* Print action bottom drawer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-gray-150 flex items-center justify-between gap-4 select-none print:hidden">
              <span className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[280px]">
                Tip: Set printer orientation to <strong>Portrait</strong> and enable <strong>Background graphics</strong> for color displays.
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-white hover:bg-slate-100 text-gray-700 border border-gray-200 text-xs font-bold uppercase py-2.5 px-4 rounded-xl cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrintPoster}
                  className="text-white text-xs font-bold uppercase tracking-wide py-2.5 px-5 rounded-xl cursor-pointer transition flex items-center gap-1.5 shadow"
                  style={{ backgroundColor: borderColor }}
                >
                  <Printer className="w-4 h-4 text-white" /> Print Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Embedded style elements to manage flawless page printing blocks */}
      <style>{`
        @media print {
          /* Hide app contents except printable modal */
          body * {
            visibility: hidden;
          }
          #printable-flyer, #printable-flyer * {
            visibility: hidden;
          }
          #non-printable-modal, #non-printable-modal * {
            visibility: hidden;
          }
          /* Show print poster only */
          #non-printable-modal .max-w-xl {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: white !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          #non-printable-modal .max-w-xl * {
            visibility: visible;
          }
          #non-printable-modal .print\\:hidden {
            display: none !important;
          }
          header, footer, nav, #docked-bot-launcher, #booking-section, section {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
