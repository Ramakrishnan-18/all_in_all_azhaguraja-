import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetProjects, adminSaveProject, adminDeleteProject } from "../services/projectsService";
import Loader from "../components/Loader";
import { Plus, Edit3, Trash2, Search, Video, Image } from "lucide-react";

export default function AdminProjects() {
  const [projects, setProjects] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const load = () => adminGetProjects().then(setProjects).catch(() => setProjects([]));

  useEffect(() => { load(); }, []);

  if (!projects) return <Loader label="Loading portfolio records" />;

  const handlePublishToggle = async (p) => {
    const nextVal = !p.published;
    await adminSaveProject({ ...p, published: nextVal });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project? This will permanently remove it from the database.")) return;
    await adminDeleteProject(id);
    load();
  };

  // Search logic
  const filtered = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Portfolio Items</h1>
          <p className="text-slate-soft text-sm">Upload images/videos and configure metadata for the cinematic gallery.</p>
        </div>
        <Link
          to="add"
          className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
        >
          <Plus size={13} /> Add Project
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate/10 p-4 flex gap-4 items-center shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by title, client, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate/20 outline-none focus:border-studio-blue bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-slate-soft/50" size={14} />
        </div>
      </div>

      {/* Projects list grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate/10 shadow-sm flex flex-col items-center">
          <p className="text-slate-soft font-medium">No portfolio items found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const hasVideo = p.videos && p.videos.length > 0;
            return (
              <div key={p.id} className="bg-white border border-slate/10 overflow-hidden shadow-sm flex flex-col justify-between group">
                <div className="relative aspect-video bg-slate overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className="eyebrow bg-ink text-signal-gold text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                      {p.category}
                    </span>
                    {hasVideo ? (
                      <span className="bg-studio-blue text-white p-1 flex items-center justify-center rounded-none shadow-md">
                        <Video size={10} />
                      </span>
                    ) : (
                      <span className="bg-slate-700 text-white p-1 flex items-center justify-center rounded-none shadow-md">
                        <Image size={10} />
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink line-clamp-1 leading-tight">{p.title}</h3>
                    <p className="text-[10px] text-slate-soft/80 font-mono mt-1">Client: {p.client}</p>
                    <p className="text-slate-soft text-xs line-clamp-2 leading-relaxed mt-2">{p.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate/5 flex items-center justify-between mt-auto">
                    {/* Status switch */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.published !== false}
                        onChange={() => handlePublishToggle(p)}
                        className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                        id={`pub-${p.id}`}
                      />
                      <label htmlFor={`pub-${p.id}`} className="text-[10px] font-mono text-slate-soft/85 uppercase cursor-pointer select-none">
                        {p.published !== false ? "Published" : "Draft"}
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={`edit/${p.id}`}
                        className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 hover:border-studio-blue/20"
                        title="Edit Project"
                      >
                        <Plus size={12} className="inline mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 hover:border-red-200"
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
