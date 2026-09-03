import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getTestimonials } from "../services/testimonialsService";
import Loader from "./Loader";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(null);

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  if (!testimonials) return <Loader label="Loading reviews" />;

  return (
    <section className="bg-mist/20 py-24 px-6 lg:px-10 border-b border-slate/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="eyebrow text-studio-blue mb-4 font-bold tracking-widest">CLIENT STORIES</p>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight">Reviews From The Field</h2>
          <p className="text-slate-soft text-xs mt-3">Read what wedding couples and brand directors in Tirunelveli say about our work.</p>
        </div>

        {/* Mobile Swipe Wrapper (flex horizontal, snap scroll) + Desktop Grid */}
        <div
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-6 -mx-4 px-4 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate/10 p-8 shadow-sm flex flex-col justify-between snap-start shrink-0 w-[85vw] sm:w-[360px] lg:w-auto"
            >
              <div>
                <div className="flex gap-1 text-signal-gold mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>
                <p className="text-slate-soft text-sm italic leading-relaxed mb-6">
                  “{t.review}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate/5">
                <img
                  src={t.clientImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"}
                  alt={t.clientName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-display text-sm font-bold text-ink leading-tight">{t.clientName}</h4>
                  <p className="text-[10px] text-slate-soft font-mono uppercase mt-0.5">{t.project}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] font-mono text-slate-soft/45 mt-4 lg:hidden">
          ◀ Swipe Left / Right to Read More ▶
        </div>
      </div>
    </section>
  );
}
