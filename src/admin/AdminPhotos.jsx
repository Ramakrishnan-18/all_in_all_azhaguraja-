import { useEffect, useState, useRef } from "react";
import { adminGetPhotos, adminSavePhoto, adminDeletePhoto } from "../services/photosService";
import { uploadFile } from "../services/uploadService";
import Loader from "../components/Loader";
import { Plus, Trash2, Search, MapPin, Calendar, Save, X, UploadCloud, Edit3 } from "lucide-react";

const categories = [
  "Weddings",
  "Portraits",
  "Events",
  "Commercial",
  "Food",
  "Car & Bike"
];

const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white";

const emptyForm = {
  title: "",
  category: "Portraits",
  url: "",
  location: "",
  date: ""
};

export default function AdminPhotos() {
  const [photos, setPhotos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const fileInputRef = useRef(null);

  const load = () => adminGetPhotos().then(setPhotos).catch(() => setPhotos([]));

  useEffect(() => { load(); }, []);

  if (!photos) return <Loader label="Loading photo gallery" />;

  const refresh = async () => {
    await load();
  };

  const handlePublishToggle = async (p) => {
    const nextVal = p.published === false;
    await adminSavePhoto({ ...p, published: nextVal });
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this photo? This will permanently remove it from the gallery.")) return;
    await adminDeletePhoto(id);
    refresh();
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title || "",
      category: p.category || "Portraits",
      url: p.url || "",
      location: p.location || "",
      date: p.date || "",
      fileName: "",
    });
    setEditingId(p._id || p.id);
    setShowForm(true);
    setUploadErr("");
  };

  const handleInput = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, url, fileName: file.name }));
    } catch (err) {
      setUploadErr("Upload failed. Please try another image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await adminSavePhoto({ ...form, _id: editingId });
    } else {
      await adminSavePhoto({ ...form });
    }
    setSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
    refresh();
  };

  const filtered = photos.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Photo Gallery</h1>
          <p className="text-slate-soft text-sm">Add and manage the still photography shown on the public gallery page.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setEditingId(null);
            setForm(emptyForm);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
        >
          {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add Photo</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate/10 p-6 md:p-8 flex flex-col gap-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Photo Title *</label>
              <input type="text" value={form.title} onChange={handleInput("title")} className={inputClass} placeholder="e.g. Golden Hour Portrait" required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Category *</label>
              <select value={form.category} onChange={handleInput("category")} className={inputClass} required>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Photo *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              {form.url ? (
                <div className="flex items-start gap-4 border border-slate/10 p-3">
                  <img src={form.url} alt="Preview" className="w-28 h-20 object-cover border border-slate/10" />
                  <div className="flex flex-col gap-2 justify-center">
                    <p className="text-xs text-slate-soft break-all">{form.fileName || "Selected image"}</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="eyebrow border border-slate/20 text-slate-soft px-3 py-2 hover:bg-slate-50 transition-colors text-[10px] font-bold tracking-wider cursor-pointer w-fit"
                    >
                      Choose different
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                  className="w-full border border-dashed border-slate/30 py-10 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-studio-blue transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <UploadCloud className="text-slate-soft/70" size={28} />
                  <span className="text-[11px] font-bold text-slate-soft tracking-wide">
                    {uploading ? "Uploading image…" : "Click to upload from your device"}
                  </span>
                  <span className="text-[10px] text-slate-soft/60 font-mono">PNG, JPG, WEBP — max 5MB</span>
                </button>
              )}
              {uploadErr && (
                <p className="text-xs text-red-600 mt-2">{uploadErr}</p>
              )}
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Location *</label>
              <input type="text" value={form.location} onChange={handleInput("location")} className={inputClass} placeholder="e.g. Palayamkottai, Tirunelveli" required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Shoot Date *</label>
              <input type="date" value={form.date} onChange={handleInput("date")} className={inputClass} required />
            </div>
          </div>
          <div className="flex gap-4 pt-2 border-t border-slate/10">
            <button
              type="submit"
              disabled={saving}
              className="eyebrow bg-studio-blue text-paper px-6 py-4 hover:bg-ink text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg shadow-studio-blue/15 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save Photo"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="eyebrow border border-slate/20 text-slate-soft px-6 py-4 hover:bg-slate-50 transition-colors text-xs font-bold tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Toolbar */}
      <div className="bg-white border border-slate/10 p-4 flex gap-4 items-center shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by title, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate/20 outline-none focus:border-studio-blue bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-slate-soft/50" size={14} />
        </div>
        <span className="text-[10px] font-mono text-slate-soft ml-auto">{filtered.length} photo(s)</span>
      </div>

      {/* Photos grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate/10 shadow-sm flex flex-col items-center">
          <p className="text-slate-soft font-medium">No photos found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-slate/10 overflow-hidden shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[4/3] bg-slate overflow-hidden">
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="eyebrow bg-ink text-signal-gold text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                    {p.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-ink line-clamp-1 leading-tight">{p.title}</h3>
                  <p className="text-[10px] text-slate-soft/80 font-mono mt-1 flex items-center gap-1"><MapPin size={9} /> {p.location}</p>
                  {p.date && <p className="text-[10px] text-slate-soft/80 font-mono mt-0.5 flex items-center gap-1"><Calendar size={9} /> {p.date}</p>}
                </div>

                <div className="pt-4 border-t border-slate/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.published !== false}
                      onChange={() => handlePublishToggle(p)}
                      className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                      id={`pub-${p.id}`}
                    />
                    <label htmlFor={`pub-${p.id}`} className="text-[10px] font-mono text-slate-soft/85 uppercase cursor-pointer select-none">
                      {p.published !== false ? "Published" : "Hidden"}
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 hover:border-studio-blue/30 cursor-pointer"
                      title="Edit Photo"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 hover:border-red-200"
                      title="Delete Photo"
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
