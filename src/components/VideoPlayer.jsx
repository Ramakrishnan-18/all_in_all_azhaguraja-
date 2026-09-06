import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoPlayer({ src, poster, title = "" }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [hasLoaded, setHasLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Determine media provider details
  const isYouTube = src?.includes("youtube.com") || src?.includes("youtu.be");
  const isVimeo = src?.includes("vimeo.com");

  // YouTube ID extractor
  const getYTId = (url) => {
    if (!url) return "";
    const reg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(reg);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Vimeo ID extractor
  const getVimeoId = (url) => {
    if (!url) return "";
    const reg = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(reg);
    return match && match[3] ? match[3] : "";
  };

  const handlePlayClick = () => {
    setHasLoaded(true);
    setPlaying(true);
  };

  useEffect(() => {
    if (hasLoaded && !isYouTube && !isVimeo && videoRef.current) {
      if (playing) {
        videoRef.current.play().catch(() => setPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing, hasLoaded, isYouTube, isVimeo]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setPlaying((prev) => !prev);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
  };

  // Standard premium poster screen before user interactions
  if (!hasLoaded) {
    return (
      <div
        onClick={handlePlayClick}
        className="relative w-full aspect-video bg-black cursor-pointer group overflow-hidden border border-white/5 shadow-md flex items-center justify-center select-none"
      >
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-zinc-950 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />
        
        {/* Cinematic play button overlay */}
        <div className="relative z-10 w-16 h-16 rounded-full border border-signal-gold bg-ink/90 group-hover:bg-signal-gold group-hover:text-ink text-signal-gold flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg">
          <Play size={24} className="fill-current translate-x-0.5" />
        </div>

        {title && (
          <div className="absolute bottom-4 left-4 z-10 eyebrow text-white text-[10px] tracking-widest bg-ink/75 px-3 py-1 font-bold">
            {title}
          </div>
        )}
      </div>
    );
  }

  // YouTube Player Embed
  if (isYouTube) {
    const ytId = getYTId(src);
    return (
      <div ref={containerRef} className="relative w-full aspect-video bg-black shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&rel=0&showinfo=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  // Vimeo Player Embed
  if (isVimeo) {
    const vimeoId = getVimeoId(src);
    return (
      <div ref={containerRef} className="relative w-full aspect-video bg-black shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&badge=0&autopause=0&player_id=0&app_id=58479`}
          title={title}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  // Native HTML5 Player
  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className="relative w-full aspect-video bg-black group overflow-hidden border border-white/5 shadow-lg"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 opacity-100 group-hover:opacity-100 transition-opacity" />

      {/* Control Overlays */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white z-20 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="hover:text-signal-gold transition-colors cursor-pointer"
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
          </button>
          <button
            onClick={toggleMute}
            className="hover:text-signal-gold transition-colors cursor-pointer"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
        <button
          onClick={toggleFullscreen}
          className="hover:text-signal-gold transition-colors cursor-pointer"
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
