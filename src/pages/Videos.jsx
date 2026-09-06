import { useEffect, useState, useRef } from "react";
import { getProjects } from "../services/projectsService";
import Loader from "../components/Loader";
import VideoPlayer from "../components/VideoPlayer";
import WhatsAppButton from "../components/WhatsAppButton";
import { MapPin, User, MessageCircle } from "lucide-react";
import useSEO from "../hooks/useSEO";

export default function Videos() {
  useSEO({
    title: "Cinematic Videos & Reels Feed",
    description: "Watch Lumen & Frame's latest reels, automotive handovers, and brand commercials in a vertically scrollable feed.",
    keywords: "vertical reels Tirunelveli, bike delivery reels, car delivery reels, showroom handover video"
  });

  const [videoProjects, setVideoProjects] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    getProjects()
      .then((data) => {
        // Filter projects that contain video links
        const videoOnly = data.filter((p) => p.videos && p.videos.length > 0);
        setVideoProjects(videoOnly);
      })
      .catch(() => setVideoProjects([]));
  }, []);

  if (!videoProjects) return <Loader label="Loading cinematic videos" />;

  return (
    <div className="bg-ink min-h-screen text-paper pt-20 flex flex-col justify-center items-center">
      {/* Description Header for Larger screens */}
      <div className="hidden md:block text-center py-6 max-w-xl mx-auto px-4 shrink-0">
        <h1 className="font-display text-2xl font-bold text-signal-gold mb-1">Cinematic Videos &amp; Reels</h1>
        <p className="text-paper/60 text-xs">
          Scroll vertically to watch our trending personal, delivery, and marketing reels shot in Tirunelveli.
        </p>
      </div>

      {/* Reels scroll container */}
      {videoProjects.length === 0 ? (
        <div className="py-20 text-center text-paper/50">
          <p>No video projects published yet.</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full max-w-[460px] h-[calc(100vh-80px)] md:h-[70vh] md:max-h-[780px] overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col border border-white/10 bg-black/60 shadow-2xl relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videoProjects.map((project) => {
            const video = project.videos[0];
            return (
              <div
                key={project.id}
                className="w-full h-full shrink-0 snap-start snap-always relative flex items-center justify-center bg-ink"
              >
                {/* Vertical video player container */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <VideoPlayer
                    src={video.url}
                    poster={video.poster || project.coverImage}
                    title=""
                  />

                  {/* Overlays / Info Side Panel */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/55 to-transparent flex flex-col gap-3 pointer-events-none z-10">
                    <div className="pointer-events-auto">
                      <span className="eyebrow bg-signal-gold text-ink font-bold text-[9px] px-2.5 py-1 tracking-widest inline-block uppercase">
                        {project.category}
                      </span>
                      <h3 className="font-display text-lg font-bold text-white mt-2 leading-tight">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-paper/70 mt-1 font-sans">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-signal-gold" /> {project.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-signal-gold" /> {project.location}
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp CTA specifically for this video style */}
                    <div className="flex gap-2 pt-2 pointer-events-auto">
                      <WhatsAppButton
                        message={`Hi Lumen & Frame, I saw your video "${project.title}" on your reels feed and would like to enquire about similar packages.`}
                        variant="inline"
                        label="Enquire about this style"
                        className="flex-1 text-[10px] py-2.5 font-bold tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Swipe indicator */}
      <div className="text-[10px] font-mono text-paper/40 py-3 pointer-events-none md:hidden select-none">
        ▲ Swipe Up / Down for More Videos ▲
      </div>
    </div>
  );
}
