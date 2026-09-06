import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Camera } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useSettings } from "../context/SettingsContext";

export default function Hero() {
  const settings = useSettings();

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-ink">
      {/* Cinematic Background Media */}
      <div className="absolute inset-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
          alt="Cinematic background"
          className="w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/60 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-studio-blue-deep/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-10 max-w-[1400px] mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="h-px w-8 bg-signal-gold" />
          <span className="eyebrow text-signal-gold tracking-[0.25em] font-bold text-[10px]">
            Tirunelveli &amp; Surrounding Areas
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-[9vw] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-paper max-w-5xl font-bold tracking-tight uppercase"
        >
          {settings.brandName.split(" ").slice(0, 3).join(" ")}
          <br />
          <span className="text-signal-gold italic font-normal font-sans tracking-normal capitalize lowercase">
            {" "}{" "}
          </span>
          <span className="text-signal-gold font-display font-black">
            {settings.brandName.split(" ").slice(3).join(" ")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-paper/85 text-lg md:text-xl font-mono italic mt-4 text-signal-gold/90 font-bold"
        >
          “{settings.tagline}”
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-paper/60 text-sm md:text-base max-w-2xl mt-4 leading-relaxed font-sans"
        >
          We capture professional personal reels, high-energy car and bike delivery releases, events, 
          converting marketing campaigns, and authority-building business promotional videos. 
          Your creative vision, shot locally with global standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center gap-4 mt-10"
        >
          <Link
            to="/portfolio"
            className="eyebrow bg-white text-ink px-7 py-4 hover:bg-signal-gold hover:text-ink transition-all duration-300 font-bold text-xs tracking-wider"
          >
            View Gallery
          </Link>
          <Link
            to="/contact"
            className="eyebrow border border-paper/30 text-paper px-7 py-4 hover:border-signal-gold hover:text-signal-gold transition-all duration-300 font-bold text-xs tracking-wider"
          >
            Book Your Project
          </Link>
          
          <WhatsAppButton
            message="Hi Lumen & Frame, I'm interested in your services."
            variant="inline"
            className="w-full sm:w-auto font-bold text-xs tracking-wider"
            label="WhatsApp Us"
          />
        </motion.div>
      </div>

      {/* Down arrow */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-paper/40 z-10"
      >
        <ChevronDown size={22} className="text-signal-gold" />
      </motion.div>
    </section>
  );
}
