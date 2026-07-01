import React from 'react';
import { Phone, Mail, Clock, ShieldCheck, Compass, HelpCircle, Navigation2, Instagram } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onAdminOpen?: () => void;
}

export default function Footer({ onAdminOpen }: FooterProps) {
  return (
    <footer className="bg-brand-dark text-white border-t border-white/10" id="contact">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Information Column */}
        <div className="flex flex-col gap-4">
          <Logo light showText size="sm" />
          <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2">
            Moraine Go provides premium, secure, and stress-free visual shuttle services connecting Banff, Lake Louise, and Moraine Lake in the majestic Canadian Rockies. Avoid closures and secure direct lakeshore access today.
          </p>
          <div className="flex items-center gap-2 mt-2 bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
              Licensed Parks Canada Shuttle
            </span>
          </div>
        </div>

        {/* Popular Shuttles list */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-bold text-sm text-brand-gold uppercase tracking-wider">
            Popular Connections
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-sans">
            <li>
              <a href="#header-root" className="hover:text-brand-cyan transition">Banff to Lake Louise &amp; Moraine Lake</a>
            </li>
            <li>
              <a href="#header-root" className="hover:text-brand-cyan transition">Round-Trip Special Tours</a>
            </li>
            <li>
              <a href="#destinations" className="hover:text-brand-cyan transition">Ten Peaks Wilderness Route</a>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-bold text-sm text-brand-gold uppercase tracking-wider">
            Support Portal
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-sans">
            <li>
              <a href="#destinations" className="hover:text-brand-cyan transition">Ten Peaks Hiking Guide</a>
            </li>
            <li>
              <a href="#why-us" className="hover:text-brand-cyan transition">Why Choose Moraine Go</a>
            </li>
            <li>
              <a href="#google-reviews" className="hover:text-brand-cyan transition font-bold text-brand-gold flex items-center gap-1">⭐ Google Guest Reviews</a>
            </li>
            <li>
              <a href="#booking-widget-root" className="hover:text-brand-cyan transition">Manage Active Reservation</a>
            </li>
            <li>
              <span className="text-slate-400">Parks Canada Pass Guide</span>
            </li>
            {onAdminOpen && (
              <li>
                <button 
                  onClick={onAdminOpen} 
                  className="text-brand-gold hover:text-white transition font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-left outline-none"
                >
                  🔑 Operator Dispatch Desk
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Contact Information Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-bold text-sm text-brand-gold uppercase tracking-wider">
            Contact Moraine Go
          </h4>
          <div className="flex flex-col gap-3.5 text-xs text-slate-300">
            <a href="tel:437-868-2108" className="flex items-center gap-2 group">
              <span className="p-2 rounded bg-white/5 group-hover:bg-brand-cyan transition">
                <Phone className="w-4 h-4 text-brand-gold" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">24/7 Phone Desk</p>
                <p className="font-bold text-white group-hover:text-brand-cyan transition">437-868-2108</p>
              </div>
            </a>

            <a href="mailto:MoraineGo142@gmail.com" className="flex items-center gap-2 group">
              <span className="p-2 rounded bg-white/5 group-hover:bg-brand-cyan transition">
                <Mail className="w-4 h-4 text-brand-gold" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Interactive Email</p>
                <p className="font-bold text-white group-hover:text-brand-cyan transition truncate">MoraineGo142@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <span className="p-2 rounded bg-white/5">
                <Clock className="w-4 h-4 text-brand-gold" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Office Hours</p>
                <p className="font-semibold text-white">Daily: 6:00 AM – 9:00 PM</p>
              </div>
            </div>

            <a href="https://instagram.com/morainelego" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className="p-2 rounded bg-white/5 group-hover:bg-[#E1306C] transition">
                <Instagram className="w-4 h-4 text-brand-gold group-hover:text-white transition" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Instagram</p>
                <p className="font-bold text-white group-hover:text-brand-cyan transition">@morainelego</p>
              </div>
            </a>
          </div>
        </div>

      </div>

      {/* Lower Copyright section */}
      <div className="bg-slate-950 py-6 px-6 text-xs text-center text-slate-500 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <div>
          <p>© 2026 <strong>Moraine Go Tours Inc</strong>. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 mt-1">Authorized commercial operator in Banff National Park. Subject to Parks Canada vehicle allocations.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Navigation2 className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span>Banff • Lake Louise • Moraine Lake, Alberta, Canada</span>
        </div>
      </div>
    </footer>
  );
}
