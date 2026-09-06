import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const lastTapRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/brand-marketing", label: "Brand Marketing" },
    { to: "/portfolio", label: "Gallery" },
    { to: "/reels", label: "Reels" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
    { to: "/about", label: "About" },
  ];

  const handleLogoTap = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      navigate("/admin/login");
    }
    lastTapRef.current = now;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5 text-paper group" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 border border-signal-gold flex items-center justify-center bg-ink" onClick={handleLogoTap}>
            <Camera size={16} className="text-signal-gold group-hover:rotate-12 transition-transform" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-sm md:text-base tracking-wider font-bold text-white uppercase leading-none">
              {settings.brandName}
            </span>
            <span className="text-[9px] text-signal-gold font-mono tracking-widest uppercase mt-1 leading-none">
              {settings.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `eyebrow text-[13px] tracking-wider transition-colors ${
                  isActive ? "text-signal-gold font-bold" : "text-paper/85 hover:text-signal-gold"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="eyebrow text-[13px] tracking-wider border border-signal-gold text-signal-gold px-5 py-3 hover:bg-signal-gold hover:text-ink transition-all duration-300 shadow-lg hover:shadow-signal-gold/20"
          >
            Book Session
          </Link>
        </div>

        <button
          className="lg:hidden text-paper hover:text-signal-gold transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-ink border-t border-white/10"
          >
            <nav className="flex flex-col px-6 py-8 gap-5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `font-display text-xl ${isActive ? "text-signal-gold" : "text-paper/80"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="eyebrow mt-4 text-center border border-signal-gold text-signal-gold px-5 py-3 rounded-none font-bold"
              >
                Book Session
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
