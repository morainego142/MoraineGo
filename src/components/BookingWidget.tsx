import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight, CheckCircle, Ticket, Route, MessageSquare, Printer, RefreshCw, Sparkles } from 'lucide-react';
import { SHUTTLE_ROUTES } from '../data';
import { Booking } from '../types';

interface BookingWidgetProps {
  onBookingSuccess: (booking: Booking) => void;
}

const getAutomaticReturnTime = (departureTime: string): string => {
  if (departureTime === '07:00 AM') return '11:30 AM';
  if (departureTime === '08:00 AM') return '12:30 PM';
  if (departureTime === '09:00 AM') return '01:30 PM';
  if (departureTime === '01:00 PM') return '05:30 PM';
  if (departureTime === '02:00 PM') return '06:30 PM';
  if (departureTime === '06:30 PM') return '09:30 PM';
  return 'Flexible Returns';
};

export default function BookingWidget({ onBookingSuccess }: BookingWidgetProps) {
  // Booking states
  const [step, setStep] = useState(1);
  const [selectedRouteId, setSelectedRouteId] = useState(SHUTTLE_ROUTES[0].id);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(travelDate);
  const [timeSlot, setTimeSlot] = useState('');
  const [returnTimeSlot, setReturnTimeSlot] = useState('');
  const [passengers, setPassengers] = useState(2);
  
  // Passenger info
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Confirmed booking state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Pick default times when route changes
  const selectedRoute = SHUTTLE_ROUTES.find(r => r.id === selectedRouteId) || SHUTTLE_ROUTES[0];

  useEffect(() => {
    setReturnDate(travelDate);
  }, [travelDate]);

  useEffect(() => {
    setReturnTimeSlot(getAutomaticReturnTime(timeSlot));
  }, [timeSlot]);

  useEffect(() => {
    if (selectedRoute) {
      if (selectedRoute.schedule.length > 0) {
        setTimeSlot(selectedRoute.schedule[0]);
      }
    }
  }, [selectedRouteId]);

  // Load existing booking from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moraine_go_active_booking');
      if (saved) {
        setActiveBooking(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not parse saved booking", e);
    }
  }, []);

  // Price calculations
  const basePrice = tripType === 'one-way' ? selectedRoute.oneWayPrice : selectedRoute.roundTripPrice;
  const totalPrice = basePrice * passengers;

  // Handle step 1 progression
  const handleProceedToDetails = () => {
    if (!travelDate) {
      setValidationError("Please select a departure date.");
      return;
    }
    setValidationError("");
    setStep(2);
  };

  // Handle step completion
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      if (!passengerName.trim() || !email.trim() || !phone.trim()) {
        setValidationError("Please fill in all contact details to secure your ticket.");
        return;
      }
      
      setValidationError("");
      const code = `MG-${Math.floor(1000 + Math.random() * 9000)}-2026`;
      const newBooking: Booking = {
        id: Math.random().toString(),
        routeId: selectedRoute.id,
        source: selectedRoute.source,
        destination: selectedRoute.destination,
        tripType,
        date: travelDate,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        timeSlot,
        returnTimeSlot: tripType === 'round-trip' ? returnTimeSlot : undefined,
        passengers,
        passengerName,
        email,
        phone,
        totalPrice,
        bookingCode: code,
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('moraine_go_active_booking', JSON.stringify(newBooking));
      } catch (err) {
        console.warn("Storage writing failed:", err);
      }
      setActiveBooking(newBooking);
      onBookingSuccess(newBooking);
      setStep(3);
    }
  };

  const handleClearBooking = () => {
    localStorage.removeItem('moraine_go_active_booking');
    setActiveBooking(null);
    setStep(1);
    setPassengerName('');
    setEmail('');
    setPhone('');
  };

  // Render tickets boarding pass
  if (activeBooking || step === 3) {
    const bookingToShow = activeBooking || (step === 3 ? {
      id: 'preview',
      routeId: selectedRouteId,
      source: selectedRoute.source,
      destination: selectedRoute.destination,
      tripType,
      date: travelDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      timeSlot,
      returnTimeSlot: tripType === 'round-trip' ? returnTimeSlot : undefined,
      passengers,
      passengerName,
      email,
      phone,
      totalPrice,
      bookingCode: 'MG-PREV-2026',
      createdAt: new Date().toISOString()
    } as Booking : null);

    return (
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" id="booking-widget-root">
        {/* Banner */}
        <div className="bg-brand-cyan px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 animate-pulse" />
            <h3 className="font-serif font-bold text-lg">Active Shuttle Reservation</h3>
          </div>
          <button 
            onClick={handleClearBooking}
            className="text-xs bg-black/20 hover:bg-black/35 text-white py-1 px-3 rounded-full cursor-pointer transition flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            New Shuttle Search
          </button>
        </div>

        {/* Boarding Pass Frame */}
        <div className="p-6 bg-slate-50">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border-2 border-dashed border-gray-200 overflow-hidden relative">
            {/* Left & Right Notch cuts simulating vintage tickets */}
            <div className="absolute top-[35%] -left-3 w-6 h-6 rounded-full bg-slate-50 border-r border-gray-200 z-10" />
            <div className="absolute top-[35%] -right-3 w-6 h-6 rounded-full bg-slate-50 border-l border-gray-200 z-10" />

            {/* Top Pass brand */}
            <div className="bg-[#0D1B2A] text-white px-5 py-4 flex justify-between items-center">
              <div className="flex gap-1.5 items-center">
                <span className="font-serif text-sm font-bold tracking-widest text-brand-gold">MORAINE</span>
                <span className="text-[10px] bg-brand-gold text-brand-dark px-1.5 font-bold rounded">GO</span>
              </div>
              <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-mono font-bold">BOARDING PASS</span>
            </div>

            {/* Main Details */}
            <div className="p-5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[10px] font-accent uppercase tracking-wider text-gray-400">Departing From</p>
                  <p className="font-extrabold text-brand-blue text-lg">{bookingToShow?.source}</p>
                  <p className="text-xs text-gray-500">Banff Terminal Hub</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full font-bold uppercase mb-1">
                    4.5-Hr Explorer
                  </span>
                  <div className="w-24 h-0.5 bg-gray-200 relative flex justify-center items-center">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan absolute" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-accent uppercase tracking-wider text-gray-400">Destination</p>
                  <p className="font-extrabold text-brand-blue text-base truncate max-w-[150px]" title={bookingToShow?.destination}>
                    {bookingToShow?.destination}
                  </p>
                  <p className="text-xs text-gray-500">Rockies Glacier Hub</p>
                </div>
              </div>

              {/* Passenger and Reference segment */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Lead Passenger</p>
                  <p className="font-bold text-gray-800">{bookingToShow?.passengerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Booking Code</p>
                  <p className="font-mono font-bold text-brand-cyan tracking-wider">{bookingToShow?.bookingCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Date &amp; Selected Time</p>
                  <p className="font-bold text-gray-800">{bookingToShow?.date} at <strong className="text-brand-blue font-semibold">{bookingToShow?.timeSlot}</strong></p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Passengers Count</p>
                  <p className="font-bold text-gray-800">{bookingToShow?.passengers} adult seats</p>
                </div>

                {bookingToShow?.tripType === 'round-trip' && (
                  <div className="col-span-2 bg-[#077B8A]/5 p-2 rounded border border-[#077B8A]/10 mt-1">
                    <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider">
                      {bookingToShow?.routeId === 'banff-wildlife-tour' ? 'Scheduled 3-Hour Wildlife Safari' : 'Scheduled 4.5-Hour Itinerary'}
                    </p>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      🏔️ Departure: <strong>{bookingToShow?.date}</strong> at <strong>{bookingToShow?.timeSlot}</strong><br />
                      🔄 Return Pickup: <strong>{bookingToShow?.returnDate}</strong> at <strong>{bookingToShow?.returnTimeSlot}</strong> ({bookingToShow?.routeId === 'banff-wildlife-tour' ? '3 hours duration' : '4.5 hours later'})
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom bar with barcode simulation and ticket details */}
              <div className="pt-4 flex justify-between items-center">
                {/* CSS simulated barcode */}
                <div className="flex flex-col gap-1.5 opacity-85 select-none w-2/3">
                  <div className="flex gap-0.5 h-8">
                    {[1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1].map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-black rounded-sm h-full"
                        style={{ width: `${val * 1.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-gray-400 tracking-widest text-center md:text-left">
                    TICKET REF # {bookingToShow?.id?.substring(0, 8) || 'PREVIEW'}
                  </span>
                </div>

                {/* Pricing summary */}
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase">Paid &amp; Final Price</p>
                  <p className="text-lg font-extrabold text-[#0D1B2A]">${bookingToShow?.totalPrice} CAD</p>
                  <p className="text-[8px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase inline-block">SECURED ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Info Alert Box */}
        <div className="p-6 bg-white border-t border-gray-100 text-xs text-gray-600 flex flex-col gap-3">
          <p className="font-bold text-brand-dark flex items-center gap-1.5 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Pick-up Instructions &amp; Safe Boarding
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 text-gray-600">
            <li><strong>Banff Hub Location</strong>: Banff Park &amp; Ride (Trans-Canada Hwy) or Fairmont Banff Springs.</li>
            <li><strong>Be Punctual</strong>: Arrive exactly <strong>10 minutes</strong> before your selected time slot ({bookingToShow?.timeSlot}).</li>
            <li><strong>Gear Allowed</strong>: Unlimited rucksacks, photography tripods, hiking sticks and fold-down pram strollers.</li>
            <li><strong>Contact Help</strong>: Call <strong>437-868-2108</strong> if you need to coordinate or re-schedule.</li>
          </ul>
          <button 
            onClick={() => window.print()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Shuttle Boarding Pass
          </button>
        </div>
      </div>
    );
  }

  // Render original step-by-step form
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" id="booking-widget-root">
      {/* Banner */}
      <div className="bg-[#0A3254] px-6 py-5 text-white flex justify-between items-center">
        <div>
          <h3 className="font-serif font-bold text-lg tracking-wider flex items-center gap-2">
            <Route className="w-5 h-5 text-brand-gold text-glow" />
            Reserve Your Shuttle
          </h3>
          <p className="text-[11px] text-gray-300 mt-0.5 font-sans">Guaranteed access bypasses Moraine Lake road blockages.</p>
        </div>
        <div className="bg-brand-gold/15 border border-brand-gold/20 text-brand-gold px-2.5 py-1 text-[10px] rounded font-bold uppercase tracking-wider animate-pulse">
          98% Booked up Today
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex border-b border-gray-100 text-xs font-semibold select-none bg-slate-50/50">
        <div className={`flex-1 py-3 text-center border-r border-gray-150 ${step === 1 ? 'bg-white text-brand-cyan border-b-2 border-b-brand-cyan' : 'text-gray-400'}`}>
          1. Select Route &amp; Times
        </div>
        <div className={`flex-1 py-3 text-center ${step === 2 ? 'bg-white text-brand-cyan border-b-2 border-b-brand-cyan' : 'text-gray-400'}`}>
          2. Traveler Details
        </div>
      </div>

      <form onSubmit={handleNextStep} className="p-6 flex flex-col gap-5">
        {step === 1 ? (
          <>
            {/* ROUTE SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] uppercase tracking-wider mb-2">Choose Connection</label>
              <div className="flex flex-col gap-2">
                {SHUTTLE_ROUTES.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-3 rounded-lg border cursor-pointer hover:border-brand-cyan transition relative flex items-center justify-between ${selectedRouteId === route.id ? 'bg-brand-cyan/5 border-brand-cyan ring-1 ring-brand-cyan' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="font-bold text-gray-800 text-sm flex items-center gap-1">
                        {route.source}
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                        {route.destination}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 pr-14">{route.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 pl-2">
                      <p className="text-xs text-gray-400">Seats From</p>
                      <p className="font-extrabold text-brand-blue text-sm">
                        ${route.roundTripPrice} CAD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DATES & TIMES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                  Departure Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 p-2 text-xs rounded-lg text-gray-800 focus:outline-brand-cyan cursor-pointer font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  Departure Time
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 p-2 text-xs rounded-lg text-gray-800 focus:outline-brand-cyan font-semibold cursor-pointer"
                >
                  {selectedRoute.schedule.map(t => (
                    <option key={t} value={t}>{t} (Seats Available)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* AUTOMATIC ITINERARY BRIEF */}
            <div className="bg-[#077B8A]/5 border border-[#077B8A]/15 rounded-xl p-4 text-xs text-[#0D1B2A] -mt-1 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                <span className="font-extrabold uppercase tracking-widest text-[10px] text-brand-cyan">
                  {selectedRouteId === 'banff-wildlife-tour' ? '3-Hour Evening Wildlife Safari Plan' : '4.5-Hour Double Lake Explorer Itinerary'}
                </span>
                <span className="ml-auto text-[8px] bg-brand-gold/20 text-[#0D1B2A] px-2 py-0.5 rounded font-black uppercase">Guided Tour</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                {selectedRouteId === 'banff-wildlife-tour'
                  ? 'Your ticket covers the dusk wildlife-spotting safari departing Banff. Learn expert narrative guides and check active feeding patterns.'
                  : 'Your ticket covers the complete round-trip journey to both lakes with guaranteed return. You will enjoy a dedicated 4.5-hour mountain excursion:'}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-gray-100">
                <div className="border-r border-gray-100 pr-2">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Departure Shuttle</span>
                  <span className="font-bold text-brand-blue text-sm block mt-0.5">{timeSlot}</span>
                  <span className="text-[9px] text-gray-500 block">
                    {selectedRouteId === 'banff-wildlife-tour' ? 'Banff Hotel Pick-up' : 'Town of Banff Hub'}
                  </span>
                </div>
                <div className="pl-1">
                  <span className="text-[10px] text-brand-cyan block uppercase font-bold tracking-wider">
                    {selectedRouteId === 'banff-wildlife-tour' ? 'Scheduled Return Drop-off' : 'Scheduled Return Pickup'}
                  </span>
                  <span className="font-bold text-emerald-700 text-sm block mt-0.5">{returnTimeSlot}</span>
                  <span className="text-[9px] text-gray-500 block">
                    {selectedRouteId === 'banff-wildlife-tour' ? 'Banff Hotel Drop-off' : 'Moraine Lake Shoreline'}
                  </span>
                </div>
              </div>
            </div>

            {/* PASSENGER COUNTER */}
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-gray-150">
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4 text-brand-cyan" />
                <div>
                  <p className="text-xs font-bold">Number of Passengers</p>
                  <p className="text-[10px] text-gray-400">Children under 5 ride free (Max 14 seats)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-slate-200 text-gray-700 font-bold transition focus:outline-none cursor-pointer"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-brand-blue w-4 text-center">{passengers}</span>
                <button
                  type="button"
                  onClick={() => setPassengers(Math.min(14, passengers + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-slate-200 text-gray-700 font-bold transition focus:outline-none cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* PRICING & CALL-TO-ACTION */}
            <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 font-bold">Estimated Cost</p>
                <p className="text-2xl font-black text-brand-blue">${totalPrice} CAD</p>
                <p className="text-[10px] text-gray-500">Includes all park taxes &amp; fees</p>
              </div>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="bg-brand-cyan hover:bg-[#066572] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transform transition active:scale-95 cursor-pointer uppercase shadow"
              >
                Proceed to Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* STEP 2: PASSENGER DETAILS FORM */}
            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs border border-gray-200 text-gray-700">
              <div>
                <strong className="text-brand-blue">Selected Connection:</strong>
                <p className="mt-0.5">{selectedRoute.source} to {selectedRoute.destination}</p>
                <p className="text-[10px] text-gray-500">{travelDate} @ {timeSlot}</p>
              </div>
              <div className="text-right font-bold text-brand-dark">
                <p>{passengers} seats</p>
                <p className="text-sm font-black text-brand-cyan">${totalPrice} CAD</p>
              </div>
            </div>

            {validationError && (
              <div className="bg-rose-50 text-rose-800 text-xs p-3 rounded-lg border border-rose-100 font-semibold flex items-center gap-1.5 shadow-sm">
                <span className="text-rose-500">⚠</span> {validationError}
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Lead Passenger Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam MacDonald"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs rounded-lg text-gray-800 focus:outline mb-0.5 border-l-4 border-l-brand-cyan focus:outline-brand-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. passenger@rockies.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs rounded-lg text-gray-800 focus:outline mb-0.5 border-l-4 border-l-brand-cyan focus:outline-brand-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Mobile WhatsApp Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. 437-868-2108"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 p-2.5 text-xs rounded-lg text-gray-800 focus:outline mb-0.5 border-l-4 border-l-brand-cyan focus:outline-brand-cyan"
                  required
                />
                <span className="text-[9px] text-gray-400 mt-1 block">Required to deliver real-time shuttle delays or guide text updates during the tour.</span>
              </div>
            </div>

            {/* CONFIRMATION SUBMIT */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 font-bold hover:text-brand-blue cursor-pointer"
              >
                ← Edit Choices
              </button>
              <button
                type="submit"
                className="bg-brand-cyan hover:bg-[#066572] text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transform transition active:scale-95 cursor-pointer uppercase shadow-md"
              >
                Secure Ticket Booking
                <Ticket className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
