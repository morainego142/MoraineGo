import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, RefreshCw, Mail, Key, Shield, AlertCircle, 
  Trash2, Printer, Search, Calendar, Users, ListFilter, Play, Volume2, VolumeX, CheckCircle, Bell, Clock, Globe
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingRecord {
  id: string;
  routeId: string;
  source: string;
  destination: string;
  tripType: string;
  passengers: number;
  travelDate: string;
  timeSlot: string;
  passengerName: string;
  email: string;
  phone: string;
  pickupAddress?: string;
  postalCode?: string;
  totalPrice: number;
  bookingCode: string;
  bookedAt: string;
}

interface ConfigStatus {
  smtpActive: boolean;
  stripeActive: boolean;
  adminEmail: string;
  host: string;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [configs, setConfigs] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<string>('');
  
  // Sounds & Real-time Auto-refresh
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const bookingsRef = useRef<BookingRecord[]>([]);

  // Periodically poll for incoming bookings to trigger real-time notification alerts
  useEffect(() => {
    bookingsRef.current = bookings;
  }, [bookings]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    
    // Initial fetch
    fetchAdminData();

    let intervalId: any = null;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchAdminData(true);
      }, 7000); // Check for new reservations every 7 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, isAuthenticated, autoRefresh]);

  // Audio synthesizer algorithm - sounds beautiful, needs no external assets
  const triggerAudioChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      const now = ctx.currentTime;
      // Arpeggio chime!
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.82);
      
      osc.start(now);
      osc.stop(now + 0.82);
    } catch (e) {
      console.warn("Audio synthesizer block:", e);
    }
  };

  const fetchAdminData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) throw new Error('Could not synchronize database.');
      
      const data = await response.json();
      if (data.success) {
        // Detect if there is a NEW premium booking added since the last pull
        const prevList = bookingsRef.current;
        if (prevList.length > 0 && data.bookings.length > prevList.length) {
          // Play notification cue sound!
          triggerAudioChime();
        }
        setBookings(data.bookings || []);
        setConfigs(data.configs || null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus("Could not synchronize with bookings database.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Humble passcode for access protection
    if (passcode.toLowerCase() === 'admin123' || passcode.toLowerCase() === 'moraine') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect merchant credentials. Hint: use passcode "moraine" or "admin123"');
    }
  };

  const handlePurge = async () => {
    if (!window.confirm("Are you sure you want to completely clear the simulation bookings database? This cannot be undone.")) return;
    try {
      const response = await fetch('/api/admin/purge', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setBookings([]);
      }
    } catch (e) {
      alert("Purge operation could not clear records.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filters
  const filteredBookings = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    return b.passengerName.toLowerCase().includes(q) ||
           b.bookingCode.toLowerCase().includes(q) ||
           b.email.toLowerCase().includes(q) ||
           b.travelDate.toLowerCase().includes(q) ||
           b.timeSlot.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* TOP BAR */}
        <div className="bg-[#0D1B2A] text-white p-5 px-6 flex justify-between items-center border-b border-white/10 select-none">
          <div className="flex items-center gap-2.5">
            <span className="p-1 px-2.5 bg-brand-cyan/20 rounded-md text-brand-cyan text-[10px] font-mono tracking-widest font-extrabold flex items-center gap-1 leading-none uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE MERCHANT PORTAL
            </span>
            <h2 className="text-sm font-bold tracking-tight">Moraine Go Bus Terminal</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition font-bold"
          >
            ✕ Close Desk
          </button>
        </div>

        {/* AUTHENTICATION LOCK SCREEN */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-sm mx-auto text-center flex flex-col gap-5 py-16">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyan-50/50 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0D1B2A]">Operator Credentials required</h3>
              <p className="text-xs text-gray-500 mt-1">Provide your merchant passcode to access the live reservations terminal and active email relays.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
              <input 
                type="password" 
                placeholder="Passcode (e.g., moraine)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 p-3 rounded-xl text-center text-sm font-mono placeholder:font-sans focus:outline focus:outline-brand-cyan text-[#0D1B2A]"
                autoFocus
                required
              />
              
              {authError && (
                <span className="text-[11px] text-red-600 font-semibold">{authError}</span>
              )}

              <button 
                type="submit"
                className="w-full bg-brand-cyan hover:bg-[#066572] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md"
              >
                Authenticate Terminal
              </button>
            </form>
          </div>
        ) : (
          /* LIVE ACTIVE TERMINAL DASHBOARD */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6" id="printable-admin-page">
            
            {/* STYLED LIVE STATUS STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
              
              <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/20 border border-gray-150 p-4 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Gateway System</span>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-2xl font-black text-[#0D1B2A]">{bookings.length}</span>
                  <span className="p-1 px-2.5 bg-brand-gold/10 text-brand-gold font-extrabold text-[9px] rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-brand-gold" /> Bookings Stored
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-tr from-slate-50 to-emerald-50/10 border border-gray-150 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Stripe Secure Cashier</span>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {configs?.stripeActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                    <span className="font-bold text-[#0D1B2A] text-xs">
                      {configs?.stripeActive ? 'Live Cashier Active' : 'Sandbox (Simulator)'}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-gray-400 block mt-1 leading-relaxed">
                  {configs?.stripeActive ? 'Accepting credit card transactions.' : 'Using local sandbox secure logic.'}
                </span>
              </div>

              <div className="bg-gradient-to-tr from-slate-50 to-cyan-50/10 border border-gray-150 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">SMTP Email Dispatcher</span>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {configs?.smtpActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    )}
                    <span className="font-bold text-[#0D1B2A] text-xs">
                      {configs?.smtpActive ? 'Live Emails Dispatched' : 'Email Logger Active'}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-gray-400 block mt-1 leading-relaxed truncate">
                  {configs?.smtpActive ? `Server connection: ${configs?.host}` : 'Simulated email terminal active.'}
                </span>
              </div>

              <div className="bg-gradient-to-tr from-slate-50 to-cyan-50/10 border border-gray-150 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Alert Mail Destination</span>
                  <div className="flex items-center gap-1.5 mt-2.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-brand-cyan" />
                    <span className="font-mono text-[10.5px] font-bold text-gray-700 truncate block">
                      {configs?.adminEmail || 'morainego142@gmail.com'}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-gray-400 block mt-1 leading-relaxed">
                  Destination mailbox for inbound sales alerts.
                </span>
              </div>

            </div>

            {/* CONTROL PANEL UTILITY BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 select-none bg-slate-50 border border-gray-200 p-4 rounded-2xl">
              
              {/* Dynamic Sound + Real-time options */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 px-3 rounded-lg border flex items-center gap-1.5 cursor-pointer transition ${soundEnabled ? 'bg-brand-cyan/15 border-brand-cyan/20 text-brand-cyan' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Sound Chime: On
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" stroke-opacity="0.6" />
                      Sound Chime: Off
                    </>
                  )}
                </button>

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 px-3 rounded-lg border flex items-center gap-1.5 cursor-pointer transition ${autoRefresh ? 'bg-emerald-50 border-emerald-100 text-[#095A2B]' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? '7s Auto Polling Active' : 'Polling Paused'}
                </button>

                <button
                  onClick={triggerAudioChime}
                  className="bg-white hover:bg-slate-100 p-2 px-3 border border-gray-200 rounded-lg flex items-center gap-1.5 text-gray-600 cursor-pointer active:scale-95 transition"
                  title="Test-synthesize the C5-C6 sound chip"
                >
                  <Play className="w-3 h-3" /> Test Chime
                </button>
              </div>

              {/* Hard Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center">
                <div className="relative flex-1 md:w-64 max-w-md">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    placeholder="Search name, code, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-200 pl-9 pr-3 py-2 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline focus:outline-brand-cyan"
                  />
                </div>

                <button 
                  onClick={handlePrint}
                  className="bg-white hover:bg-slate-100 text-gray-700 border border-gray-200 py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Manifest
                </button>

                <button 
                  onClick={handlePurge}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-100 py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  title="Clear bookings database back to zero"
                >
                  <Trash2 className="w-4 h-4" /> Delete Logs
                </button>
              </div>

            </div>

            {/* ROSTER / BOOKINGS DATA GRID */}
            <div className="flex-1 min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 py-20 text-gray-400 gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-cyan" />
                  <span className="text-xs font-semibold">Synchronizing roster terminal...</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-2xl p-10 text-center flex flex-col gap-3 items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-gray-300">
                    <ListFilter className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-[#0D1B2A] font-bold text-xs select-none">No Reservation Records Found</h4>
                    <p className="text-[11px] text-gray-400 max-w-[280px] mt-0.5 mx-auto">
                      {searchTerm ? 'No results matched your precise query.' : 'Reservations will automatically populate right here once a traveler completes booking.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                  <table className="w-full text-left border-collapse theology-table text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[#0D1B2A] font-bold border-b border-gray-150 select-none">
                        <th className="p-4 px-5">Booking Code</th>
                        <th className="p-4">Travel Date & Time</th>
                        <th className="p-4">Lead Passenger Details</th>
                        <th className="p-4">Travel Connection Route</th>
                        <th className="p-4 text-center">Seats</th>
                        <th className="p-4 text-right">Fare Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition duration-150">
                          
                          <td className="p-4 px-5 font-mono font-black text-[#0D1B2A] flex flex-col gap-0.5">
                            <span className="text-brand-cyan tracking-wider">{b.bookingCode}</span>
                            <span className="text-[8px] text-gray-400 font-sans font-medium">ID: {b.id.substring(0, 16)}</span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-bold text-[#0D1B2A]">{b.travelDate}</span>
                                <span className="text-[10px] text-gray-400 mt-0.5 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-300" /> {b.timeSlot}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-[#0D1B2A]">{b.passengerName}</span>
                              <span className="text-[10px] text-gray-500 font-mono select-all truncate max-w-[180px]">{b.email}</span>
                              {b.phone && (
                                <span className="text-[9px] text-gray-400 block font-sans">{b.phone}</span>
                              )}
                              {b.pickupAddress && (
                                <div className="mt-1">
                                  <span className="text-[9.5px] text-[#077B8A] bg-[#077B8A]/5 p-0.5 px-1 rounded border border-[#077B8A]/10 inline-block font-semibold">
                                    📍 {b.pickupAddress} ({b.postalCode || 'T1L 1A1'})
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-gray-700">{b.source} ⇄ {b.destination}</span>
                              <span className="text-[9px] text-brand-cyan uppercase font-extrabold tracking-wider">{b.tripType}</span>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <span className="p-1 px-2.5 bg-cyan-50/70 border border-cyan-100 text-brand-cyan font-bold rounded-lg text-xs leading-none inline-flex items-center justify-center gap-1">
                              <Users className="w-3 h-3 text-cyan-400" /> {b.passengers}
                            </span>
                          </td>

                          <td className="p-4 text-right font-bold text-brand-blue text-sm pr-6">
                            ${b.totalPrice} CAD
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CONFIGURATION GUIDE INFO PANEL */}
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 text-[11px] text-[#0A3D1E] leading-relaxed flex items-start gap-3 select-none">
              <span className="p-1 bg-emerald-55 bg-emerald-100/60 rounded text-emerald-700 font-extrabold text-xs">ℹ</span>
              <div className="flex flex-col gap-1">
                <strong className="font-bold text-emerald-905">Live Email Relay Guide:</strong>
                <p>
                  To receive automated real-time alerts in your personal inbox (`morainego142@gmail.com`) when clients buy, declare SMTP coordinates (e.g. SMTP_USER, SMTP_PASS, SMTP_HOST) in your environment variables. Or, utilize this live terminal dashboard with active arpeggio sound alerts!
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
