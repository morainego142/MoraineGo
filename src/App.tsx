import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingWidget from './components/BookingWidget';
import DestinationsList from './components/DestinationsList';
import ConciergeBot from './components/ConciergeBot';
import Footer from './components/Footer';
import WildlifeGallery from './components/WildlifeGallery';
import AdminPanel from './components/AdminPanel';
import ReviewsConsole from './components/ReviewsConsole';
import ReviewGateway from './components/ReviewGateway';
import { ShieldCheck, Snowflake, Star, HelpCircle, Compass, Sparkles, MessageSquare, BookOpen, Clock, Calendar, CheckSquare, Shield, ArrowRight } from 'lucide-react';
import { WHY_CHOOSE_US, DISCOVER_BANFF_TOURS_COPIES } from './data';
import shuttleImg from './assets/images/shuttle_van_1781302534888.jpg';
import logoImg from './assets/images/moraine_go_logo_1781297349753.jpg';
import { Booking } from './types';

export default function App() {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  
  // Real-time URL handler for scanned QR code review gates
  const [showReviewGateway, setShowReviewGateway] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (
        params.has('greview') || 
        params.has('review') || 
        params.has('reviews') || 
        params.has('reviwes') || 
        params.has('qr_scan') ||
        window.location.hash === '#write-review' ||
        window.location.hash === '#greview'
      );
    }
    return false;
  });

  const handleBookingSuccess = (booking: Booking) => {
    setLastBooking(booking);
  };

  const handleBookClick = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConciergeToggle = () => {
    setIsConciergeOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-brand-cyan selection:text-white mb-0 overflow-x-hidden">
      {/* 1. Header Navigation */}
      <Header 
        onBookClick={handleBookClick} 
        onConciergeClick={handleConciergeToggle} 
      />

      {/* 2. Hero cinematic section */}
      <Hero 
        onBookClick={handleBookClick} 
        onConciergeClick={handleConciergeToggle} 
      />

      {/* 3. Real-time Reservation Widget Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-10 md:-mt-20 mb-16" id="booking-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel instructions (Occupies 5 columns on desktop) */}
          <div className="lg:col-span-5 bg-[#0D1B2A] text-white p-7 md:p-9 rounded-2xl shadow-xl border border-white/5 flex flex-col gap-5 self-stretch justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5 -mr-10 -mt-10 select-none">
              <Compass className="w-64 h-64 text-white" />
            </div>

            <div className="z-10 flex flex-col gap-4">
              <span className="text-[10px] font-accent font-extrabold tracking-[0.25em] text-brand-gold uppercase block">
                Moraine Go Shuttle Ticket Office
              </span>
              <h2 className="font-serif font-extrabold text-2xl md:text-3xl text-white leading-tight">
                Direct Transit Booking Portal
              </h2>
              <div className="w-12 h-1 bg-brand-cyan rounded-full mt-1" />
              
              <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2">
                Moraine Lake’s access road is <strong>entirely closed to personal passenger vehicles</strong>. To view these crystal turquoise waters and the Valley of the Ten Peaks, pre-booked commercial shuttles are mandatory.
              </p>

              <div className="flex flex-col gap-3.5 mt-4">
                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded-lg bg-white/5 text-brand-cyan flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Guaranteed Entry Slots</h4>
                    <p className="text-[11px] text-gray-400">Skip the Parks Canada lottery; secure fixed times to hikeSentinel Pass and Larch Valley.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded-lg bg-white/5 text-brand-cyan flex-shrink-0 mt-0.5">
                    <Snowflake className="w-4 h-4 text-cyan-300" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Fully Heated &amp; Air-Conditioned</h4>
                    <p className="text-[11px] text-gray-400">Ride comfortably in luxury Mercedes vans with experienced mountain terrain drivers.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="p-1.5 rounded-lg bg-white/5 text-brand-cyan flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">No Fine Print or Extra Fees</h4>
                    <p className="text-[11px] text-gray-400">All prices include local terminal entry tax. Kids under 5 travel free (safely harnessed).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Seat reservations operate under legal Canadian transport certifications.</span>
            </div>
          </div>

          {/* Right panel interactive BookingWidget (Occupies 7 columns on desktop) */}
          <div className="lg:col-span-7">
            <BookingWidget onBookingSuccess={handleBookingSuccess} />
          </div>

        </div>
      </section>

      {/* 4. "Our Services" Grid Section */}
      <section className="w-full bg-slate-50 py-16 px-6" id="services">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-14">
            <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase">
              PROFESSIONAL ROCKIES LOGISTICS
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-4.5xl text-[#0D1B2A] mt-2 tracking-tight">
              Our Shuttle Services
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-3.5 rounded-full" />
            <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto mt-4 font-sans leading-relaxed">
              We operate highly organized routes with multiple departure points to keep your wilderness itinerary safe, structured and exceptionally comfortable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Service 1 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#077B8A]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-[#077B8A] animate-pulse" />
                </div>
                <h3 className="font-serif font-extrabold text-base text-brand-blue tracking-wide">
                  Round-Trip Explorer Shuttle
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mt-3">
                  Our core premium connection. Secure departure from Banff and flexible same-day return timings to explore Lake Louise and Moraine Lake completely stress-free.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-400">Tickets From</span>
                <span className="font-black text-brand-blue font-accent">$105 CAD</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-serif font-extrabold text-base text-brand-blue tracking-wide">
                  Evening Wildlife Tour
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mt-3">
                  Expert-led 3-hour evening safari in Banff area. Departs at 6:30 PM from Banff with telephoto spotting scopes to safely observe bears, elk, deer and bighorn sheep.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-400">Evening Pass</span>
                <span className="font-black text-brand-blue font-accent">$85 CAD</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-brand-cyan" />
                </div>
                <h3 className="font-serif font-extrabold text-base text-brand-blue tracking-wide">
                  Private Charters &amp; Groups
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mt-3">
                  Excursions for corporate retreats, photography clubs, larger family gatherings, or specialized hiking squads. Contact our desk for tailored charter rates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-400">Enquire for Rates</span>
                <span className="font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-accent">Best Value</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Custom Brand Identity & Crest Showcase Section */}
      <section className="w-full bg-[#fdfaf5] py-20 px-6 border-y border-slate-200/50" id="brand-identity">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-14">
            <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase">
              OUR CUSTOM CRAFTED EMBLEM
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-5xl text-[#0d1b2a] tracking-tight leading-snug mt-2">
              The Moraine Go Crest &amp; Wildlife Identity
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Our signature logo encapsulates our complete journey connecting Banff, Lake Louise, and Moraine Lake alongside the majestic fauna of the Canadian Rockies. Follow the key details below or click to zoom.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Massive Logo Display */}
            <div className="flex-shrink-0 group/massive relative">
              <div className="absolute inset-0 bg-cyan-400/10 rounded-full filter blur-3xl group-hover/massive:bg-cyan-400/20 transition-all duration-300" />
              <div 
                className="relative rounded-full overflow-hidden border-4 border-white bg-white p-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500 cursor-zoom-in"
                onClick={() => {
                  const logoTrigger = document.querySelector('button[title="Click to zoom logo details"]') as HTMLButtonElement;
                  if (logoTrigger) logoTrigger.click();
                }}
              >
                <img
                  src={logoImg}
                  alt="Moraine Go Official Brand Crest"
                  className="w-72 h-72 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center mt-5">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 border border-cyan-150 rounded-full py-1.5 px-4 shadow-sm inline-flex items-center gap-2">
                  <span>🔍</span> Click Logo Anywhere to Zoom Detail View
                </span>
              </div>
            </div>

            {/* Wildlife & Route details breakdown */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🏔️</span>
                  <h3 className="font-sans font-black text-xs text-[#0D1B2A] tracking-wider uppercase">
                    Banff • Louise • Moraine Route
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  The central graphic line mirrors our premium transit map, connecting three premier vistas in Banff National Park.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🦌</span>
                  <h3 className="font-sans font-black text-xs text-[#0D1B2A] tracking-wider uppercase">
                    The Majestic Bull Elk
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  Standing proudly on the left peak, signifying the grace and wild resilience of Banff National Park’s mountain meadows.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🐻</span>
                  <h3 className="font-sans font-black text-xs text-[#0D1B2A] tracking-wider uppercase">
                    The Grizzly Bear
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  Representing raw natural strength and the ancient wilderness of the Canadian Rockies wildlife preserve.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🐺</span>
                  <h3 className="font-sans font-black text-xs text-[#0D1B2A] tracking-wider uppercase">
                    The Sentinel Gray Wolf
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  Steadfast and focused in the foreground, outlining loyalty, security, and guidance throughout your Rockies excursion.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🐏</span>
                  <h3 className="font-sans font-black text-[#0D1B2A] text-xs tracking-wider uppercase font-sans">
                    The Rocky Bighorn Sheep
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  Perched on the east peak, characterizing agility, sure-footedness, and perfect high-altitude navigation.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100/80 hover:shadow-md transition">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-2xl">🦅</span>
                  <h3 className="font-sans font-black text-[#0D1B2A] text-xs tracking-wider uppercase font-sans">
                    The Soaring Eagle
                  </h3>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-sans">
                  Sailing across the mountain peaks, symbolizing freedom, deep exploration, and panoramic vistas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-slate-100 shadow-lg border border-[#F5E6CC] bg-gradient-to-br from-amber-50/20 to-white hover:shadow-xl transition sm:col-span-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-[240px]">
                    <span className="text-2xl mt-0.5">🍁</span>
                    <div>
                      <h4 className="font-sans font-black text-xs text-[#0a1e33] tracking-widest uppercase">
                        Slogan: &ldquo;Your Journey, Our Nature&rdquo;
                      </h4>
                      <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                        Our ultimate commitment. To handle your travel logistics cleanly and sustainably, while celebrating the pristine environment of Banff, Lake Louise, and Moraine Lake.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleBookClick} 
                    className="w-full sm:w-auto flex-shrink-0 bg-[#0b3e68] hover:bg-[#12b3eb] text-white text-[11px] font-extrabold uppercase py-3.5 px-6 rounded-lg shadow-md transition"
                  >
                    Check Shuttle Seats
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Wildlife Sighting Gallery & Guest Upload Board */}
      <WildlifeGallery />

      {/* 5. "About / Replicating Discover Banff Tours Copy layout" */}
      <section className="w-full bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Photograph representation */}
          <div className="lg:w-1/2 relative h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img
              src={shuttleImg}
              alt="Comfortable Moraine Go Shuttle Driving through Banff"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark/80 p-5 text-white">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">Premium 14-Seater Cabin</span>
              <p className="text-xs text-gray-200 mt-1 font-sans">Travel comfortable in our spacious 14-passenger shuttles, stay safe, and skip the logistics struggles with our local guide drivers.</p>
            </div>
          </div>

          {/* Text replication of Discover Banff Tours layout and copies */}
          <div className="lg:w-1/2 flex flex-col gap-5">
            <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase">
              ABOUT OUR TRAVEL HOUSE
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-4.5xl text-[#0D1B2A] tracking-tight leading-snug">
              {DISCOVER_BANFF_TOURS_COPIES.aboutHeadline}
            </h2>
            <div className="w-12 h-1 bg-[#C5A059] rounded-full" />
            
            <p className="text-sm text-gray-600 leading-relaxed font-sans font-medium">
              {DISCOVER_BANFF_TOURS_COPIES.aboutParagraph}
            </p>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Avoiding crowded park-and-rides and parking queues is vital when planning a vacation. With pre-reserved boardings, you bypass road blockages completely, as our vehicle fleet of clean, air-conditioned 14-seater Mercedes Sprinter vans holds exclusive commercial access certificates granted by Parks Canada. Enjoy secure transit perfectly suited for photography teams, families, high-altitude hikers, and casual explorers.
            </p>

            <div className="flex gap-4 items-center mt-4">
              <button
                onClick={handleBookClick}
                className="bg-[#077B8A] hover:bg-[#066572] text-white font-bold text-xs py-3 px-6 rounded-lg shadow cursor-pointer transition uppercase tracking-wider"
              >
                Secure seats now
              </button>
              <a 
                href="#contact" 
                className="text-xs font-bold text-brand-blue hover:text-brand-cyan transition flex items-center gap-1"
              >
                <span>Call reservation desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Popular Destinations Section (Moraine, Louise, Banff national park) */}
      <DestinationsList />

      {/* 7. Why Choose Us Section */}
      <section className="w-full bg-white py-16 px-6" id="why-us">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-14">
            <span className="text-xs font-accent font-extrabold tracking-[0.25em] text-[#077B8A] uppercase">
              RELIABLE &amp; TRUSTED SINCE DAY ONE
            </span>
            <h2 className="font-serif font-extrabold text-3xl md:text-4.5xl text-brand-blue mt-2.5">
              Why Choose Moraine Go?
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-3.5 p-5 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-gray-150"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-cyan/5 text-brand-cyan flex items-center justify-center font-extrabold text-sm border border-brand-cyan/10">
                  0{idx + 1}
                </div>
                <h4 className="font-serif font-extrabold text-sm text-[15px] text-brand-blue">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick trust metrics */}
          <div className="mt-16 bg-slate-50 rounded-2xl p-6 md:p-8 border border-gray-150 flex flex-col md:flex-row justify-between items-center gap-6 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h5 className="font-serif font-bold text-base text-brand-blue">Need help designing your Rockies hiking schedule?</h5>
              <p className="text-xs text-gray-500 mt-1">Our AI Travel guide and Phone support is ready to build your day plan.</p>
            </div>
            <div className="flex gap-4 flex-shrink-0 w-full md:w-auto">
              <button
                onClick={handleConciergeToggle}
                className="flex-1 bg-[#0D1B2A] hover:bg-slate-800 text-white font-bold text-xs py-3 px-5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition uppercase tracking-wider"
              >
                <MessageSquare className="w-4 h-4 text-brand-gold animate-pulse" />
                Ask AI Assistant
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Google Reviews & Instant Van QR Code Generator */}
      <ReviewsConsole />

      {/* Dynamic Scanned QR Review Landing Modal */}
      {showReviewGateway && (
        <ReviewGateway onClose={() => setShowReviewGateway(false)} />
      )}

      {/* 8. Sticky / Docked Bot chat element */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleConciergeToggle}
          id="docked-bot-launcher"
          className="bg-[#077B8A] hover:bg-[#066572] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
          style={{ boxShadow: '0 8px 30px rgba(7, 123, 138, 0.4)' }}
          aria-label="Open Rockies guide"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute right-full mr-3 bg-brand-dark text-white text-[11px] py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition shadow-lg shrink-0 whitespace-nowrap font-bold border border-white/5 uppercase tracking-wider hidden sm:block">
            🏔️ Rockies AI Concierge Open
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>

      {/* Chat dialog bot screen */}
      <ConciergeBot 
        isOpen={isConciergeOpen} 
        onClose={handleConciergeToggle} 
      />

      {/* Operator Dashboard Notification Panel */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {/* 9. Footer directory */}
      <Footer onAdminOpen={() => setIsAdminOpen(true)} />
    </div>
  );
}
