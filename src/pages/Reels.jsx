import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { getReels } from "../services/reelsService";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, MapPin, User, Sparkles, Film } from "lucide-react";
import useSEO from "../hooks/useSEO";

function getCloudinaryVideoPoster(videoUrl) {
  if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) return "";
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mov|mp4|webm)(\?.*)?$/i, "$2")
    .replace(/(\?.*)?$/, ".jpg$1");
}

const categories = [
  { value: "all", label: "All Reels" },
  { value: "Personal Reels", label: "Personal Reels" },
  { value: "Car/Bike Delivery", label: "Car & Bike Handover" },
  { value: "Business/Marketing", label: "Marketing Promos" },
  { value: "Events", label: "Events & Weddings" },
];

export default function Reels() {
  useSEO({
    title: "Trending Vertical Reels | Cinematic Video Portfolio",
    description: "Watch our vertical 9:16 personal branding, showroom vehicle handovers, and transition-heavy reels shot in Tirunelveli.",
    keywords: "Instagram reels Tirunelveli, vertical video marketing, bike delivery reels, wedding teaser reels"
  });

  const [reels, setReels] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const carouselRef = useRef(null);

  // Video playback states for active popup
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    getReels()
      .then((data) => {
        const withPosters = (data || []).map((r) => {
          if (!r.poster && r.videoFile) {
            const cloudinaryPoster = getCloudinaryVideoPoster(r.videoFile);
            if (cloudinaryPoster) return { ...r, poster: cloudinaryPoster };
          }
          if (!r.poster && r.videoUrl) {
            const ytMatch = r.videoUrl.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
            if (ytMatch) return { ...r, poster: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` };
          }
          return r;
        });
        setReels(withPosters);
      })
      .catch(() => setReels([]));
  }, []);

  const scrollReels = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredReels = reels
    ? activeCategory === "all"
      ? reels
      : reels.filter((r) => r.category === activeCategory)
    : [];

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
    if (activeReelIndex !== null && filteredReels.length > 0) {
      setActiveReelIndex((prev) => (prev + 1) % filteredReels.length);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [activeReelIndex, filteredReels.length]);

  const handlePrevReel = useCallback(() => {
    if (activeReelIndex !== null && filteredReels.length > 0) {
      setActiveReelIndex((prev) => (prev - 1 + filteredReels.length) % filteredReels.length);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [activeReelIndex, filteredReels.length]);

  // Touch swipe support for lightbox
  const touchStartY = useRef(0);
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleNextReel();
      else handlePrevReel();
    }
  };

  // Keyboard navigation for reels
  useEffect(() => {
    if (activeReelIndex === null) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseReel();
      if (e.key === "ArrowDown" || e.key === "ArrowRight") handleNextReel();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") handlePrevReel();
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

  // Handle video element play/pause and progress update
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeReelIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  if (!reels) return <Loader label="Loading creative reels" />;

  const activeProject = activeReelIndex !== null ? filteredReels[activeReelIndex] : null;
  const videoSrc = activeProject?.videoFile || activeProject?.videoUrl || "";

  return (
    <>
      <PageHeader
        eyebrow="VERTICAL REELS"
        title="Engineered for vertical feeds &amp; instant engagement."
        description="High-octane personal branding, vehicle showroom deliveries, event teasers, and conversion reels shot across Tirunelveli."
      />

      <section className="bg-paper py-12 pb-24 font-sans text-ink">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setActiveReelIndex(null);
                }}
                className={`eyebrow text-[10px] tracking-widest px-5 py-2.5 border transition-all cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-ink text-signal-gold border-ink shadow-md"
                    : "bg-white text-slate-soft border-slate/15 hover:border-ink hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filteredReels.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate/15 bg-white">
              <Film size={40} className="mx-auto mb-4 text-slate/30" />
              <p className="text-slate-soft">No reels uploaded yet.</p>
            </div>
          ) : (
            <>
              {/* Swipeable Reels Carousel */}
              <div className="flex items-center justify-end gap-2 mb-4">
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

              <div
                ref={carouselRef}
                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-6 px-6 lg:-mx-10 lg:px-10"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredReels.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: (index % 5) * 0.05 }}
                    onClick={() => handleOpenReel(index)}
                    className="relative aspect-[9/16] w-[72vw] sm:w-[260px] md:w-[280px] shrink-0 snap-start bg-slate overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl border border-slate/10 transition-all duration-300 rounded-xs"
                  >
                    {/* Cover photo / poster */}
                    {project.poster ? (
                      <img
                        src={project.poster}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : project.videoFile ? (
                      <video
                        src={project.videoFile}
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 flex items-center justify-center">
                        <Play size={32} className="text-signal-gold/40" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Top Tag & 9:16 Indicator */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="eyebrow bg-ink/85 backdrop-blur-sm text-signal-gold text-[7px] font-bold tracking-widest px-2.5 py-0.5 uppercase shadow-sm">
                        {project.category}
                      </span>
                      <span className="eyebrow bg-black/60 backdrop-blur-sm text-white/80 text-[8px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={8} className="text-signal-gold" /> REEL
                      </span>
                    </div>

                    {/* Play Button Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-13 h-13 rounded-full bg-signal-gold/90 text-ink flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-105 group-hover:bg-signal-gold transition-all duration-300">
                        <Play size={18} className="fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Details Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end text-white pointer-events-none">
                      <h4 className="font-display text-sm font-bold leading-snug line-clamp-2 drop-shadow-md">
                        {project.title}
                      </h4>
                      {project.client && (
                        <p className="text-[10px] text-paper/75 font-mono mt-1.5 flex items-center gap-1">
                          <User size={10} className="text-signal-gold" /> {project.client}
                        </p>
                      )}
                      {project.location && (
                        <p className="text-[9px] text-paper/60 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin size={9} className="text-signal-gold" /> {project.location}
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
                  <span>Swipe or click arrows to view all {filteredReels.length} reels</span>
                </p>
                <span className="text-[10px] font-mono opacity-70">Click reel to play</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 9:16 Vertical Reel Player Lightbox */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseReel}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 md:p-6 cursor-zoom-out select-none"
          >
            {/* Prev / Next Navigation buttons on desktop */}
            {filteredReels.length > 1 && (
              <div
                className="flex flex-col gap-4 absolute right-3 md:right-6 lg:right-12 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handlePrevReel}
                  title="Previous Reel (Up Arrow)"
                  className="w-12 h-12 rounded-full bg-ink/80 border border-white/20 hover:border-signal-gold text-white hover:text-signal-gold flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
                >
                  <ChevronUp size={24} />
                </button>
                <button
                  onClick={handleNextReel}
                  title="Next Reel (Down Arrow)"
                  className="w-12 h-12 rounded-full bg-ink/80 border border-white/20 hover:border-signal-gold text-white hover:text-signal-gold flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
                >
                  <ChevronDown size={24} />
                </button>
              </div>
            )}

            {/* Vertical 9:16 Reel Player Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[390px] h-[85vh] max-h-[760px] aspect-[9/16] bg-ink border border-white/15 shadow-2xl overflow-hidden rounded-md flex flex-col justify-between cursor-default"
            >
              {/* Top Bar Header */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-30 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="eyebrow bg-signal-gold text-ink text-[7px] font-bold tracking-widest px-2 py-0.5 uppercase">
                    {activeProject.category}
                  </span>
                  <span className="text-[10px] font-mono text-paper/70">
                    {activeReelIndex + 1} / {filteredReels.length}
                  </span>
                </div>

                <button
                  onClick={handleCloseReel}
                  className="text-white hover:text-signal-gold p-1 transition-colors cursor-pointer"
                  aria-label="Close reel player"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video Play Area */}
              <div
                className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden cursor-pointer"
                onClick={() => setIsPlaying((p) => !p)}
              >
                {videoSrc ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      poster={activeProject?.poster}
                      loop
                      playsInline
                      autoPlay
                      muted={isMuted}
                      crossOrigin="anonymous"
                      onTimeUpdate={handleTimeUpdate}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    {/* Swipe capture overlay - sits on top of video */}
                    <div
                      className="absolute inset-0 z-20"
                      style={{ touchAction: "none" }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={() => setIsPlaying((p) => !p)}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
                        <div className="w-16 h-16 rounded-full bg-black/70 text-signal-gold border border-signal-gold/40 flex items-center justify-center shadow-2xl">
                          <Play size={26} className="fill-current translate-x-0.5" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-white/50">
                    <Play size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-xs">No video available</p>
                  </div>
                )}
              </div>

              {/* Bottom Video Controls & Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-30 flex flex-col gap-3">
                {/* Mobile prev/next row */}
                {filteredReels.length > 1 && (
                  <div className="flex md:hidden items-center justify-center gap-3 pb-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={handlePrevReel}
                      className="px-4 py-1.5 bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-wider hover:bg-signal-gold hover:text-ink transition-all cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <span className="text-[10px] font-mono text-paper/50">{activeReelIndex + 1}/{filteredReels.length}</span>
                    <button
                      onClick={handleNextReel}
                      className="px-4 py-1.5 bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-wider hover:bg-signal-gold hover:text-ink transition-all cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                )}
                {/* Progress bar (for native video) */}
                {videoSrc && (
                  <div
                    onClick={handleProgressClick}
                    className="w-full h-1 bg-white/25 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
                  >
                    <div
                      className="h-full bg-signal-gold transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Info and action button */}
                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-display text-sm md:text-base font-bold text-white leading-tight">
                      {activeProject.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-paper/70 font-mono mt-1">
                      {activeProject.client && (
                        <span className="flex items-center gap-1">
                          <User size={10} className="text-signal-gold" /> {activeProject.client}
                        </span>
                      )}
                      {activeProject.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-signal-gold" /> {activeProject.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Play & Audio Toggles */}
                  {videoSrc && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted((m) => !m);
                        }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white hover:text-signal-gold flex items-center justify-center cursor-pointer transition-colors"
                        title={isMuted ? "Unmute (M)" : "Mute (M)"}
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying((p) => !p);
                        }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white hover:text-signal-gold flex items-center justify-center cursor-pointer transition-colors"
                        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* WhatsApp Enquiry Button */}
                <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                  <WhatsAppButton
                    message={`Hi Lumen & Frame, I saw your vertical reel for "${activeProject.title}" and would like to enquire about similar packages.`}
                    variant="inline"
                    label="Enquire about this reel package"
                    className="text-[10px] py-2.5 font-bold tracking-wider w-full shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
