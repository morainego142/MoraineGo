import React, { useState, useEffect } from 'react';
import { Phone, Mail, Search, Heart, Menu, X, Calendar, MapPin, Shield, HelpCircle, Compass, Instagram } from 'lucide-react';
import Logo from './Logo';

const searchableItems = [
  {
    title: "Dual Lake Golden Pass Shuttle",
    category: "Shuttle Route",
    tags: ["banff", "louise", "moraine", "shuttle", "ticket", "book", "reserve", "route", "transfer", "shuttles"],
    description: "Premium double-lake service departing Banff to Lake Louise & Moraine Lake.",
    targetId: "booking-section"
  },
  {
    title: "Evening Wildlife Safari Tour (Dusk)",
    category: "Guided Tour",
    tags: ["wildlife", "safari", "evening", "dusk", "bear", "grizzly", "elk", "coyote", "banff", "tour", "book", "reserve"],
    description: "Expert-led 3-hour dusk tour departing Banff at 6:30 PM with telephoto scopes.",
    targetId: "booking-section"
  },
  {
    title: "Moraine Lake (Valley of Ten Peaks)",
    category: "Destination",
    tags: ["moraine", "lake", "ten peaks", "rockpile", "larch", "sentinel", "view", "panoramic"],
    description: "Nestled at the foot of Mount Temple with restricted commercial-only shuttle access.",
    targetId: "destinations"
  },
  {
    title: "Lake Louise Shoreline & Glacier Walk",
    category: "Destination",
    tags: ["lake louise", "glacier", "louise", "chateau", "teahouse", "agnes", "trails"],
    description: "Renowned globally with hiking highlights like Lake Agnes Teahouse Walk.",
    targetId: "destinations"
  },
  {
    title: "Moraine Lake Road Closure Policy",
    category: "Regulation",
    tags: ["road", "restricted", "closed", "regulation", "closure", "parking"],
    description: "Personal passenger vehicles are strictly banned. Pre-booked shuttles are mandatory.",
    targetId: "booking-section"
  },
  {
    title: "14-Seater Mercedes Sprinter Fleet",
    category: "Fleet Service",
    tags: ["fleet", "car", "van", "sprinter", "mercedes", "coach", "comfortable", "wifi"],
    description: "Air-conditioned 14-passenger luxury cabs with high-speed Wi-Fi & hiking gear bays.",
    targetId: "why-us"
  },
  {
    title: "Flat-rate Transparent Pricing Menu",
    category: "Pricing",
    tags: ["price", "cost", "ticket", "flat", "deals", "group", "cheap", "refund"],
    description: "Flat CA$105. No bidding wars or parking fine surprises. Free cancellations.",
    targetId: "why-us"
  },
  {
    title: "Certified Professional Tour Guides",
    category: "Tour Service",
    tags: ["driver", "guide", "host", "narrative", "local", "expert"],
    description: "Local narrative drivers sharing custom trail status, photography spots, and wildlife warnings.",
    targetId: "why-us"
  },
  {
    title: "Grizzly Bears & Wildlife Gallery",
    category: "Wildlife",
    tags: ["wildlife", "animal", "bear", "grizzly", "elk", "sheep", "eagle", "photo"],
    description: "Recent safety-compliant wildlife photos and dynamic guest sightings timeline.",
    targetId: "brand-identity"
  },
  {
    title: "AI Concierge & Mountain Guide",
    category: "AI Support",
    tags: ["ai", "concierge", "bot", "assistant", "chat", "help", "guide", "question", "weather"],
    description: "Calculate hiking gear lists, mountain weather patterns, and local park guidelines.",
    action: "concierge"
  }
];

interface HeaderProps {
  onBookClick: () => void;
  onConciergeClick: () => void;
}

export default function Header({ onBookClick, onConciergeClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { name: 'ACTIVITIES ▾', href: '#services' },
    { name: 'PRIVATE TOURS', href: '#services' },
    { name: 'PRIVATE TRANSFERS', href: '#services' },
    { name: 'DEALS', href: '#services' },
    { name: 'GALLERY', href: '#destinations' },
    { name: 'ABOUT ▾', href: '#why-us' },
    { name: 'REVIEWS', href: '#why-us' },
  ];

  const filtered = searchQuery.trim() === ""
    ? searchableItems.slice(0, 3)
    : searchableItems.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(t => t.includes(query))
        );
      });

  const handleItemClick = (item: any) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);

    if (item.action === 'concierge') {
      onConciergeClick();
    } else if (item.targetId) {
      const element = document.getElementById(item.targetId);
      if (element) {
        const yOffset = -90; // offset for sticky header
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#search-wrapper') && !target.closest('#search-wrapper-mobile')) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="w-full relative z-50 shadow-sm" id="header-root">
      {/* 1. TOP UTILITY BAR (Replicating exact premium bar from Discover Banff) */}
      <div className="w-full bg-[#0a1e33] text-white text-[11px] py-2 px-6 border-b border-white/5 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Support Contacts */}
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <a href="tel:+14378682108" className="flex items-center gap-1.5 hover:text-cyan-400 transition duration-200">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Toll Free: <strong className="text-white">+1 437-868-2108</strong></span>
            </a>
            <span className="hidden md:inline text-white/10">|</span>
            <a href="mailto:MoraineGo142@gmail.com" className="flex items-center gap-1.5 hover:text-cyan-400 transition duration-200">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>MoraineGo142@gmail.com</span>
            </a>
          </div>

          {/* Social Icons, Language, Quick links */}
          <div className="flex items-center gap-4 flex-wrap">
            <a href="https://instagram.com/moraine_go" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-300 hover:text-[#E1306C] md:hover:text-cyan-400 transition duration-200">
              <Instagram className="w-3.5 h-3.5 text-cyan-400" />
              <span>@moraine_go</span>
            </a>
            <span className="text-white/10">|</span>
            {/* Currency switcher CAD / USD */}
            <div className="flex items-center gap-1 text-gray-300">
              <span>🇨🇦</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none cursor-pointer text-[11px] font-bold"
              >
                <option value="CAD" className="bg-[#0a1e33] text-white">CA$ ▼</option>
                <option value="USD" className="bg-[#0a1e33] text-white">US$ ▼</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER (Replicating white premium header with check availability button) */}
      <div className="w-full bg-white text-[#0D1B2A] py-3 px-6 sticky top-0 transition-all shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden xl:flex items-center gap-[18px]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-bold text-[11px] text-gray-800 hover:text-brand-cyan transition duration-250 relative tracking-wide uppercase"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Search, Fav, Check Availability Actions */}
          <div className="hidden lg:flex items-center gap-[15px]">
            {/* Minimal Search Bar with glass on the left */}
            <div className="relative" id="search-wrapper">
              <div className="relative flex items-center bg-[#F1F5F9] rounded-full py-2 px-4 border border-gray-200">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tours, Private Trips..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[12px] w-36 text-gray-800 placeholder-gray-400 font-sans focus:w-44 transition-all"
                />
              </div>

              {/* Autocomplete suggestions dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white shadow-2xl rounded-xl border border-gray-150 z-50 py-2.5 overflow-hidden">
                  <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase px-4 py-1.5 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                    <span>{searchQuery ? 'Search Results' : 'Suggested Topics'}</span>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-[10px] text-red-500 hover:underline">
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="p-5 text-center text-xs text-slate-400 font-sans">
                        No matches found. Try searching for <strong className="text-slate-600">"shuttle"</strong>, <strong className="text-slate-600">"grizzly"</strong>, or <strong className="text-slate-600">"rules"</strong>.
                      </div>
                    ) : (
                      filtered.map((item, idx) => (
                        <button
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleItemClick(item);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 transition border-b last:border-b-0 border-slate-50 flex flex-col gap-0.5 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-black text-slate-800 font-serif leading-tight">{item.title}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded font-mono">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-sans leading-relaxed line-clamp-1">{item.description}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Favorites Hub - Empty heart with red 0 badge */}
            <button className="p-2 hover:bg-slate-50 rounded-full transition text-[#0a1e33] relative">
              <Heart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-[3px] right-[3px] bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>

            {/* Hamburger Menu Icon next to heart as shown in screenshot */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-slate-50 rounded-full transition text-[#0d1b2a]"
              aria-label="Navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>

            {/* Check Availability CTA with deep blue background and rounded-lg style */}
            <button
              onClick={onBookClick}
              id="cta-check-availability"
              className="bg-[#0b3e68] hover:bg-[#072d4d] text-white text-[12px] font-extrabold uppercase py-3.5 px-6 rounded-md shadow transition duration-200 tracking-wider cursor-pointer"
            >
              Check Availability
            </button>
          </div>

          {/* Mobile Hamburg Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={onBookClick}
              className="bg-brand-cyan text-white font-bold text-[10px] py-1.5 px-3 rounded-full hover:bg-opacity-90"
            >
              Check Availability
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              aria-label="Navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE & DESKTOP MENU DROPDOWN / DRAWER */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 p-6 z-45 transition-all transform flex flex-col gap-6">
          
          {/* Mobile Search Bar */}
          <div className="block lg:hidden relative" id="search-wrapper-mobile">
            <div className="relative flex items-center bg-[#F1F5F9] rounded-xl py-3 px-4 border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search tours, vehicles, sights..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder-gray-400 font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search suggestions dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-xl border border-gray-150 mt-2 z-50 max-h-[300px] overflow-y-auto p-2">
                <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase px-3 py-1.5 border-b border-gray-50 bg-slate-50/55 rounded-t-lg">
                  {searchQuery ? 'Search Results' : 'Suggested Topics'}
                </div>
                {filtered.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matches found. Try searching for "shuttle", "grizzly" or "rules".
                  </div>
                ) : (
                  filtered.map((item, idx) => (
                    <button
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleItemClick(item);
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition border-b last:border-b-0 border-slate-50 flex flex-col gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 font-serif">{item.title}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded font-mono">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans line-clamp-1">{item.description}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Navigation Links Column */}
            <div className="flex flex-col gap-2">
              <h4 className="text-gray-400 font-bold text-[10px] tracking-wider uppercase mb-1">Explore Services</h4>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 hover:bg-gray-50 rounded text-gray-800 font-semibold border-b border-gray-50 last:border-none flex items-center justify-between text-xs transition duration-200"
                >
                  <span>{link.name}</span>
                  <span className="text-gray-400">→</span>
                </a>
              ))}
            </div>

            {/* Quick Actions / Contact Column */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-gray-400 font-bold text-[10px] tracking-wider uppercase mb-2">Reservations & Support</h4>
                <div className="flex items-center gap-2.5 py-2.5 px-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                  <Phone className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span>Call Reservations: <strong className="text-gray-900 font-extrabold">+1 437-868-2108</strong></span>
                </div>
                <div className="flex items-center gap-2.5 py-2.5 px-3 bg-gray-50 rounded-lg text-xs text-gray-700 mt-2">
                  <Mail className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span className="truncate">Email: <strong className="text-gray-900 font-extrabold break-all">MoraineGo142@gmail.com</strong></span>
                </div>
                <a href="https://instagram.com/moraine_go" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 py-2.5 px-3 bg-gray-50 rounded-lg text-xs text-gray-700 mt-2 hover:bg-slate-100 transition duration-150">
                  <Instagram className="w-4 h-4 text-[#E1306C] flex-shrink-0" />
                  <span className="truncate">Instagram: <strong className="text-gray-900 font-extrabold">@moraine_go</strong></span>
                </a>
              </div>

              <div className="bg-[#f0f9ff] p-4 rounded-lg border border-sky-100">
                <span className="text-[10px] font-bold text-[#054a75] uppercase tracking-wide block">Moraine GO Tours Guarantee</span>
                <p className="text-[11px] text-[#0b5c8f] mt-1 leading-relaxed">
                  All transport features our custom fleet of dynamic modern 14-seater Mercedes Sprinters. Enjoy direct pass authorization skip-the-closures access.
                </p>
              </div>
            </div>

            {/* Booking & Concierge CTAs */}
            <div className="flex flex-col gap-3 justify-center md:col-span-2 lg:col-span-1">
              <h4 className="text-gray-400 font-bold text-[10px] tracking-wider uppercase mb-1">Instant Services</h4>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full bg-[#0b3e68] hover:bg-[#072d4d] text-white py-3 px-4 rounded-lg font-bold text-center text-xs uppercase tracking-wide transition duration-250 flex items-center justify-center gap-2 shadow"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                Book Shuttle Now
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onConciergeClick();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-bold text-center text-xs uppercase tracking-wide transition duration-250 flex items-center justify-center gap-2 shadow"
              >
                <Compass className="w-4 h-4 text-brand-gold" />
                Open AI Concierge Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
