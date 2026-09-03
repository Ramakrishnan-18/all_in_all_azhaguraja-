import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Camera } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./SocialIcons";
import { getSettings } from "../services/settingsService";

export default function Footer() {
  const [settings, setSettings] = useState({
    brandName: "ALL IN ALL AZHAGURAJA",
    tagline: "Create Moments, Build Brands",
    contactEmail: "allinallazhaguraja@gmail.com",
    contactPhone: "+91 94884 12345",
    location: "Palayamkottai, Tirunelveli, Tamil Nadu",
    instagramUrl: "#",
    youtubeUrl: "#"
  });

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="bg-ink text-paper py-20 px-6 lg:px-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 border border-signal-gold flex items-center justify-center bg-black">
              <Camera size={14} className="text-signal-gold group-hover:rotate-12 transition-transform" />
            </span>
            <span className="font-display tracking-wider font-bold text-sm text-white uppercase">
              {settings.brandName}
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-paper/60">
            A premium cinematic creative studio in Tirunelveli. Creating high-converting personal reels, car/bike delivery coverage, and business marketing films.
          </p>
          <p className="mt-2 text-xs text-signal-gold font-mono uppercase tracking-widest">
            {settings.tagline}
          </p>
        </div>

        <div>
          <p className="eyebrow text-signal-gold mb-4 font-bold">Studio Map</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="hover:text-signal-gold transition-colors">Home</Link></li>
            <li><Link to="/brand-marketing" className="hover:text-signal-gold transition-colors">Brand Marketing</Link></li>
            <li><Link to="/portfolio" className="hover:text-signal-gold transition-colors">Gallery</Link></li>
            <li><Link to="/reels" className="hover:text-signal-gold transition-colors">Reels</Link></li>
            <li><Link to="/services" className="hover:text-signal-gold transition-colors">Services &amp; Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-signal-gold transition-colors">Contact</Link></li>
            <li><Link to="/about" className="hover:text-signal-gold transition-colors">About Story</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-signal-gold mb-4 font-bold">Contact Details</p>
          <ul className="flex flex-col gap-3 text-sm text-paper/70">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-signal-gold shrink-0" /> {settings.contactEmail}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-signal-gold shrink-0" /> {settings.contactPhone}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xs text-signal-gold shrink-0">📍</span> {settings.location}
            </li>
            <li className="flex items-center gap-4 pt-4 border-t border-white/5 mt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-paper/75 hover:text-signal-gold transition-colors"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-paper/75 hover:text-signal-gold transition-colors"
              >
                <YoutubeIcon size={18} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-paper/50">
        <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-signal-gold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-signal-gold transition-colors">Terms &amp; Conditions</Link>
        </div>
        <p className="font-mono text-[9px] tracking-wider uppercase text-signal-gold/60">CREATED TO CREATE MOMENTS &amp; BUILD BRANDS.</p>
      </div>
      <div className="max-w-[1400px] mx-auto pt-4 border-t border-white/5 flex justify-center">
        <Link
          to="/admin/login"
          className="text-[9px] font-mono text-paper/20 hover:text-signal-gold/60 transition-colors tracking-widest uppercase"
        >
          ⚙ Admin
        </Link>
      </div>
    </footer>
  );
}
