import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { getBrandMarketing } from "../services/brandMarketingService";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import { Play } from "lucide-react";
import useSEO from "../hooks/useSEO";

export default function BrandMarketing() {
  useSEO({
    title: "Brand Marketing Campaigns",
    description: "Cinematic commercial reels, product macro zooms, and showroom handover promos shot in Tirunelveli.",
    keywords: "brand marketing Tirunelveli, showroom handover reel, product commercials"
  });

  const [campaigns, setCampaigns] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); // URL of video to play in popup

  useEffect(() => {
    getBrandMarketing()
      .then(setCampaigns)
      .catch(() => setCampaigns([]));
  }, []);

  if (!campaigns) return <Loader label="Loading brand campaigns" />;

  return (
    <>
      <PageHeader
        eyebrow="BRAND MARKETING"
        title="We build authority content that sells your products."
        description="Browse through our showroom launch videos, product commercials, and high-converting restaurant reels."
      />

      <section className="bg-paper py-12 pb-24 font-sans text-ink">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {campaigns.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate/15 bg-white">
              <p className="text-slate-soft">No brand marketing campaigns added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white border border-slate/10 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group p-5 cursor-pointer"
                  onClick={() => setActiveVideo({ url: collab.videoUrl, title: collab.brandName })}
                >
                  <div>
                    {/* Cover photo click-to-play trigger */}
                    <div className="relative overflow-hidden aspect-video bg-slate mb-5">
                      <img
                        src={collab.image}
                        alt={collab.brandName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-signal-gold bg-ink/90 group-hover:bg-signal-gold group-hover:text-ink text-signal-gold flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110">
                          <Play size={16} className="fill-current translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink group-hover:text-studio-blue transition-colors">
                      {collab.brandName}
                    </h3>
                    <p className="text-studio-blue font-mono text-[9px] uppercase tracking-widest mb-3 font-semibold mt-1">
                      {collab.tagline}
                    </p>
                    <p className="text-slate-soft text-xs leading-relaxed mb-6 line-clamp-3">
                      {collab.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate/5" onClick={(e) => e.stopPropagation()}>
                    <WhatsAppButton
                      message={`Hi All in All Azhaguraja, I saw your brand marketing campaign for "${collab.brandName}" and would like to ask about launch reel rates.`}
                      variant="outline"
                      label="Enquire campaign rate"
                      className="text-[10px] py-2.5 font-bold tracking-wider w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Popup Lightbox player */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-ink p-2 border border-white/10 shadow-2xl relative"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-signal-gold eyebrow font-bold text-xs uppercase"
            >
              Close ✕
            </button>
            {activeVideo.url?.endsWith(".mp4") || activeVideo.url?.includes("/uploads/") ? (
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
              />
            ) : (
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full aspect-video"
              />
            )}
            <div className="p-3 text-white eyebrow text-[10px] tracking-wider font-bold">
              {activeVideo.title.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      <WhatsAppButton variant="sticky" />
    </>
  );
}
