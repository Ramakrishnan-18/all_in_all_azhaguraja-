import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Play } from "lucide-react";
import { formatDate } from "../utils/format";

export default function ProjectCard({ project, index = 0 }) {
  const hasVideo = project.videos && project.videos.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.05 }}
    >
      <Link to={`/portfolio/${project.id}`} className="group block select-none">
        <div className="relative overflow-hidden aspect-[4/3] bg-slate">
          {/* Cover image */}
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="eyebrow bg-ink/90 text-signal-gold text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase border border-signal-gold/20">
              {project.category}
            </span>
          </div>

          {/* Play Icon Indicator if Video project */}
          {hasVideo && (
            <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-signal-gold text-ink flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play size={10} className="fill-current translate-x-0.5" />
            </div>
          )}

          {/* Hover Details Panel */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-end gap-3 text-white">
              <div>
                <h3 className="font-display text-lg font-bold leading-tight group-hover:text-signal-gold transition-colors">
                  {project.title}
                </h3>
                <p className="text-[10px] text-paper/60 font-mono mt-1 flex items-center gap-1">
                  <MapPin size={10} className="text-signal-gold" /> {project.location}
                </p>
              </div>
              <span className="shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-signal-gold group-hover:text-signal-gold transition-colors opacity-0 group-hover:opacity-100 duration-300">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Details */}
        <div className="flex justify-between items-center mt-3 text-xs border-t border-slate/5 pt-2">
          <p className="font-mono text-slate-soft/75 text-[9px] uppercase">Client: <strong className="text-ink">{project.client || "Local Capture"}</strong></p>
          <p className="text-slate-soft/50 text-[9px] font-mono">{formatDate(project.date)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
