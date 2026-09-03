import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById, adminSaveProject } from "../services/projectsService";
import Loader from "../components/Loader";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";

const categories = [
  "Personal Reels",
  "Events",
  "Car/Bike Delivery",
  "Business/Marketing",
  "Promotional Content"
];

const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white";

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal Reels");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProjectById(id).then((p) => {
        setLoading(false);
        if (p) {
          setTitle(p.title);
          setCategory(p.category || "Personal Reels");
          setClient(p.client);
          setLocation(p.location);
          setDate(p.date);
          setDescription(p.description);
          setCoverImage(p.coverImage);
          setGalleryInput(p.gallery?.join("\n") || "");
          if (p.videos && p.videos.length > 0) {
            setVideoTitle(p.videos[0].title);
            setVideoUrl(p.videos[0].url);
          }
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const gallery = galleryInput
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const videos = videoUrl
      ? [{ type: "main", title: videoTitle || "Project Film", url: videoUrl }]
      : [];

    const payload = {
      id,
      title,
      category,
      client,
      location,
      date,
      description,
      coverImage,
      gallery,
      videos,
      published: true
    };

    await adminSaveProject(payload);
    setLoading(false);
    navigate("../portfolio");
  };

  if (loading) return <Loader label="Saving project details" />;

  return (
    <div className="p-8 max-w-4xl flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("../portfolio")}
          className="text-slate-soft hover:text-ink transition-colors p-2 border border-slate/10"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">
            {id ? "Edit Portfolio Item" : "Create Portfolio Item"}
          </h1>
          <p className="text-slate-soft text-sm">Fill in the fields to configure the project details and links.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate/10 p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Nellai Cafe Sensory Reel"
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Client, Location, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Client Name *</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={inputClass}
              placeholder="e.g. Yamaha Nellai"
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Shoot Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              placeholder="e.g. Palayamkottai, Tirunelveli"
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Shoot Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Description Narrative *</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            placeholder="Share details of the equipment used, transitions style, exhaust sound design, or campaign outcome..."
            required
          />
        </div>

        {/* Media Cover Image URL */}
        <div>
          <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Cover Image URL *</label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className={inputClass}
            placeholder="https://images.unsplash.com/photo-..."
            required
          />
        </div>

        {/* Media Video Embed Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-mist/20 border border-slate/10">
          <div className="col-span-2">
            <h4 className="font-display text-sm font-bold text-ink mb-1">Attached Video URL (Supports YouTube / Vimeo)</h4>
            <p className="text-[10px] text-slate-soft">Add video links to activate video indicators and embeds in the gallery details screen.</p>
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Video Link / URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={inputClass}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Video Title Label</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. R15 delivery edit"
            />
          </div>
        </div>

        {/* Photo Gallery list */}
        <div>
          <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Photo Slides / Gallery URLs (one per line)</label>
          <textarea
            rows={4}
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            className={`${inputClass} font-mono text-xs`}
            placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate/10">
          <button
            type="submit"
            className="eyebrow bg-studio-blue text-paper px-6 py-4 hover:bg-ink text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg shadow-studio-blue/15 cursor-pointer"
          >
            <Save size={14} /> Save Project Details
          </button>
          <button
            type="button"
            onClick={() => navigate("../portfolio")}
            className="eyebrow border border-slate/20 text-slate-soft px-6 py-4 hover:bg-slate-50 transition-colors text-xs font-bold tracking-wider cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
