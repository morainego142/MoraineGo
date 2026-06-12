import React, { useState, useRef } from 'react';
import { Camera, Video, Upload, Heart, MapPin, Calendar, CheckCircle2, AlertCircle, Sparkles, Filter, Eye, Play, Pause, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';

interface Sighting {
  id: string;
  guestName: string;
  species: 'Bear' | 'Elk' | 'Wolf' | 'Sheep' | 'Eagle' | 'Other';
  location: string;
  shuttleTime: string;
  date: string;
  mediaType: 'image' | 'video';
  mediaUrl: string; // fallback placeholder or uploaded URL
  caption: string;
  likes: number;
  hasLiked?: boolean;
  spotDate: string;
  isVerified?: boolean;
}

const INITIAL_SIGHTINGS: Sighting[] = [
  {
    id: 's1',
    guestName: 'The Sterling Family (Seattle, WA)',
    species: 'Bear',
    location: 'Bow Valley Parkway Junction',
    shuttleTime: '08:00 AM Departure Slot',
    date: 'June 10, 2026',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600',
    caption: 'An incredible young Grizzly was foraging for fresh buffaloberries right alongside the safety fence. Our shuttle driver, Marc, slowed down to let everyone secure beautiful photos safely from the cabin window. Simply unforgettable!',
    likes: 142,
    spotDate: 'Just 2 days ago',
    isVerified: true
  },
  {
    id: 's2',
    guestName: 'Carlos M. (Madrid, Spain)',
    species: 'Sheep',
    location: 'Moraine Lake rockpile base',
    shuttleTime: '01:00 PM Afternoon Corridor',
    date: 'June 11, 2026',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
    caption: 'Right as we disembarked the shuttle at Moraine Lake, three massive Rocky Mountain Bighorn Sheep were salt-licking the crag rocks perfectly in the afternoon light! Highly alert, but completely calm.',
    likes: 98,
    spotDate: 'Yesterday afternoon',
    isVerified: true
  },
  {
    id: 's3',
    guestName: 'Yuki & Kenji (Tokyo, Japan)',
    species: 'Elk',
    location: 'Banff Aspen Meadows crossing',
    shuttleTime: '07:00 AM Early Explorer',
    date: 'June 09, 2026',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=600',
    caption: 'A majestic bull elk stood perfectly silhouetted against the morning lake fog. The cool mountain air and the call of the elk was sheer cinematic perfection. Book the 7 AM departure, it is the golden window for animal presence!',
    likes: 215,
    spotDate: '3 days ago',
    isVerified: true
  },
  {
    id: 's4',
    guestName: 'Helena P. (Calgary, AB)',
    species: 'Eagle',
    location: 'Moraine GO Tours Sentinel Pass peak',
    shuttleTime: '09:00 AM Trail Pass',
    date: 'June 08, 2026',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1611756549221-50e82eff5368?auto=format&fit=crop&q=80&w=600',
    caption: 'Spotted a gorgeous Golden Eagle soaring directly above Sentinel Valley. We started hiking right after the 9 AM shuttle arrival and witnessed this bird of prey mapping the heights!',
    likes: 84,
    spotDate: '4 days ago',
    isVerified: true
  }
];

export default function WildlifeGallery() {
  const [sightings, setSightings] = useState<Sighting[]>(INITIAL_SIGHTINGS);
  const [filterSpecies, setFilterSpecies] = useState<string>('All');
  
  // Form State
  const [guestName, setGuestName] = useState('');
  const [species, setSpecies] = useState<'Bear' | 'Elk' | 'Wolf' | 'Sheep' | 'Eagle' | 'Other'>('Bear');
  const [location, setLocation] = useState('Bow Valley Highway');
  const [shuttleTime, setShuttleTime] = useState('09:00 AM Shuttle Slot');
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  // UI Flow Status
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number>(-1);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (id: string) => {
    setSightings(prev => 
      prev.map(item => {
        if (item.id === id) {
          const isLiked = !item.hasLiked;
          return {
            ...item,
            likes: isLiked ? item.likes + 1 : item.likes - 1,
            hasLiked: isLiked
          };
        }
        return item;
      })
    );
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
    
    // Auto detect media type
    if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileClickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !caption.trim()) {
      setValidationError('Please fill out your name and write a caption of what you observed.');
      return;
    }
    setValidationError('');

    // Simulate progress bar upload
    setUploadPercent(0);
    const interval = setInterval(() => {
      setUploadPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add to database
            const newSighting: Sighting = {
              id: 'custom-' + Date.now(),
              guestName: `${guestName} (Verified Guest)`,
              species,
              location,
              shuttleTime,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              mediaType,
              mediaUrl: mediaPreview || 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&q=80&w=600', // default fallback bear/deer landscape
              caption,
              likes: 1,
              hasLiked: true,
              spotDate: 'Just now',
              isVerified: true
            };

            setSightings([newSighting, ...sightings]);
            setSuccessMsg(true);
            setUploadPercent(-1);
            
            // reset form elements
            setGuestName('');
            setCaption('');
            setMediaFile(null);
            setMediaPreview('');
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const triggerScanAlertList = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const filtered = filterSpecies === 'All' 
    ? sightings 
    : sightings.filter(s => s.species.toLowerCase() === filterSpecies.toLowerCase());

  return (
    <div className="w-full bg-slate-900 text-slate-150 py-20 px-6 relative" id="wildlife-sightings">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(7,123,138,0.08),transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#12b3eb] font-bold uppercase bg-cyan-950/40 border border-cyan-900/50 py-1.5 px-4 rounded-full inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>Rockies Wildlife Sighting &amp; Media Hub</span>
          </span>
          <h2 className="font-serif font-black text-3xl md:text-5xl text-white tracking-tight mt-4 leading-tight">
            Banff Animal Sightings Guestbook
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-[#12b3eb] mx-auto mt-4 rounded-full" />
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
            Guests on our Moraine Go shuttles routinely witness world-class wildlife, including grizzly bears, bighorn sheep, and wolves. View photos and videos captured by recent travelers below, or submit your own discoveries dynamically to the booking wall!
          </p>
        </div>

        {/* Dynamic Interactive Wildlife Activity Alert Bar */}
        <div className="max-w-4xl mx-auto mb-12 bg-slate-950 border border-emerald-500/25 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-left font-sans text-xs">
              <span className="font-bold text-white block uppercase tracking-wider text-[10px]">Real-Time Corridor Activity</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Last spotted: <strong className="text-amber-400">Grizzly Mother with Cub</strong> on Moraine Lake Access Road (11 AM Shuttle Range).
              </p>
            </div>
          </div>
          
          <button 
            onClick={triggerScanAlertList}
            disabled={isScanning}
            className="w-full md:w-auto text-[10px] font-bold cursor-pointer uppercase flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-[#12b3eb] active:scale-95 transition-all text-white rounded-lg border border-slate-700 font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Syncing Radio Logs...' : 'Fetch Feed Update'}
          </button>
        </div>

        {/* MAIN BODY GRID: Form on Left, Gallery on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Guest Submission Upload Form (Occupies 5 columns) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#C5A059] text-slate-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>GUEST HUB</span>
            </div>

            <h3 className="font-sans font-extrabold text-white text-base uppercase tracking-wider mb-2">
              Share Your Wildlife Media
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mb-5 leading-relaxed">
              Did you capture an animal photograph or video during your shuttle ride today? Drag-and-drop it here to show booking guests what they can expect!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {validationError && (
                <div className="bg-rose-950/20 text-rose-300 text-xs p-3 rounded-lg border border-rose-900/45 font-semibold flex items-center gap-1.5">
                  <span>⚠️</span> {validationError}
                </div>
              )}
              
              {/* Observer Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Explorer Name / Family tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel & Sam from Denver, CO"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2.5 outline-none focus:border-cyan-500 transition font-sans placeholder-slate-600"
                />
              </div>

              {/* Form Grid rows */}
              <div className="grid grid-cols-2 gap-3">
                {/* Species dropdown */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                    Animal Observed
                  </label>
                  <select
                    value={species}
                    onChange={e => setSpecies(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2.5 outline-none focus:border-cyan-500 transition font-sans cursor-pointer text-[11px]"
                  >
                    <option value="Bear">🐻 Grizzly / Black Bear</option>
                    <option value="Elk">🦌 Majestic Bull Elk</option>
                    <option value="Wolf">🐺 Timber Wolf</option>
                    <option value="Sheep">🐏 Bighorn Sheep</option>
                    <option value="Eagle">🦅 Golden / Bald Eagle</option>
                    <option value="Other">🦫 Other Wildlife (Marmot/Moose)</option>
                  </select>
                </div>

                {/* Location Spotted */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                    Approximate Location
                  </label>
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2.5 outline-none focus:border-cyan-500 transition font-sans cursor-pointer text-[11px]"
                  >
                    <option value="Bow Valley Parkway">Bow Valley Corridor</option>
                    <option value="Moraine Lake Road">Valley Roadway</option>
                    <option value="Banff Moraine GO Tours Meadow">Banff Meadows (Moraine GO Tours)</option>
                    <option value="Lake Louise Shoreline">Louise Lake Front</option>
                    <option value="High Sentinel Pass">Sentinel Pass Ascent</option>
                  </select>
                </div>
              </div>

              {/* Shuttle Time observed */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Which Shuttle Slot / Range?
                </label>
                <select
                  value={shuttleTime}
                  onChange={e => setShuttleTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2.5 outline-none focus:border-cyan-500 transition font-sans cursor-pointer text-[11px]"
                >
                  <option value="07:00 AM Departure Slot">07:00 AM Departure (Super early)</option>
                  <option value="08:00 AM Departure Slot">08:00 AM Departure Corridor</option>
                  <option value="09:00 AM Departure Slot">09:00 AM Departure Corridor</option>
                  <option value="01:00 PM Afternoon Corridor">01:00 PM Midday Shuttle</option>
                  <option value="02:00 PM Afternoon Corridor">02:00 PM Matinee Shuttle</option>
                </select>
              </div>

              {/* Sighting Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Sighting Story / Caption
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the magical moment! Where was the animal? What did the tour group do? Keep hikers updated!"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2.5 outline-none focus:border-cyan-500 transition font-sans placeholder-slate-600 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Drag-and-drop Image/Video Uploader Zone */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Attach Photo or Video
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-6 px-4 rounded-xl border-2 border-dashed text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-[#12b3eb] bg-cyan-950/20 scale-98' 
                      : mediaPreview 
                        ? 'border-emerald-500/50 bg-slate-900/40' 
                        : 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/30'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={handleFileClickChange}
                    className="hidden"
                  />

                  {mediaPreview ? (
                    <div className="w-full">
                      {mediaType === 'video' ? (
                        <div className="relative aspect-video max-h-32 mx-auto rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                          <video 
                            src={mediaPreview} 
                            muted 
                            playsInline 
                            className="w-full h-full object-contain" 
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                            <Video className="w-8 h-8 text-emerald-400" />
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={mediaPreview} 
                          alt="Uploaded guest sighting preview" 
                          className="max-h-32 mx-auto rounded-lg object-contain"
                        />
                      )}
                      
                      <div className="mt-2 text-slate-350 font-sans text-[10px] flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate max-w-[200px]" title={mediaFile?.name}>
                          {mediaFile?.name} ({( (mediaFile?.size || 0) / (1024 * 1024) ).toFixed(2)} MB)
                        </span>
                      </div>
                      <span className="text-[9px] text-[#12b3eb] underline mt-1 block">Click to replace file</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-full mb-2">
                        <Upload className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                      </div>
                      <span className="text-[11px] font-bold text-white block">
                        Drag &amp; Drop Photo or Video
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">
                        or click to browse local files
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono mt-2 block">
                        Accepts JPG, PNG, MP4, MOV up to 150MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar or Action Button */}
              {uploadPercent >= 0 ? (
                <div className="w-full bg-slate-900 rounded-lg p-3.5 border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-sans text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 animate-pulse font-bold text-[#12b3eb]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Uploading Media Streams...
                    </span>
                    <span>{uploadPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#12b3eb] transition-all duration-100" 
                      style={{ width: `${uploadPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 px-5 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Wildlife Sighting Wall</span>
                </button>
              )}

              {/* Toast response message */}
              {successMsg && (
                <div className="bg-emerald-950/50 border border-emerald-500/35 p-3.5 rounded-xl text-emerald-400 flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block text-[11px] text-white">Sighting Posted Beautifully!</span>
                    <p className="text-[10px] text-emerald-300 mt-0.5 leading-relaxed">
                      Your Rocky National Park animal discovery has been synchronized and placed at the top of the passenger board feed. Other guests can now view your sighting!
                    </p>
                    <button 
                      onClick={() => setSuccessMsg(false)} 
                      type="button"
                      className="text-[10px] underline font-bold mt-2 hover:text-white cursor-pointer"
                    >
                      Dismiss Alert
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* RIGHT: Live Feed Wall with interactive filter (Occupies 7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Filter Pill List */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#12b3eb]" />
                <span>Filter Wildlife</span>
              </span>

              <div className="flex gap-1.5 flex-wrap">
                {['All', 'Bear', 'Elk', 'Wolf', 'Sheep', 'Eagle'].map(speciesTag => (
                  <button
                    key={speciesTag}
                    onClick={() => setFilterSpecies(speciesTag)}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg border uppercase transition cursor-pointer ${
                      (filterSpecies === speciesTag)
                        ? 'bg-slate-100 text-slate-950 border-white font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {speciesTag === 'All' && '🌲 All Species'}
                    {speciesTag === 'Bear' && '🐻 Bears'}
                    {speciesTag === 'Elk' && '🦌 Elks'}
                    {speciesTag === 'Wolf' && '🐺 Wolves'}
                    {speciesTag === 'Sheep' && '🐏 Sheep'}
                    {speciesTag === 'Eagle' && '🦅 Eagles'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sighting Feed cards container */}
            <div className="space-y-6 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-4xl text-slate-600 mb-3 block">🦌</span>
                  <h4 className="font-sans font-bold text-base text-white">No sightings in this category yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-2 font-sans px-4">
                    Be the first to record an animal in this section! Upload your travel photos using the submission panel on the left.
                  </p>
                </div>
              ) : (
                filtered.map(item => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition duration-300 flex flex-col sm:flex-row relative group"
                  >
                    {/* Media representation side */}
                    <div className="sm:w-5/12 bg-slate-900 relative aspect-video sm:aspect-auto overflow-hidden self-stretch min-h-[160px] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800">
                      {item.id.startsWith('custom-') && item.mediaType === 'video' ? (
                        // If it's a dynamic custom video submission, we render a working HTML video tag
                        <video 
                          src={item.mediaUrl} 
                          controls 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        // Otherwise render standard image element
                        <img
                          src={item.mediaUrl}
                          alt={`${item.species} spotted at ${item.location}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Species type badge */}
                      <span className="absolute top-3 left-3 bg-[#0D1B2A]/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-[#12b3eb] px-2.5 py-1 rounded-md border border-cyan-500/20 shadow">
                        {item.species === 'Bear' && '🐻 BEAR'}
                        {item.species === 'Elk' && '🦌 ELK'}
                        {item.species === 'Wolf' && '🐺 WOLF'}
                        {item.species === 'Sheep' && '🐏 SHEEP'}
                        {item.species === 'Eagle' && '🦅 EAGLE'}
                        {item.species === 'Other' && '🐾 OTHER'}
                      </span>
                    </div>

                    {/* Meta content details side */}
                    <div className="sm:w-7/12 p-5 flex flex-col justify-between">
                      <div>
                        {/* Title & Verified Indicator */}
                        <div className="flex items-start justify-between gap-2.5 mb-2.5">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">
                              Spotted By
                            </span>
                            <span className="text-xs font-black text-white hover:text-[#12b3eb] transition leading-snug">
                              {item.guestName}
                            </span>
                          </div>
                          
                          {item.isVerified && (
                            <span className="flex-shrink-0 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                              Approved Sighting
                            </span>
                          )}
                        </div>

                        {/* Story caption text */}
                        <p className="text-[12px] text-slate-350 leading-relaxed font-sans mb-4">
                          &ldquo;{item.caption}&rdquo;
                        </p>

                        {/* Location / Route Details */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-[10px] font-sans text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{item.spotDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Love Vote bar */}
                      <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">
                          Route Slot: <strong className="text-slate-350 font-sans font-semibold">{item.shuttleTime}</strong>
                        </span>

                        <button
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[10px] font-extrabold uppercase transition cursor-pointer ${
                            item.hasLiked 
                              ? 'bg-rose-950/50 text-rose-400 border border-rose-500/35' 
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? 'fill-rose-400 text-rose-400 animate-pulse' : ''}`} />
                          <span>{item.likes} Likes</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note advising safety */}
            <div className="p-4 bg-slate-950 border border-amber-500/10 rounded-xl text-[10px] leading-relaxed text-slate-400 font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#C5A059] uppercase font-bold tracking-wider block mb-0.5">National Parks Safety Notice</strong>
                All wildlife media uploaded above must be captured strictly in accordance with Parks Canada guidelines. Keep a minimum distance of 30 meters from elk/sheep and 100 meters from bears and wolves. Never try to lure, feed, or contact animals.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
