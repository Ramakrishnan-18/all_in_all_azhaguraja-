import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import "./Lightbox.css";

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    },
    [index, images?.length, onClose, onNavigate]
  );

  useEffect(() => {
    if (index === null) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, handleKey]);

  if (!images || images.length === 0 || index === null) return null;

  const current = images[index];
  const src = typeof current === "string" ? current : current?.url || current?.coverImage || "";
  const title = typeof current === "object" ? current?.title : "";
  const category = typeof current === "object" ? current?.category : "";
  const location = typeof current === "object" ? current?.location : "";

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8 select-none"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {category && (
                <span className="eyebrow bg-signal-gold text-ink text-[8px] md:text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                  {category}
                </span>
              )}
              {title && (
                <h4 className="font-display text-sm md:text-base font-bold text-white line-clamp-1">
                  {title}
                </h4>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="text-paper/80 hover:text-signal-gold p-2 transition-colors cursor-pointer"
            >
              <X size={26} />
            </button>
          </div>

          {/* Main Photo & Navigation */}
          <div
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-auto overflow-hidden py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                onClick={() => onNavigate((index - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 z-20 w-11 h-11 rounded-full bg-black/60 border border-white/10 hover:border-signal-gold text-white hover:text-signal-gold flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-xl hover:scale-105"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <motion.img
              key={src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={src}
              alt={title || "Photo"}
              className="max-h-[72vh] md:max-h-[78vh] max-w-[90vw] md:max-w-[85vw] object-contain shadow-2xl rounded-xs"
            />

            {images.length > 1 && (
              <button
                onClick={() => onNavigate((index + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-2 md:right-4 z-20 w-11 h-11 rounded-full bg-black/60 border border-white/10 hover:border-signal-gold text-white hover:text-signal-gold flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm shadow-xl hover:scale-105"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Bar Details & WhatsApp Enquiry */}
          <div
            className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 text-paper/70 text-xs">
              {location && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-paper/60">
                  <MapPin size={11} className="text-signal-gold" /> {location}
                </span>
              )}
              <span className="font-mono text-[10px] text-signal-gold tracking-widest">
                {index + 1} / {images.length}
              </span>
            </div>

            {title && (
              <WhatsAppButton
                message={`Hi Lumen & Frame, I loved this photo "${title}" in your gallery and would like to enquire about this photoshoot style.`}
                variant="inline"
                label="Enquire about this photo style"
                className="text-[10px] py-2 px-4 font-bold tracking-wider shadow-md"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
