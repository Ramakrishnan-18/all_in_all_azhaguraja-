import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPhotos } from "../services/photosService";
import Loader from "./Loader";
import Lightbox from "./Lightbox";
import { ArrowRight, MapPin, ZoomIn, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Fallback gallery photos when no projects in localStorage
const fallbackPhotos = [
  {
    id: "fg1",
    title: "Golden Hour Portrait",
    category: "Personal Reels",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
    location: "Palayamkottai, Tirunelveli",
  },
  {
    id: "fg2",
    title: "Yamaha R15 V4 — Delivery Day",
    category: "Car/Bike Delivery",
    url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    location: "Vannarpettai, Tirunelveli",
  },
  {
    id: "fg3",
    title: "The Heritage Wedding",
    category: "Events",
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
    location: "Kanyakumari Road, Tirunelveli",
  },
  {
    id: "fg4",
    title: "Nellai Cafe — Sensory Brand Pour",
    category: "Business/Marketing",
    url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop",
    location: "Tirunelveli Town",
  },
  {
    id: "fg5",
    title: "Street Style — Urban Fashion",
    category: "Personal Reels",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    location: "Town, Tirunelveli",
  },
  {
    id: "fg6",
    title: "Royal Enfield Classic — First Ride",
    category: "Car/Bike Delivery",
    url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    location: "High Ground, Tirunelveli",
  },
  {
    id: "fg7",
    title: "Bride Candid Moments",
    category: "Events",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    location: "Nellai Sangeet Hall",
  },
  {
    id: "fg8",
    title: "Trend Apparel Town Collection",
    category: "Business/Marketing",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    location: "Palayamkottai",
  },
  {
    id: "fg9",
    title: "Vintage Cinema Portrait",
    category: "Personal Reels",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    location: "Tirunelveli Junction",
  }
];

export default function FeaturedWork() {
  const [photos, setPhotos] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    getPhotos()
      .then((data) => {
        const base = data && data.length > 0 ? data : [];
        const merged = [...base, ...fallbackPhotos.filter((f) => !base.find((b) => b.url === f.url))];
        // Newest first: newest captures always appear at the top of the home gallery.
        merged.sort((a, b) => {
          const ta = new Date(a.createdAt || a.date || 0).getTime();
          const tb = new Date(b.createdAt || b.date || 0).getTime();
          return tb - ta;
        });
        setPhotos(merged);
      })
      .catch(() => setPhotos(fallbackPhotos));
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!photos) return <Loader label="Loading gallery preview" />;

  return (
    <section className="bg-paper py-24 px-6 lg:px-10 border-b border-slate/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="eyebrow text-studio-blue mb-3 font-bold tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-signal-gold" /> OUR GALLERY
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">Recent Captures</h2>
            <p className="text-slate-soft text-xs md:text-sm mt-2">
              Swipe horizontally to browse through our recent event, automobile, and commercial captures.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-10 h-10 border border-slate/20 hover:border-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors cursor-pointer text-ink"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-10 h-10 border border-slate/20 hover:border-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors cursor-pointer text-ink"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              to="/portfolio"
              className="eyebrow inline-flex items-center gap-2 text-studio-blue border-b border-studio-blue pb-1 hover:gap-3 transition-all font-bold text-xs tracking-wider"
            >
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Swipeable Photo Row (Horizontal Scroll + Snap) */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 -mx-6 px-6 lg:-mx-10 lg:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (index % 5) * 0.05 }}
              onClick={() => setLightboxIndex(index)}
              className="relative aspect-[4/3] w-[80vw] sm:w-[320px] md:w-[380px] shrink-0 snap-start bg-slate group cursor-pointer overflow-hidden border border-slate/10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={photo.coverImage || photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="eyebrow bg-ink/90 backdrop-blur-sm text-signal-gold text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase shadow-sm">
                  {photo.category}
                </span>
              </div>

              {/* Hover title & info */}
              <div className="absolute inset-x-0 bottom-0 p-4 z-10 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="font-display text-base font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
                  {photo.title}
                </h3>
                {photo.location && (
                  <p className="text-[10px] text-paper/80 font-mono mt-1 flex items-center gap-1">
                    <MapPin size={10} className="text-signal-gold" /> {photo.location}
                  </p>
                )}
              </div>

              {/* Center zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-lg">
                  <ZoomIn size={18} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Swipe hint for mobile */}
        <div className="flex items-center justify-between mt-4 text-slate-soft text-xs">
          <p className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-signal-gold animate-pulse" />
            <span>Swipe or click arrows to view all {photos.length} photos</span>
          </p>
          <span className="text-[10px] font-mono opacity-70">Click photo to zoom</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </section>
  );
}

