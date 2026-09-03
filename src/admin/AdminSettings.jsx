import { useEffect, useState } from "react";
import { getSettings, adminUpdateSettings } from "../services/settingsService";
import Loader from "../components/Loader";
import { Settings, Save, CheckCircle, Info } from "lucide-react";

const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white font-sans";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [success, setSuccess] = useState(false);

  // Individual states
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [location, setLocation] = useState("");
  const [workingHours, setWorkingHours] = useState("");

  const load = () => {
    getSettings().then((data) => {
      setSettings(data);
      setBrandName(data.brandName);
      setTagline(data.tagline);
      setContactPhone(data.contactPhone);
      setContactWhatsApp(data.contactWhatsApp);
      setContactEmail(data.contactEmail);
      setInstagramUrl(data.instagramUrl);
      setYoutubeUrl(data.youtubeUrl);
      setLocation(data.location);
      setWorkingHours(data.workingHours);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const payload = {
      brandName,
      tagline,
      contactPhone,
      contactWhatsApp: contactWhatsApp.replace(/[^0-9]/g, ""), // clean non-digits
      contactEmail,
      instagramUrl,
      youtubeUrl,
      location,
      workingHours
    };

    await adminUpdateSettings(payload);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    load();
  };

  if (!settings) return <Loader label="Loading settings control panel" />;

  return (
    <div className="p-8 max-w-4xl flex flex-col gap-6 font-sans">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-1">Studio Settings</h1>
        <p className="text-slate-soft text-sm">Configure brand text, contact links, and location values for the entire website.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate/10 p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate/10">
          <Settings className="text-studio-blue" size={20} />
          <h3 className="font-display text-lg font-bold text-ink">Global Configurations</h3>
        </div>

        {/* Brand details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Brand Name *</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Brand Tagline *</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Contact Phone Number *</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">WhatsApp Number (Numeric only with country code) *</label>
            <input
              type="text"
              value={contactWhatsApp}
              onChange={(e) => setContactWhatsApp(e.target.value)}
              className={inputClass}
              placeholder="e.g. 919488412345"
              required
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Contact Email *</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Social details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Instagram URL</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">YouTube Channel URL</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Location & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Studio Location Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Working Hours Display</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Endpoint notice */}
        <div className="bg-mist/30 border border-slate/15 p-4 flex gap-3 items-start">
          <Info size={16} className="text-studio-blue shrink-0 mt-0.5" />
          <div className="text-xs text-slate-soft leading-relaxed">
            <p className="font-semibold text-ink">API Connections</p>
            <p className="mt-0.5">
              The environment base URL is currently set to: <code className="bg-white px-1.5 py-0.5 border border-slate/10">{import.meta.env.VITE_API_URL || "[MOCK ACTIVE]"}</code>. Changing settings here updates the active client-facing frontend immediately.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate/10">
          <button
            type="submit"
            className="eyebrow bg-studio-blue text-paper px-6 py-4 hover:bg-ink text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg shadow-studio-blue/15 cursor-pointer"
          >
            <Save size={14} /> Save Studio Settings
          </button>
          {success && (
            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <CheckCircle size={14} /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
