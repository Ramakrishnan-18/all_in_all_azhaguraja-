import { useEffect, useState } from "react";
import { adminGetTestimonials, adminSaveTestimonial, adminDeleteTestimonial } from "../services/testimonialsService";
import Loader from "../components/Loader";
import { Edit3, Trash2, Plus, Save, X, Star } from "lucide-react";

const inputClass = "w-full border border-slate/20 px-3 py-2 text-xs outline-none focus:border-studio-blue bg-white";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientImage, setClientImage] = useState("");
  const [review, setReview] = useState("");
  const [project, setProject] = useState("");
  const [rating, setRating] = useState(5);

  const load = () => adminGetTestimonials().then(setTestimonials).catch(() => setTestimonials([]));
  useEffect(() => { load(); }, []);

  if (!testimonials) return <Loader label="Loading reviews" />;

  const startEdit = (t) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setClientImage(t.clientImage || "");
    setReview(t.review);
    setProject(t.project);
    setRating(t.rating);
  };

  const startAdd = () => {
    setEditingId("new");
    setClientName("");
    setClientImage("");
    setReview("");
    setProject("");
    setRating(5);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId === "new" ? undefined : editingId,
      clientName,
      clientImage: clientImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      review,
      project,
      rating: Number(rating),
      date: new Date().toISOString().split("T")[0]
    };

    await adminSaveTestimonial(payload);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    await adminDeleteTestimonial(id);
    load();
  };

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Client Reviews</h1>
          <p className="text-slate-soft text-sm">Add and monitor client reviews featured on the testimonials section.</p>
        </div>
        {!editingId && (
          <button
            onClick={startAdd}
            className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
          >
            <Plus size={13} /> Add Review
          </button>
        )}
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
          <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
            {editingId === "new" ? "New Review Details" : "Edit Review Details"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Client Name *</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Client Image URL</label>
              <input type="url" value={clientImage} onChange={(e) => setClientImage(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Shoot / Project Title *</label>
              <input type="text" value={project} onChange={(e) => setProject(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Rating (Stars) *</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)} className={inputClass} required>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
          </div>

          <div>
            <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Review Text *</label>
            <textarea rows={3} value={review} onChange={(e) => setReview(e.target.value)} className={inputClass} required />
          </div>

          <div className="flex gap-2.5">
            <button type="submit" className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider">
              <Save size={12} className="inline mr-1" /> Save Review
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider">
              <X size={12} className="inline mr-1" /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-signal-gold mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-current" />
                ))}
              </div>
              <p className="text-slate-soft text-xs italic leading-relaxed mb-4">“{t.review}”</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate/5">
              <div className="flex items-center gap-2.5">
                <img
                  src={t.clientImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"}
                  alt={t.clientName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div>
                  <h4 className="font-display font-bold text-xs text-ink leading-none">{t.clientName}</h4>
                  <span className="text-[9px] text-slate-soft font-mono mt-0.5 leading-none block">{t.project}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => startEdit(t)}
                  className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10"
                  title="Edit Review"
                >
                  <Edit3 size={11} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10"
                  title="Delete Review"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
