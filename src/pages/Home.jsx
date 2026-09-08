import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Award,
  Sparkles,
  Phone,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  User,
  MapPin
} from "lucide-react";
import Hero from "../components/Hero";
import FeaturedWork from "../components/FeaturedWork";
import VideoPlayer from "../components/VideoPlayer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getServices } from "../services/servicesService";
import { getPackages } from "../services/packagesService";
import { getBrandMarketing } from "../services/brandMarketingService";
import { getReels } from "../services/reelsService";
import { studioStats } from "../services/mockData";
import { useSettings } from "../context/SettingsContext";
import useSEO from "../hooks/useSEO";
import { InstagramIcon, YoutubeIcon } from "../components/SocialIcons";

export default function Home() {
  useSEO({
    title: "Tirunelveli's Premium Photographer & Reels Creator",
    description: "Create Moments, Build Brands. All in All Azhaguraja is Tirunelveli's premium photographer and reels creator for personal branding, showroom deliveries, and business promos.",
    keywords: "Reels creator in Tirunelveli, Event videography Tirunelveli, Car delivery reels, Bike delivery reels, Photography Tirunelveli"
  });

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [brandCollaborations, setBrandCollaborations] = useState([]);
  const [reels, setReels] = useState([]);
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const reelsCarouselRef = useRef(null);
  const modalVideoRef = useRef(null);

  const settings = useSettings();

  const brandCarouselRef = useRef(null);

  useEffect(() => {
    getServices().then((data) => setServices(data.slice(0, 3))).catch(() => {});
    getPackages().then((data) => setPackages(data.slice(0, 3))).catch(() => {});
    getBrandMarketing()
      .then((data) => {
        setBrandCollaborations(data || []);
      })
      .catch(() => setBrandCollaborations([]));

    getReels()
      .then((data) => {
        const fetched = (data || []).map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          client: r.client || "",
          location: r.location || "Tirunelveli",
          coverImage: r.poster || "",
          videoFile: r.videoFile || "",
          videoUrl: r.videoFile || r.videoUrl || "",
        }));
        setReels(fetched);
      })
      .catch(() => setReels([]));

  }, []);

  const scrollBrand = (direction) => {
    if (brandCarouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      brandCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollReels = (direction) => {
    if (reelsCarouselRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      reelsCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleOpenReel = (index) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleCloseReel = () => {
    setActiveReelIndex(null);
    setIsPlaying(false);
  };

  const handleNextReel = useCallback(() => {
    if (activeReelIndex !== null && reels.length > 0) {
      setActiveReelIndex((prev) => (prev + 1) % reels.length);
      setIsPlaying(true);
      setIsMuted(true);
      setProgress(0);
    }
  }, [activeReelIndex, reels.length]);

  const handlePrevReel = useCallback(() => {
    if (activeReelIndex !== null && reels.length > 0) {
      setActiveReelIndex((prev) => (prev - 1 + reels.length) % reels.length);
      setIsPlaying(true);
      setIsMuted(true);
      setProgress(0);
    }
  }, [activeReelIndex, reels.length]);

  // Keyboard navigation for reels modal
  useEffect(() => {
    if (activeReelIndex === null) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseReel();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNextReel();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevReel();
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key.toLowerCase() === "m") {
        setIsMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeReelIndex, handleNextReel, handlePrevReel]);

  // Video play/pause effect
  useEffect(() => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        modalVideoRef.current.pause();
      }
    }
  }, [isPlaying, activeReelIndex]);

  const handleTimeUpdate = () => {
    if (modalVideoRef.current && modalVideoRef.current.duration) {
      setProgress((modalVideoRef.current.currentTime / modalVideoRef.current.duration) * 100);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (!modalVideoRef.current || !modalVideoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    modalVideoRef.current.currentTime = pos * modalVideoRef.current.duration;
  };

  const currentModalReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  return (
    <>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. GALLERY PREVIEW — Recent Captures */}
      <FeaturedWork />

      {/* 3. BRAND MARKETING COLLABORATION SHOWCASE (Swipeable Carousel) */}
      <section className="bg-ink text-paper py-24 px-6 lg:px-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <p className="eyebrow text-signal-gold mb-3 font-bold tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-signal-gold" /> BRAND PARTNERSHIPS
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">Brand Marketing Campaigns</h2>
              <p className="text-paper/60 text-xs md:text-sm mt-2 max-w-xl">
                Swipe horizontally to explore how we translate client products and showroom launches into high-converting visual reels and photos.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Scroll navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollBrand("left")}
                  aria-label="Scroll brand campaigns left"
                  className="w-10 h-10 border border-white/20 hover:border-signal-gold hover:bg-signal-gold hover:text-ink text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollBrand("right")}
                  aria-label="Scroll brand campaigns right"
                  className="w-10 h-10 border border-white/20 hover:border-signal-gold hover:bg-signal-gold hover:text-ink text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <Link to="/brand-marketing" className="eyebrow inline-flex items-center gap-2 text-signal-gold border-b border-signal-gold pb-1 hover:gap-3 transition-all font-bold text-xs tracking-wider">
                View All Campaigns <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Swipeable Brand Marketing Row */}
          <div
            ref={brandCarouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-6 px-6 lg:-mx-10 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brandCollaborations.map((collab, index) => (
              <motion.div
                key={collab.id || index}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
                className="bg-slate border border-white/5 flex flex-col justify-between hover:border-signal-gold/40 transition-all group p-6 shrink-0 snap-start w-[85vw] sm:w-[360px] md:w-[420px]"
              >
                <div>
                  <div className="mb-5 shadow-lg relative overflow-hidden aspect-video">
                    <VideoPlayer src={collab.videoUrl} poster={collab.image} title={collab.brandName} />
                  </div>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-signal-gold transition-colors">
                      {collab.brandName}
                    </h3>
                  </div>
                  <p className="text-signal-gold font-mono text-[9px] uppercase tracking-widest mb-3 font-semibold">
                    {collab.tagline}
                  </p>
                  <p className="text-paper/60 text-xs leading-relaxed mb-6 line-clamp-3">
                    {collab.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <WhatsAppButton
                    message={`Hi All in All Azhaguraja, I saw your brand campaign for "${collab.brandName}" and would like to enquiry about brand marketing reels.`}
                    variant="outline"
                    label="Enquire campaign rate"
                    className="text-[9px] py-2.5 font-bold tracking-wider w-full text-center"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swipe hint */}
          <div className="flex items-center justify-between mt-4 text-paper/50 text-xs">
            <p className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-signal-gold animate-pulse" />
              <span>Swipe or click arrows to view all {brandCollaborations.length} brand campaigns</span>
            </p>
            <span className="text-[10px] font-mono opacity-70">Watch video commercials</span>
          </div>
        </div>
      </section>

      {/* 4. SHOWREEL / SWIPEABLE REELS SECTION */}
      <section className="bg-paper py-24 px-6 lg:px-10 border-b border-slate/10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <p className="eyebrow text-studio-blue mb-3 font-bold tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-signal-gold" /> CINEMATIC SHOWCASE
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ink font-bold uppercase tracking-tight">
                Trending Vertical Reels
              </h2>
              <p className="text-slate-soft text-xs md:text-sm mt-2 max-w-xl">
                Swipe horizontally to watch our latest high-octane vehicle handovers, personal branding, and brand launch reels.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Scroll navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollReels("left")}
                  aria-label="Scroll reels left"
                  className="w-10 h-10 border border-slate/20 hover:border-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors cursor-pointer text-ink"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollReels("right")}
                  aria-label="Scroll reels right"
                  className="w-10 h-10 border border-slate/20 hover:border-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors cursor-pointer text-ink"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <Link
                to="/reels"
                className="eyebrow inline-flex items-center gap-2 text-studio-blue border-b border-studio-blue pb-1 hover:gap-3 transition-all font-bold text-xs tracking-wider"
              >
                Explore All Reels <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Swipeable Reels Row (9:16 Vertical Cards) */}
          <div
            ref={reelsCarouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-6 px-6 lg:-mx-10 lg:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reels.map((reel, index) => (
              <motion.div
                key={reel.id || index}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (index % 5) * 0.05 }}
                onClick={() => handleOpenReel(index)}
                className="relative aspect-[9/16] w-[72vw] sm:w-[260px] md:w-[280px] shrink-0 snap-start bg-slate group cursor-pointer overflow-hidden border border-slate/10 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-xs"
              >
                {reel.coverImage ? (
                  <img
                    src={reel.coverImage}
                    alt={reel.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : reel.videoFile ? (
                  <video
                    src={reel.videoFile}
                    muted
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 flex items-center justify-center">
                    <Play size={28} className="text-signal-gold/40" />
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-75 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="eyebrow bg-ink/90 backdrop-blur-sm text-signal-gold text-[7px] font-bold tracking-widest px-2.5 py-0.5 uppercase shadow-sm">
                    {reel.category}
                  </span>
                  <span className="eyebrow bg-black/60 backdrop-blur-sm text-white/85 text-[8px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={8} className="text-signal-gold" /> REEL
                  </span>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-signal-gold/90 text-ink flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-105 group-hover:bg-signal-gold transition-all duration-300">
                    <Play size={18} className="fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end text-white pointer-events-none">
                  <h4 className="font-display text-sm font-bold leading-snug line-clamp-2 drop-shadow-md">
                    {reel.title}
                  </h4>
                  {reel.client && (
                    <p className="text-[10px] text-paper/80 font-mono mt-1 flex items-center gap-1">
                      <User size={10} className="text-signal-gold" /> {reel.client}
                    </p>
                  )}
                  {reel.location && (
                    <p className="text-[9px] text-paper/60 font-mono mt-0.5 flex items-center gap-1">
                      <MapPin size={9} className="text-signal-gold" /> {reel.location}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swipe hint */}
          <div className="flex items-center justify-between mt-4 text-slate-soft text-xs">
            <p className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-signal-gold animate-pulse" />
              <span>Swipe or click arrows to view all {reels.length} vertical reels</span>
            </p>
            <span className="text-[10px] font-mono opacity-70">Click reel to play</span>
          </div>
        </div>
      </section>

      {/* 9:16 Vertical Reel Player Modal Lightbox */}
      <AnimatePresence>
        {currentModalReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseReel}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 md:p-6 cursor-zoom-out select-none"
          >
            {/* Prev / Next buttons on desktop */}
            {reels.length > 1 && (
              <div
                className="hidden md:flex flex-col gap-4 absolute right-6 lg:right-12 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handlePrevReel}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-signal-gold hover:text-ink text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all shadow-lg cursor-pointer"
                  title="Previous Reel"
                >
                  <ChevronUp size={24} />
                </button>
                <button
                  onClick={handleNextReel}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-signal-gold hover:text-ink text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all shadow-lg cursor-pointer"
                  title="Next Reel"
                >
                  <ChevronDown size={24} />
                </button>
              </div>
            )}

            {/* Reel Container 9:16 Aspect */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[420px] aspect-[9/16] max-h-[90vh] bg-black border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between cursor-default"
            >
              {/* Native Video Player */}
              <video
                key={activeReelIndex}
                ref={modalVideoRef}
                src={currentModalReel.videoUrl}
                poster={currentModalReel.coverImage}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={() => setIsPlaying((p) => !p)}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              />

              {/* Top Bar Header Overlay */}
              <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="eyebrow bg-signal-gold text-ink text-[8px] font-bold tracking-widest px-2.5 py-0.5 uppercase shadow-md">
                    {currentModalReel.category}
                  </span>
                  <span className="text-[10px] text-white/80 font-mono">
                    {activeReelIndex + 1} / {reels.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted((m) => !m)}
                    className="p-2 rounded-full bg-black/50 text-white hover:text-signal-gold backdrop-blur-sm border border-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    onClick={handleCloseReel}
                    className="p-2 rounded-full bg-black/50 text-white hover:text-signal-gold backdrop-blur-sm border border-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Center Play/Pause indicator */}
              {!isPlaying && (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/30"
                >
                  <div className="w-16 h-16 rounded-full bg-signal-gold text-ink flex items-center justify-center shadow-2xl animate-pulse">
                    <Play size={24} className="fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Metadata & WhatsApp CTA */}
              <div className="relative z-20 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3 pointer-events-auto">
                {/* Progress bar */}
                <div
                  onClick={handleProgressClick}
                  className="w-full h-1 bg-white/20 hover:h-2 rounded-full cursor-pointer transition-all overflow-hidden mb-1"
                >
                  <div
                    className="h-full bg-signal-gold transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Mobile prev/next row */}
                {reels.length > 1 && (
                  <div className="flex md:hidden items-center justify-center gap-3 pb-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={handlePrevReel}
                      className="px-4 py-1.5 bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-wider hover:bg-signal-gold hover:text-ink transition-all cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <span className="text-[10px] font-mono text-paper/50">{activeReelIndex + 1}/{reels.length}</span>
                    <button
                      onClick={handleNextReel}
                      className="px-4 py-1.5 bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-wider hover:bg-signal-gold hover:text-ink transition-all cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                )}

                <div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white leading-snug drop-shadow-md">
                    {currentModalReel.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-paper/75 text-[11px] font-mono mt-1">
                    {currentModalReel.client && (
                      <span className="flex items-center gap-1 text-signal-gold font-semibold">
                        <User size={11} /> {currentModalReel.client}
                      </span>
                    )}
                    {currentModalReel.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-signal-gold" /> {currentModalReel.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <WhatsAppButton
                    message={`Hi All in All Azhaguraja, I saw your vertical reel "${currentModalReel.title}" and would like to enquiry about shoot dates.`}
                    label="Enquire for this Reel"
                    variant="inline"
                    className="text-[10px] py-2.5 w-full font-bold tracking-wider text-center"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 5. SERVICES SECTION */}
      {/* 5A. MAIN SERVICES PREVIEW */}
      <section className="bg-ink py-24 px-6 lg:px-10 text-paper">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="eyebrow text-signal-gold mb-4 font-bold tracking-widest">WHAT WE DO</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">Our Specialties</h2>
            </div>
            <Link to="/services" className="eyebrow inline-flex items-center gap-2 text-signal-gold border-b border-signal-gold pb-1 hover:gap-3 transition-all font-bold text-xs tracking-wider">
              View All Services &amp; Rates <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((s) => (
                <div key={s.id} className="bg-slate border border-white/5 p-8 flex flex-col justify-between hover:border-signal-gold/40 transition-colors group">
                  <div>
                    <div className="overflow-hidden aspect-video bg-ink mb-6 relative">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-ink/30" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-signal-gold transition-colors">{s.title}</h3>
                    <p className="text-paper/60 text-sm leading-relaxed mb-6">{s.description}</p>
                    <ul className="flex flex-col gap-2 mb-8">
                      {s.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-paper/70 flex items-center gap-2">
                          <Check size={12} className="text-signal-gold shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div>
                      <p className="text-[10px] eyebrow text-paper/40 font-bold">STARTING AT</p>
                      <p className="text-lg font-bold text-signal-gold font-sans">₹{s.startingPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <WhatsAppButton serviceName={s.title} label="Enquire" variant="outline" className="text-[10px] px-4 py-2.5 font-bold tracking-wider" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-paper/50">Loading services...</div>
            )}
          </div>
        </div>
      </section>

      {/* 5B. WHY CHOOSE US */}
      <section className="bg-paper py-24 px-6 lg:px-10 border-b border-slate/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="eyebrow text-studio-blue mb-4 font-bold tracking-widest">OUR PHILOSOPHY</p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight">Why All in All Azhaguraja?</h2>
            <p className="text-slate-soft text-xs mt-3 font-semibold uppercase tracking-wider">We build conversion-driven visuals that capture attention within the first 3 seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "3-Second Hooks", body: "Reels succeed or fail in 3 seconds. We craft pacing, audio drops, and visual hooks to stop users from scrolling past your video." },
              { icon: Sparkles, title: "Premium Visuals", body: "We use professional mirrorless setups, cinema lenses, and precise lighting. No cheap phone edits; only true cinematic quality." },
              { icon: Award, title: "Local Authority", body: "Deeply rooted in Tirunelveli, Kanyakumari, and Madurai. We know the local aesthetics, showroom policies, and customer tastes." },
              { icon: Shield, title: "Business Conversion", body: "Our reels aren't just pretty — they're structured with clear calls-to-action to turn social media viewers into paying clients." }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate/10 p-8 flex flex-col gap-4 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-studio-blue-deep flex items-center justify-center text-signal-gold mb-2">
                  <item.icon size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-ink">{item.title}</h3>
                <p className="text-slate-soft text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5C. PACKAGES PREVIEW */}
      <section className="bg-mist/30 py-24 px-6 lg:px-10 border-b border-slate/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="eyebrow text-studio-blue mb-4 font-bold tracking-widest">PRICING PLANS</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">Packages Showcase</h2>
            </div>
            <Link to="/services" className="eyebrow inline-flex items-center gap-2 text-studio-blue border-b border-studio-blue pb-1 hover:gap-3 transition-all font-bold text-xs tracking-wider">
              View All Packages <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-slate/10 p-8 flex flex-col justify-between hover:shadow-xl transition-shadow relative">
                  <div>
                    <span className="eyebrow text-[9px] font-bold text-studio-blue tracking-widest border border-studio-blue px-2.5 py-1 mb-6 inline-block uppercase">
                      {pkg.category}
                    </span>
                    <h3 className="font-display text-2xl font-bold mb-1">{pkg.packageName} Package</h3>
                    <p className="text-2xl font-bold text-studio-blue-deep mt-4 mb-6 font-sans">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </p>
                    <ul className="flex flex-col gap-3 mb-8">
                      {pkg.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="text-xs text-slate-soft flex items-center gap-2.5">
                          <Check size={12} className="text-green-600 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={`/contact?service=${encodeURIComponent(pkg.category)}&package=${encodeURIComponent(pkg.packageName)}`}
                    className="eyebrow block text-center bg-ink text-paper py-3.5 hover:bg-studio-blue transition-colors font-bold text-xs tracking-wider mt-6"
                  >
                    Choose Package
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-soft/50">Loading packages...</div>
            )}
          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION & STUDIO STATS */}
      {/* 6A. INTRODUCTION / ABOUT STORY */}
      <section className="bg-paper py-24 px-6 lg:px-10 border-b border-slate/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow text-studio-blue mb-4 font-bold tracking-widest">ABOUT THE STUDIO</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink font-bold leading-tight mb-6 uppercase tracking-tight">
              Create Moments.<br />Build Professional Brands.
            </h2>
            <p className="text-slate-soft text-base leading-relaxed mb-6">
              Based in <strong>Tirunelveli</strong>, we are a premium creative studio dedicated to producing high-impact vertical reels, event photography, vehicle delivery captures, and corporate business campaigns. We bridge the gap between artistic wedding documentations and converting business promotional marketing.
            </p>
            <p className="text-slate-soft text-base leading-relaxed mb-8">
              Whether you want to capture the excitement of a new bike/car delivery, frame your wedding days, or launch a viral social media campaign for your local brand, our team brings high-end lighting, grading, and sound design to every frame.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="eyebrow bg-ink text-paper px-6 py-4 hover:bg-studio-blue transition-colors font-bold text-xs tracking-wider">
                Our Full Story
              </Link>
              <Link to="/contact" className="eyebrow border border-slate/20 text-ink px-6 py-4 hover:bg-slate/5 transition-colors font-bold text-xs tracking-wider">
                Get In Touch
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute -inset-4 border border-signal-gold/10 -z-10 pointer-events-none translate-x-2 translate-y-2" />
            <img
              className="w-full h-full object-cover aspect-[4/5] shadow-lg"
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"
              alt="Photography shooting"
              loading="lazy"
            />
            <img
              className="w-full h-full object-cover aspect-[4/5] mt-8 shadow-lg"
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
              alt="Video camera rig"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6B. STAT COUNTERS PANEL */}
      <section className="bg-studio-blue-deep py-16 px-6 lg:px-10 text-paper">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {studioStats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <h3 className="font-display text-4xl md:text-5xl text-signal-gold font-bold">
                {s.value}{s.suffix}
              </h3>
              <p className="text-xs eyebrow tracking-wider text-paper/60 mt-2 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA / BOOKING CONTACT */}
      <section className="bg-ink py-28 px-6 lg:px-10 text-center text-paper relative overflow-hidden">
        <div className="absolute inset-0 bg-studio-blue-deep/20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="eyebrow text-signal-gold mb-5 font-bold tracking-widest">LET'S START CREATING</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-2xl mx-auto uppercase tracking-tight">
            Ready to build your brand or capture your day?
          </h2>
          <p className="text-paper/60 text-sm md:text-base max-w-lg mx-auto mt-6 leading-relaxed">
            Reach out via WhatsApp or use our enquiry form to share your date. We'll tailor a quote and coordinate your shoot location immediately.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              to="/contact"
              className="eyebrow bg-white text-ink px-8 py-4 hover:bg-signal-gold hover:text-ink transition-colors font-bold text-xs tracking-wider"
            >
              Book Your Project
            </Link>
            
            <WhatsAppButton
              message="Hi All in All Azhaguraja, I'm interested in your services."
              variant="inline"
              className="font-bold text-xs tracking-wider bg-transparent border border-white/20 text-white hover:bg-white hover:text-ink hover:border-white"
              label="WhatsApp Enquiry"
            />
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM / YOUTUBE SOCIAL CTA (FOLLOW US) */}
      <section className="bg-paper py-20 px-6 lg:px-10 border-t border-b border-slate/10">
        <div className="max-w-[1000px] mx-auto text-center">
          <p className="eyebrow text-studio-blue mb-4 font-bold tracking-widest">FOLLOW US</p>
          <h2 className="font-display text-4xl font-bold mb-6 uppercase tracking-tight">Join the Social Circle</h2>
          <p className="text-slate-soft text-base max-w-xl mx-auto mb-10">
            We share fresh automobile reels, event clips, and behind-the-scenes editing workflows daily. Connect with us on your favorite platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-8 py-4 shadow-lg hover:opacity-90 active:scale-95 transition-all eyebrow font-bold text-xs tracking-wider"
            >
              <InstagramIcon size={16} /> Follow on Instagram
            </a>
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#FF0000] text-white px-8 py-4 shadow-lg hover:bg-[#CC0000] active:scale-95 transition-all eyebrow font-bold text-xs tracking-wider"
            >
              <YoutubeIcon size={16} /> Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE WHATSAPP CTA */}
      <WhatsAppButton variant="sticky" />
    </>
  );
}
