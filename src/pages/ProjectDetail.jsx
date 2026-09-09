import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, User, ChevronRight } from "lucide-react";
import { getProjectById, getProjects } from "../services/projectsService";
import { formatDate } from "../utils/format";
import VideoPlayer from "../components/VideoPlayer";
import Lightbox from "../components/Lightbox";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setProject(undefined);
    window.scrollTo(0, 0);

    getProjectById(id).then((p) => {
      setProject(p);
      if (p) {
        // Find related works in the same category
        getProjects().then((all) => {
          const filtered = all.filter((proj) => proj.category === p.category && proj.id !== p.id);
          setRelated(filtered.slice(0, 2));
        });
      }
    });
  }, [id]);

  useSEO({
    title: project ? `${project.title} | Case Study` : "Project Details",
    description: project ? project.description : "Details of our cinematic captures.",
    keywords: project ? `${project.category}, ${project.location}, portfolio details` : ""
  });

  if (project === undefined) return <Loader label="Loading showcase project" />;
  if (project === null) {
    return (
      <div className="min-h-screen bg-ink text-paper flex flex-col justify-center items-center p-6 text-center">
        <p className="text-xl font-bold text-signal-gold mb-4">Project Not Found</p>
        <Link to="/portfolio" className="eyebrow border border-signal-gold text-signal-gold px-6 py-3 font-bold text-xs uppercase tracking-wider">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen text-ink pb-24 font-sans">
      {/* Cinematic Hero */}
      <section className="relative h-[55vh] min-h-[400px] w-full bg-ink select-none overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-paper" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10 max-w-[1400px] mx-auto pb-12 relative z-10">
          <Link to="/portfolio" className="eyebrow text-white/70 hover:text-signal-gold flex items-center gap-1.5 text-xs mb-6 w-max transition-colors">
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
          <span className="eyebrow text-signal-gold font-bold text-[9px] tracking-[0.2em] mb-3 uppercase">
            {project.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-tight uppercase tracking-tight max-w-4xl">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Case Details Block */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Meta sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate/10 p-6 md:p-8 flex flex-col gap-6 shadow-sm h-max">
          <div className="flex items-center gap-3">
            <User size={16} className="text-studio-blue shrink-0" />
            <div>
              <p className="eyebrow text-slate-soft text-[9px] font-bold">CLIENT</p>
              <p className="text-sm font-semibold text-ink">{project.client}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-studio-blue shrink-0" />
            <div>
              <p className="eyebrow text-slate-soft text-[9px] font-bold">DATE</p>
              <p className="text-sm font-semibold text-ink">{formatDate(project.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-studio-blue shrink-0" />
            <div>
              <p className="eyebrow text-slate-soft text-[9px] font-bold">SHOOT LOCATION</p>
              <p className="text-sm font-semibold text-ink">{project.location}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate/10 flex flex-col gap-2.5">
            <WhatsAppButton
              message={`Hi All in All Azhaguraja, I saw your project details for "${project.title}" and would like to enquire about pricing details.`}
              variant="inline"
              label="WhatsApp Enquire Style"
              className="text-[10px] py-3.5 font-bold tracking-wider w-full text-center"
            />
            <Link
              to={`/contact?service=${encodeURIComponent(project.category)}`}
              className="eyebrow text-center bg-ink hover:bg-studio-blue text-white py-3 px-5 transition-colors text-[10px] font-bold tracking-wider"
            >
              Book Similar Shoot
            </Link>
          </div>
        </div>

        {/* Narrative & Media */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <div>
            <h3 className="eyebrow text-studio-blue text-[10px] font-bold mb-4 tracking-widest">ABOUT THE PROJECT</h3>
            <p className="text-slate-soft text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Videos Grid */}
          {project.videos && project.videos.length > 0 && (
            <div>
              <h3 className="eyebrow text-studio-blue text-[10px] font-bold mb-5 tracking-widest">CINEMATIC SHOTS</h3>
              <div className="flex flex-col gap-6">
                {project.videos.map((v, i) => (
                  <div key={i} className="shadow-lg border border-slate/10">
                    <VideoPlayer src={v.url} poster={v.poster || project.coverImage} title={v.title} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Grid */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h3 className="eyebrow text-studio-blue text-[10px] font-bold mb-5 tracking-widest">PHOTO SNAPSHOTS</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-[4/3] bg-slate overflow-hidden group border border-slate/10 cursor-zoom-in"
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Projects Block */}
      {related.length > 0 && (
        <section className="bg-mist/20 py-20 px-6 lg:px-10 border-t border-slate/10">
          <div className="max-w-[1400px] mx-auto">
            <h3 className="eyebrow text-studio-blue text-[10px] font-bold mb-10 tracking-widest text-center">
              EXPLORE RELATED WORK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/portfolio/${r.id}`}
                  className="bg-white border border-slate/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-40 aspect-video md:aspect-square bg-slate shrink-0 relative overflow-hidden">
                    <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
                  </div>
                  <div className="p-5 flex flex-col justify-center gap-1.5">
                    <span className="text-[8px] eyebrow text-studio-blue font-bold tracking-widest uppercase">{r.category}</span>
                    <h4 className="font-display font-bold text-sm text-ink group-hover:text-studio-blue transition-colors line-clamp-1">{r.title}</h4>
                    <p className="text-slate-soft text-xs line-clamp-2 leading-relaxed">{r.description}</p>
                    <span className="text-[10px] eyebrow text-studio-blue-deep font-bold tracking-wider mt-2 flex items-center gap-1">
                      View Project <ChevronRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        images={project.gallery || []}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
