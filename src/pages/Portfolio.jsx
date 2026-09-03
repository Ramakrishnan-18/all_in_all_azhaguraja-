import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import Lightbox from "../components/Lightbox";
import { getPhotos } from "../services/photosService";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";
import { MapPin, ZoomIn, Camera } from "lucide-react";

const categories = [
  { value: "all", label: "All Photos" },
  { value: "Weddings", label: "Weddings" },
  { value: "Portraits", label: "Portraits" },
  { value: "Events", label: "Events" },
  { value: "Commercial", label: "Commercial" },
  { value: "Food", label: "Food" },
  { value: "Car & Bike", label: "Car & Bike" },
];

export default function Gallery() {
  useSEO({
    title: "Photo Gallery | Creative Still Photography",
    description: "Browse our photography gallery — portraits, weddings, automobile delivery photos, and commercial food & brand shoots in Tirunelveli.",
    keywords: "Photography gallery Tirunelveli, portrait photography, wedding photos Nellai, bike delivery photos"
  });

  const [photos, setPhotos] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    getPhotos()
      .then((data) => {
        const sorted = [...(data || [])].sort((a, b) => {
          const ta = new Date(a.createdAt || a.date || 0).getTime();
          const tb = new Date(b.createdAt || b.date || 0).getTime();
          return tb - ta;
        });
        setPhotos(sorted);
      })
      .catch(() => setPhotos([]));
  }, []);

  if (!photos) return <Loader label="Loading photo gallery" />;

  const filteredPhotos = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="PHOTO GALLERY"
        title="Every still frame tells a story."
        description="Explore our photography collection — candid wedding moments, automobile delivery captures, commercial campaigns, and personal portraits across Tirunelveli."
      />

      <section className="bg-paper py-12 pb-24 font-sans">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
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

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate/15 bg-white">
              <Camera size={40} className="mx-auto mb-4 text-slate/30" />
              <p className="text-slate-soft">No photos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id || index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
                  onClick={() => setLightboxIndex(index)}
                  className="relative overflow-hidden bg-slate group cursor-zoom-in aspect-[4/3] shadow-sm border border-slate/10"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 left-2 z-10">
                    <span className="eyebrow bg-ink/85 backdrop-blur-sm text-signal-gold text-[7px] font-bold tracking-widest px-2 py-0.5 uppercase">
                      {photo.category}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 z-10 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <h3 className="font-display text-xs md:text-sm font-bold text-white leading-tight line-clamp-2">
                      {photo.title}
                    </h3>
                    <p className="text-[9px] text-paper/60 font-mono mt-1 flex items-center gap-1">
                      <MapPin size={9} className="text-signal-gold" /> {photo.location}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={filteredPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <WhatsAppButton variant="sticky" />
    </>
  );
}
