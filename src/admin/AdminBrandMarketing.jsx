import { useEffect, useState, useRef } from "react";
import { adminGetBrandMarketing, adminSaveBrandMarketing, adminDeleteBrandMarketing } from "../services/brandMarketingService";
import { uploadFile } from "../services/uploadService";
import Loader from "../components/Loader";
import { Edit3, Trash2, Plus, Save, X, Video, Upload, ImageIcon, Film } from "lucide-react";

const inputClass = "w-full border border-slate/20 px-3 py-2 text-xs outline-none focus:border-studio-blue bg-white";

export default function AdminBrandMarketing() {
  const [campaigns, setCampaigns] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const load = () => adminGetBrandMarketing().then(setCampaigns).catch(() => setCampaigns([]));
  useEffect(() => { load(); }, []);

  if (!campaigns) return <Loader label="Loading brand campaigns" />;

  const startEdit = (c) => {
    setEditingId(c.id);
    setBrandName(c.brandName);
    setTagline(c.tagline);
    setDescription(c.description);
    setImage(c.image);
    setVideoUrl(c.videoUrl);
  };

  const startAdd = () => {
    setEditingId("new");
    setBrandName("");
    setTagline("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop");
    setVideoUrl("");
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    setUploadingImage(true);
    try {
      const url = await uploadFile(file);
      setImage(url);
    } catch { alert("Image upload failed. Check Cloudinary."); } finally { setUploadingImage(false); }
  };

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { alert("Please select a video file."); return; }
    if (file.size > 100 * 1024 * 1024) { alert("Video must be under 100MB."); return; }
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file);
      setVideoUrl(url);
    } catch { alert("Video upload failed. Check Cloudinary."); } finally { setUploadingVideo(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!image) { alert("Please upload a cover image."); return; }
    if (!videoUrl) { alert("Please upload a video."); return; }
    const payload = {
      id: editingId === "new" ? undefined : editingId,
      brandName,
      tagline,
      description,
      image,
      videoUrl
    };

    await adminSaveBrandMarketing(payload);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand marketing campaign?")) return;
    await adminDeleteBrandMarketing(id);
    load();
  };

  const handleToggle = async (c) => {
    const nextVal = !c.enabled;
    await adminSaveBrandMarketing({ ...c, enabled: nextVal });
    load();
  };

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Brand Marketing Manager</h1>
          <p className="text-slate-soft text-sm">Upload campaign videos and text details for showroom &amp; business partnerships.</p>
        </div>
        {!editingId && (
          <button
            onClick={startAdd}
            className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
          >
            <Plus size={13} /> Add Campaign
          </button>
        )}
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
          <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
            {editingId === "new" ? "New Campaign Details" : "Edit Campaign Details"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Brand Client Name *</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className={inputClass} placeholder="e.g. Nellai Cafe" required />
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Campaign Tagline *</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} placeholder="e.g. Sensory Macro Commercial" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Cover Image *</label>
              <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleImageSelect} className="hidden" />
              {image ? (
                <div className="border border-green-200 bg-green-50 p-3 flex items-center gap-3">
                  <img src={image} alt="preview" className="w-14 h-14 object-cover shrink-0 border border-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 font-semibold truncate">{image.split("/").pop()}</p>
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="text-[10px] text-green-700 underline">Change image</button>
                  </div>
                  <button type="button" onClick={() => setImage("")} className="text-green-600 hover:text-red-600"><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="w-full border-2 border-dashed border-slate/25 hover:border-studio-blue p-5 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50">
                  <ImageIcon size={20} className={uploadingImage ? "text-studio-blue animate-pulse" : "text-slate/30"} />
                  <span className="text-xs font-semibold text-ink">{uploadingImage ? "Uploading..." : "Upload Cover Image"}</span>
                  <span className="text-[10px] text-slate-soft">JPG, PNG, WEBP</span>
                </button>
              )}
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Campaign Video *</label>
              <input ref={videoInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideoSelect} className="hidden" />
              {videoUrl ? (
                <div className="border border-green-200 bg-green-50 p-3 flex items-center gap-3">
                  <Film size={18} className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-700 font-semibold truncate">{videoUrl.split("/").pop()}</p>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="text-[10px] text-green-700 underline">Change video</button>
                  </div>
                  <button type="button" onClick={() => setVideoUrl("")} className="text-green-600 hover:text-red-600"><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => videoInputRef.current?.click()} disabled={uploadingVideo} className="w-full border-2 border-dashed border-slate/25 hover:border-studio-blue p-5 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50">
                  <Upload size={20} className={uploadingVideo ? "text-studio-blue animate-pulse" : "text-slate/30"} />
                  <span className="text-xs font-semibold text-ink">{uploadingVideo ? "Uploading..." : "Upload Video"}</span>
                  <span className="text-[10px] text-slate-soft">MP4, MOV — max 100MB</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Campaign Description (1-2 lines detail) *</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} required />
          </div>

          <div className="flex gap-2.5">
            <button type="submit" className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider">
              <Save size={12} className="inline mr-1" /> Save Campaign
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider">
              <X size={12} className="inline mr-1" /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white border border-slate/10 overflow-hidden shadow-sm flex flex-col justify-between group">
            <div className="relative aspect-video bg-slate overflow-hidden">
              <img src={c.image} alt={c.brandName} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <span className="eyebrow bg-ink text-signal-gold text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
                  Campaign
                </span>
                <span className="bg-studio-blue text-white p-1 flex items-center justify-center rounded-none shadow-md">
                  <Video size={10} />
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-ink line-clamp-1 leading-tight">{c.brandName}</h3>
                <p className="text-[10px] text-slate-soft/80 font-mono mt-1">{c.tagline}</p>
                <p className="text-slate-soft text-xs line-clamp-2 leading-relaxed mt-2">{c.description}</p>
              </div>

              <div className="pt-4 border-t border-slate/5 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={c.enabled !== false}
                    onChange={() => handleToggle(c)}
                    className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                    id={`c-status-${c.id}`}
                  />
                  <label htmlFor={`c-status-${c.id}`} className="text-[10px] font-mono text-slate-soft/85 uppercase cursor-pointer select-none">
                    {c.enabled !== false ? "Active" : "Disabled"}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 hover:border-studio-blue/20"
                    title="Edit Campaign"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 hover:border-red-200"
                    title="Delete Campaign"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
