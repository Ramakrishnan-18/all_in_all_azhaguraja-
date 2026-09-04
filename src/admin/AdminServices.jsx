import { useEffect, useState, useRef } from "react";
import { adminGetServices, adminSaveService, adminDeleteService } from "../services/servicesService";
import { adminGetPackages, adminSavePackage, adminDeletePackage } from "../services/packagesService";
import { uploadFile } from "../services/uploadService";
import Loader from "../components/Loader";
import { Edit3, Trash2, Plus, Save, X, Layers, FileText, CheckCircle2, Upload, ImageIcon } from "lucide-react";

const inputClass = "w-full border border-slate/20 px-3 py-2 text-xs outline-none focus:border-studio-blue bg-white font-sans text-ink";

export default function AdminServices() {
  const [activeTab, setActiveTab] = useState("services"); // "services" | "packages"
  const [services, setServices] = useState(null);
  const [packages, setPackages] = useState(null);

  // Service form states
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [serviceFeaturesInput, setServiceFeaturesInput] = useState("");
  const [serviceStartingPrice, setServiceStartingPrice] = useState("");
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const serviceImageRef = useRef(null);

  // Package form states
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgCategory, setPkgCategory] = useState("Personal Reels");
  const [pkgName, setPkgName] = useState("Basic");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgFeaturesInput, setPkgFeaturesInput] = useState("");

  const loadData = () => {
    Promise.all([adminGetServices(), adminGetPackages()])
      .then(([srvs, pkgs]) => {
        setServices(srvs || []);
        setPackages(pkgs || []);
        if (srvs && srvs.length > 0 && !pkgCategory) {
          setPkgCategory(srvs[0].title);
        }
      })
      .catch(() => {
        setServices([]);
        setPackages([]);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!services || !packages) return <Loader label="Loading services & packages" />;

  // ---------------- SERVICES HANDLERS ----------------
  const startAddService = () => {
    setEditingServiceId("new");
    setServiceTitle("");
    setServiceDescription("");
    setServiceImage("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop");
    setServiceFeaturesInput("");
    setServiceStartingPrice("");
  };

  const startEditService = (s) => {
    setEditingServiceId(s._id || s.id);
    setServiceTitle(s.title);
    setServiceDescription(s.description);
    setServiceImage(s.image);
    setServiceFeaturesInput(s.features?.join("\n") || "");
    setServiceStartingPrice(s.startingPrice);
  };

  const handleServiceImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image."); return; }
    setUploadingServiceImage(true);
    try {
      const url = await uploadFile(file);
      setServiceImage(url);
    } catch { alert("Image upload failed. Check Cloudinary."); } finally { setUploadingServiceImage(false); }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceImage) { alert("Please upload a service image."); return; }
    const features = serviceFeaturesInput
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      _id: editingServiceId === "new" ? undefined : editingServiceId,
      title: serviceTitle,
      description: serviceDescription,
      image: serviceImage,
      features,
      startingPrice: Number(serviceStartingPrice)
    };

    await adminSaveService(payload);
    setEditingServiceId(null);
    loadData();
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await adminDeleteService(id);
    loadData();
  };

  const handleToggleService = async (s) => {
    const nextVal = !s.enabled;
    await adminSaveService({ ...s, enabled: nextVal });
    loadData();
  };

  // ---------------- PACKAGES HANDLERS ----------------
  const startAddPkg = () => {
    setEditingPkgId("new");
    setPkgCategory(services[0]?.title || "Personal Reels");
    setPkgName("Basic");
    setPkgPrice("");
    setPkgFeaturesInput("");
  };

  const startEditPkg = (p) => {
    setEditingPkgId(p._id || p.id);
    setPkgCategory(p.category);
    setPkgName(p.packageName);
    setPkgPrice(p.price);
    setPkgFeaturesInput(p.features?.join("\n") || "");
  };

  const handleSavePkg = async (e) => {
    e.preventDefault();
    const features = pkgFeaturesInput
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      _id: editingPkgId === "new" ? undefined : editingPkgId,
      category: pkgCategory,
      packageName: pkgName,
      price: Number(pkgPrice),
      features
    };

    await adminSavePackage(payload);
    setEditingPkgId(null);
    loadData();
  };

  const handleDeletePkg = async (id) => {
    if (!confirm("Are you sure you want to delete this package deal?")) return;
    await adminDeletePackage(id);
    loadData();
  };

  const handleTogglePkg = async (p) => {
    const nextVal = !p.enabled;
    await adminSavePackage({ ...p, enabled: nextVal });
    loadData();
  };

  // Combined category list from active services + existing packages
  const categoryOptions = Array.from(
    new Set([
      ...services.map((s) => s.title),
      ...packages.map((p) => p.category),
      "Personal Reels",
      "Car & Bike Delivery Reels",
      "Event Photography & Videography",
      "Marketing Reels"
    ])
  );

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink mb-1">Services &amp; Pricing Packages</h1>
          <p className="text-slate-soft text-sm">
            Manage your service offerings, descriptions, baseline rates, and tiered package pricing all in one place.
          </p>
        </div>

        <div>
          {activeTab === "services" && !editingServiceId && (
            <button
              onClick={startAddService}
              className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
            >
              <Plus size={13} /> Add Service
            </button>
          )}

          {activeTab === "packages" && !editingPkgId && (
            <button
              onClick={startAddPkg}
              className="eyebrow bg-studio-blue text-paper px-4 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
            >
              <Plus size={13} /> Add Pricing Package
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate/15 gap-2">
        <button
          onClick={() => {
            setActiveTab("services");
            setEditingServiceId(null);
          }}
          className={`eyebrow text-xs font-bold tracking-wider px-6 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "services"
              ? "border-studio-blue text-studio-blue bg-white"
              : "border-transparent text-slate-soft hover:text-ink"
          }`}
        >
          <Layers size={14} /> Services Offered ({services.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("packages");
            setEditingPkgId(null);
          }}
          className={`eyebrow text-xs font-bold tracking-wider px-6 py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "packages"
              ? "border-studio-blue text-studio-blue bg-white"
              : "border-transparent text-slate-soft hover:text-ink"
          }`}
        >
          <FileText size={14} /> Pricing Packages ({packages.length})
        </button>
      </div>

      {/* TAB 1: SERVICES OFFERED */}
      {activeTab === "services" && (
        <div className="flex flex-col gap-6">
          {editingServiceId && (
            <form onSubmit={handleSaveService} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
                {editingServiceId === "new" ? "New Service Details" : "Edit Service Details"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Service Title *</label>
                  <input type="text" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Service Image *</label>
                  <input ref={serviceImageRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={handleServiceImageSelect} className="hidden" />
                  {serviceImage ? (
                    <div className="border border-green-200 bg-green-50 p-2 flex items-center gap-2">
                      <img src={serviceImage} alt="preview" className="w-12 h-10 object-cover shrink-0" />
                      <button type="button" onClick={() => serviceImageRef.current?.click()} className="text-[10px] text-green-700 underline">Change</button>
                      <button type="button" onClick={() => setServiceImage("")} className="ml-auto text-green-600 hover:text-red-600"><X size={12} /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => serviceImageRef.current?.click()} disabled={uploadingServiceImage} className="w-full border-2 border-dashed border-slate/25 hover:border-studio-blue p-3 flex flex-col items-center gap-1 cursor-pointer disabled:opacity-50">
                      <ImageIcon size={18} className={uploadingServiceImage ? "text-studio-blue animate-pulse" : "text-slate/30"} />
                      <span className="text-[10px] font-bold">{uploadingServiceImage ? "Uploading..." : "Upload Image"}</span>
                    </button>
                  )}
                </div>
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Starting Price (₹) *</label>
                  <input type="number" value={serviceStartingPrice} onChange={(e) => setServiceStartingPrice(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Description *</label>
                <textarea rows={3} value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className={inputClass} required />
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Features Checklist (one per line)</label>
                <textarea rows={3} value={serviceFeaturesInput} onChange={(e) => setServiceFeaturesInput(e.target.value)} className={`${inputClass} font-mono`} />
              </div>

              <div className="flex gap-2.5">
                <button type="submit" className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider">
                  <Save size={12} className="inline mr-1" /> Save Service
                </button>
                <button type="button" onClick={() => setEditingServiceId(null)} className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider">
                  <X size={12} className="inline mr-1" /> Cancel
                </button>
              </div>
            </form>
          )}

          {/* Services List Table */}
          <div className="bg-white border border-slate/10 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate/10 text-slate-soft uppercase font-mono text-[9px]">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id || s.id} className="border-b border-slate/5 hover:bg-mist/10">
                    <td className="py-3 px-4 font-semibold text-ink">{s.title}</td>
                    <td className="py-3 px-4 max-w-sm line-clamp-1 truncate">{s.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-studio-blue-deep">₹{s.startingPrice?.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={s.enabled !== false}
                          onChange={() => handleToggleService(s)}
                          className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                          id={`chk-${s._id || s.id}`}
                        />
                        <label htmlFor={`chk-${s._id || s.id}`} className="text-[10px] font-mono text-slate-soft uppercase cursor-pointer">
                          {s.enabled !== false ? "Active" : "Disabled"}
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => startEditService(s)}
                          className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s._id || s.id)}
                          className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 cursor-pointer"
                          title="Delete Service"
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
      )}

      {/* TAB 2: PRICING PACKAGES */}
      {activeTab === "packages" && (
        <div className="flex flex-col gap-6">
          {editingPkgId && (
            <form onSubmit={handleSavePkg} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight">
                {editingPkgId === "new" ? "New Package Details" : "Edit Package Details"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Category Group *</label>
                  <select value={pkgCategory} onChange={(e) => setPkgCategory(e.target.value)} className={inputClass} required>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Package Name *</label>
                  <select value={pkgName} onChange={(e) => setPkgName(e.target.value)} className={inputClass} required>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Custom / Retainer">Custom / Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Rate Price (₹) *</label>
                  <input type="number" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} className={inputClass} required />
                </div>
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Features (one per line)</label>
                <textarea rows={4} value={pkgFeaturesInput} onChange={(e) => setPkgFeaturesInput(e.target.value)} className={`${inputClass} font-mono`} />
              </div>

              <div className="flex gap-2.5">
                <button type="submit" className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider">
                  <Save size={12} className="inline mr-1" /> Save Package
                </button>
                <button type="button" onClick={() => setEditingPkgId(null)} className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider">
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
                  <tr key={p._id || p.id} className="border-b border-slate/5 hover:bg-mist/10">
                    <td className="py-3 px-4 font-semibold text-ink">{p.category}</td>
                    <td className="py-3 px-4 capitalize font-medium">{p.packageName}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{p.features?.join(", ")}</td>
                    <td className="py-3 px-4 font-mono font-bold text-studio-blue-deep">₹{p.price?.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={p.enabled !== false}
                          onChange={() => handleTogglePkg(p)}
                          className="w-3.5 h-3.5 accent-studio-blue cursor-pointer"
                          id={`pkg-chk-${p._id || p.id}`}
                        />
                        <label htmlFor={`pkg-chk-${p._id || p.id}`} className="text-[10px] font-mono text-slate-soft uppercase cursor-pointer">
                          {p.enabled !== false ? "Active" : "Disabled"}
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => startEditPkg(p)}
                          className="text-slate-soft hover:text-studio-blue p-1.5 border border-slate/10 cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeletePkg(p._id || p.id)}
                          className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 cursor-pointer"
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
      )}
    </div>
  );
}
