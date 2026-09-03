import PageHeader from "../components/PageHeader";
import StatCounter from "../components/StatCounter";
import { studioStats } from "../services/mockData";
import { Camera, Sparkles, Zap, ShieldCheck } from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";

export default function About() {
  useSEO({
    title: "About the Founder & Crew | Cinematic Studio",
    description: "Learn about Azhaguraja S. and our vision to bring professional cinematic videography and vertical reels to Tirunelveli.",
    keywords: "Azhaguraja S., reels creator Tirunelveli, photographer Tirunelveli"
  });

  return (
    <>
      <PageHeader
        eyebrow="OUR VISION"
        title="We capture the energy of Tirunelveli's brands and the emotion of its people."
        description="Learn about the crew, our setup, and why we are obsessed with delivering premium visuals for your personal brand or event."
      />

      <section className="bg-paper py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Cover Media */}
          <div className="relative aspect-[4/5] bg-slate overflow-hidden shadow-lg border border-slate/10">
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"
              alt="Azhaguraja shoot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/10" />
            <div className="absolute bottom-6 left-6 bg-ink/90 text-white px-4 py-2 border border-signal-gold/20 font-mono text-xs">
              Founder: Azhaguraja S.
            </div>
          </div>

          {/* Story Text */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow text-studio-blue font-bold tracking-widest mb-3">THE TEAM &amp; STORY</span>
            <h2 className="font-display text-3xl md:text-4xl text-ink font-bold leading-tight mb-6">
              Founded to create moments and build authority brands.
            </h2>
            <p className="text-slate-soft text-sm md:text-base leading-relaxed mb-4">
              <strong>All in All Azhaguraja</strong> was born out of a simple idea: video content in Tirunelveli should not look like basic templates. Local brands, showroom deliveries, and family milestones deserve the same cinematic grading, audio drops, and transitions that top-tier agencies produce.
            </p>
            <p className="text-slate-soft text-sm md:text-base leading-relaxed mb-6">
              Our founder, <strong>Azhaguraja S.</strong>, established this studio to combine creative photography with high-energy vertical reels. We specialize in pacing, transition timing, and sound design. From R15 delivery exhausts to macro coffee pours, we translate everyday motion into professional digital content.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-slate/10">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-studio-blue-deep text-signal-gold flex items-center justify-center shrink-0">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-ink mb-1">Scroll-Stop Design</h4>
                  <p className="text-slate-soft text-xs">Reels optimized to capture attention within the first 3 seconds.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-studio-blue-deep text-signal-gold flex items-center justify-center shrink-0">
                  <Camera size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-ink mb-1">Mirrorless Cinema Gear</h4>
                  <p className="text-slate-soft text-xs">High-end stabilization, tracking setups, and clean audio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-ink text-paper py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="eyebrow text-signal-gold mb-3 font-bold tracking-widest">BY THE NUMBERS</p>
            <h3 className="font-display text-3xl font-bold uppercase">Our Local Impact</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {studioStats.map((s) => (
              <div key={s.label} className="text-center">
                <h4 className="font-display text-4xl md:text-5xl text-signal-gold font-bold">
                  {s.value}{s.suffix}
                </h4>
                <p className="text-[10px] eyebrow text-paper/60 uppercase tracking-widest mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-paper py-24 px-6 lg:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4 uppercase tracking-tight text-ink">Ready to collaborate?</h2>
          <p className="text-slate-soft text-sm mb-8 leading-relaxed">
            Get in touch to check date availability for weddings, coordinate a showroom delivery release, or plan a content calendar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <WhatsAppButton label="WhatsApp Team" variant="inline" className="font-bold text-xs" />
            <WhatsAppButton label="Enquire rates" variant="outline" className="font-bold text-xs" />
          </div>
        </div>
      </section>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
