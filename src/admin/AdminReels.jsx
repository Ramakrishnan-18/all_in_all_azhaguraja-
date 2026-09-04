import { useEffect, useState, useRef } from "react";
import { adminGetReels, adminSaveReel, adminDeleteReel } from "../services/reelsService";
import { uploadFile } from "../services/uploadService";
import Loader from "../components/Loader";
import { Plus, Trash2, Search, MapPin, User, Play, Save, X, AlertTriangle, Upload, Film, ImageIcon, Edit3 } from "lucide-react";

const categories = [
  "Personal Reels",
  "Events",
  "Car/Bike Delivery",
  "Business/Marketing"
];

const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white";

const emptyForm = {
  title: "",
  category: "Personal Reels",
  client: "",
  location: "",
  videoFile: "",
  poster: ""
};

export default function AdminReels() {
  const [reels, setReels] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const load = () => adminGetReels().then(setReels).catch(() => setReels([]));

  useEffect(() => { load(); }, []);

  if (!reels) return <Loader label="Loading reels" />;

  const refresh = async () => { await load(); };

  const handlePublishToggle = async (r) => {
    const nextVal = r.published === false;
    await adminSaveReel({ ...r, published: nextVal });
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this reel? This will permanently remove it.")) return;
    await adminDeleteReel(id);
    refresh();
  };

  const handleEdit = (r) => {
    setForm({
      title: r.title || "",
      category: r.category || "Personal Reels",
      client: r.client || "",
      location: r.location || "",
      videoFile: r.videoFile || "",
      poster: r.poster || "",
    });
    setEditingId(r._id || r.id);
    setShowForm(true);
    setError("");
    setUploadProgress("");
  };

  const handleInput = (field) => (e) => {
    setError("");
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("video/")) { setError("Please select a video file (MP4, MOV)."); return; }
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file must be under 100MB.");
      return;
    }
    setUploading(true);
    setUploadProgress("Uploading to Cloudinary...");
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, videoFile: url }));
      setUploadProgress("Upload complete!");
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (err) {
      setError("Video upload failed. Check Cloudinary keys.");
      setUploadProgress("");
    } finally { setUploading(false); }
  };

  const handleCoverSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    setUploadingCover(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, poster: url }));
    } catch { setError("Cover upload failed. Check Cloudinary."); } finally { setUploadingCover(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.videoFile) {
      setError("Please upload a video file.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await adminSaveReel({ ...form, _id: editingId });
      } else {
        await adminSaveReel({ ...form });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save reel.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = reels.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.client && r.client.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Reels</h1>
          <p className="text-slate-soft text-sm">Upload and manage the vertical video reels shown on the public reels page.</p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); setEditingId(null); setForm(emptyForm); setError(""); setUploadProgress(""); }}
          className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
        >
          {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add Reel</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate/10 p-6 md:p-8 flex flex-col gap-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Video File (MP4, MOV — max 100MB) *</label>
              <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleFileSelect} className="hidden" />
              {form.videoFile ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200">
                  <Film size={16} className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 font-semibold truncate">{form.videoFile.split("/").pop()}</p>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] text-green-700 underline">Change video</button>
                  </div>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, videoFile: "" }))} className="text-green-600 hover:text-red-600"><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full border-2 border-dashed border-slate/25 hover:border-studio-blue p-6 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50">
                  <Upload size={22} className={uploading ? "text-studio-blue animate-bounce" : "text-slate/30"} />
                  <span className="text-xs font-semibold text-ink">{uploading ? "Uploading..." : "Upload Video"}</span>
                  <span className="text-[10px] text-slate-soft">MP4, MOV, WebM — max 100MB</span>
                </button>
              )}
              {uploadProgress && <p className={`text-[10px] mt-1 ${uploadProgress.includes("complete") ? "text-green-600" : "text-studio-blue"}`}>{uploadProgress}</p>}
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Cover Photo (optional)</label>
              <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleCoverSelect} className="hidden" />
              {form.poster ? (
                <div className="border border-green-200 bg-green-50 p-2 flex items-center gap-2">
                  <img src={form.poster} alt="cover" className="w-12 h-12 object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 font-semibold truncate">{form.poster.split("/").pop()}</p>
                    <button type="button" onClick={() => coverInputRef.current?.click()} className="text-[10px] text-green-700 underline">Change cover</button>
                  </div>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, poster: "" }))} className="text-green-600 hover:text-red-600"><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover} className="w-full border-2 border-dashed border-slate/25 hover:border-studio-blue p-6 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50">
                  <ImageIcon size={22} className={uploadingCover ? "text-studio-blue animate-pulse" : "text-slate/30"} />
                  <span className="text-xs font-semibold text-ink">{uploadingCover ? "Uploading..." : "Upload Cover"}</span>
                  <span className="text-[10px] text-slate-soft">JPG, PNG, WEBP</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Reel Title *</label>
              <input type="text" value={form.title} onChange={handleInput("title")} className={inputClass} placeholder="e.g. R15 V4 Delivery Thrill" required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Category *</label>
              <select value={form.category} onChange={handleInput("category")} className={inputClass} required>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Client Name *</label>
              <input type="text" value={form.client} onChange={handleInput("client")} className={inputClass} placeholder="e.g. Sudhakar S." required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Location *</label>
              <input type="text" value={form.location} onChange={handleInput("location")} className={inputClass} placeholder="e.g. Vannarpettai, Tirunelveli" required />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <AlertTriangle size={12} /> {error}
            </p>
          )}

          <div className="flex gap-4 pt-2 border-t border-slate/10">
            <button
              type="submit"
              disabled={saving || uploading || !form.videoFile}
              className="eyebrow bg-studio-blue text-paper px-6 py-4 hover:bg-ink text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg shadow-studio-blue/15 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save Reel"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); setError(""); setUploadProgress(""); }}
              className="eyebrow border border-slate/20 text-slate-soft px-6 py-4 hover:bg-slate-50 transition-colors text-xs font-bold tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate/10 p-4 flex gap-4 items-center shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by title, category, client, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate/20 outline-none focus:border-studio-blue bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-slate-soft/50" size={14} />
        </div>
        <span className="text-[10px] font-mono text-slate-soft ml-auto">{filtered.length} reel(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate/10 shadow-sm flex flex-col items-center">
          <p className="text-slate-soft font-medium">No reels found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white border border-slate/10 overflow-hidden shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[9/16] bg-slate overflow-hidden">
                {r.poster ? (
                  <img src={r.poster} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                ) : r.videoFile ? (
                  <video src={r.videoFile} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 flex items-center justify-center">
                    <Play size={28} className="text-signal-gold/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-signal-gold/90 text-ink flex items-center justify-center shadow-xl">
                    <Play size={16} className="fill-current translate-x-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 z-10">
                  <span className="eyebrow bg-ink/90 backdrop-blur-sm text-signal-gold text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                    {r.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-ink line-clamp-2 leading-tight">{r.title}</h3>
                  {r.client && <p className="text-[10px] text-slate-soft/80 font-mono mt-1 flex items-center gap-1"><User size={9} /> {r.client}</p>}
                  {r.location && <p className="text-[10px] text-slate-soft/80 font-mono mt-0.5 flex items-center gap-1"><MapPin size={9} /> {r.location}</p>}
                </div>

                <div className="pt-3 border-t border-slate/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.published !== false}
                      onChange={() => handlePublishToggle(r)}
                      className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                      id={`pub-${r.id}`}
                    />
                    <label htmlFor={`pub-${r.id}`} className="text-[10px] font-mono text-slate-soft/85 uppercase cursor-pointer select-none">
                      {r.published !== false ? "Published" : "Hidden"}
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 hover:border-studio-blue/30 cursor-pointer"
                      title="Edit Reel"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 hover:border-red-200"
                      title="Delete Reel"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
