import { useEffect, useState } from "react";
import { adminGetPackages, adminSavePackage, adminDeletePackage } from "../services/packagesService";
import Loader from "../components/Loader";
import { Edit3, Trash2, Plus, Save, X } from "lucide-react";

const inputClass = "w-full border border-slate/20 px-3 py-2 text-xs outline-none focus:border-studio-blue bg-white";

export default function AdminPackages() {
  const [packages, setPackages] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [category, setCategory] = useState("Personal Reels");
  const [packageName, setPackageName] = useState("Basic");
  const [price, setPrice] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");

  const load = () => adminGetPackages().then(setPackages).catch(() => setPackages([]));
  useEffect(() => { load(); }, []);

  if (!packages) return <Loader label="Loading pricing deals" />;

  const startEdit = (p) => {
    setEditingId(p.id);
    setCategory(p.category);
    setPackageName(p.packageName);
    setPrice(p.price);
    setFeaturesInput(p.features?.join("\n") || "");
  };

  const startAdd = () => {
    setEditingId("new");
    setCategory("Personal Reels");
    setPackageName("Basic");
    setPrice("");
    setFeaturesInput("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const features = featuresInput
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      id: editingId === "new" ? undefined : editingId,
      category,
      packageName,
      price: Number(price),
      features
    };

    await adminSavePackage(payload);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package deal?")) return;
    await adminDeletePackage(id);
    load();
  };

  const handleToggle = async (p) => {
    const nextVal = !p.enabled;
    await adminSavePackage({ ...p, enabled: nextVal });
    load();
  };

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Pricing Packages</h1>
          <p className="text-slate-soft text-sm">Manage rates and custom features for standard client packages.</p>
        </div>
        {!editingId && (
          <button
            onClick={startAdd}
            className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
          >
            <Plus size={13} /> Add Package
          </button>
        )}
      </div>

      {editingId && (
        <form onSubmit={handleSave} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
          <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
            {editingId === "new" ? "New Package Details" : "Edit Package Details"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Category Group *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required>
                <option value="Personal Reels">Personal Reels</option>
                <option value="Car & Bike Delivery Reels">Car & Bike Delivery Reels</option>
                <option value="Event Photography & Videography">Event Photography & Videography</option>
                <option value="Marketing Reels">Marketing Reels</option>
              </select>
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Package Name *</label>
              <select value={packageName} onChange={(e) => setPackageName(e.target.value)} className={inputClass} required>
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Rate Price (₹) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Features (one per line)</label>
            <textarea rows={4} value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} className={`${inputClass} font-mono`} />
          </div>

          <div className="flex gap-2.5">
            <button type="submit" className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider">
              <Save size={12} className="inline mr-1" /> Save Package
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider">
              <X size={12} className="inline mr-1" /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Packages Table */}
      <div className="bg-white border border-slate/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate/10 text-slate-soft uppercase font-mono text-[9px]">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Features</th>
              <th className="py-3 px-4">Price Rate</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id} className="border-b border-slate/5 hover:bg-mist/10">
                <td className="py-3 px-4 font-semibold text-ink">{p.category}</td>
                <td className="py-3 px-4 capitalize">{p.packageName}</td>
                <td className="py-3 px-4 max-w-xs truncate">{p.features?.join(", ")}</td>
                <td className="py-3 px-4 font-mono font-bold text-studio-blue-deep">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.enabled !== false}
                      onChange={() => handleToggle(p)}
                      className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                      id={`pkg-chk-${p.id}`}
                    />
                    <label htmlFor={`pkg-chk-${p.id}`} className="text-[10px] font-mono text-slate-soft uppercase cursor-pointer">
                      {p.enabled !== false ? "Active" : "Disabled"}
                    </label>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10"
                      title="Edit Package"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10"
                      title="Delete Package"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
