import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { getTestimonials } from "../services/testimonialsService";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";
import { Star } from "lucide-react";

export default function Testimonials() {
  useSEO({
    title: "Client Testimonials | Reviews",
    description: "Read reviews and testimonials from local Tirunelveli businesses and couples who worked with All in All Azhaguraja.",
    keywords: "reviews photographer Tirunelveli, feedback reels creator, client recommendations"
  });

  const [testimonials, setTestimonials] = useState(null);

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  }, []);

  if (!testimonials) return <Loader label="Loading reviews" />;

  return (
    <>
      <PageHeader
        eyebrow="REVIEWS"
        title="What our clients say about the cinematic results."
        description="We prioritize brand messaging, visual engagement, and timely deliverables. Read feedback from our past shoots in Tirunelveli."
      />

      <section className="bg-paper py-12 pb-24 font-sans">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate/10 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
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
        </div>
      </section>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
