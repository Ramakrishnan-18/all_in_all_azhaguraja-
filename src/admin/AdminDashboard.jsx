import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetEnquiries } from "../services/enquiryService";
import { adminGetPhotos } from "../services/photosService";
import { adminGetReels } from "../services/reelsService";
import { adminGetBrandMarketing } from "../services/brandMarketingService";
import { adminGetServices } from "../services/servicesService";
import { adminGetPackages } from "../services/packagesService";
import Loader from "../components/Loader";
import { formatDate } from "../utils/format";
import { BarChart2, Briefcase, Camera, Layers, Clapperboard } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      adminGetPhotos().catch(() => []),
      adminGetReels().catch(() => []),
      adminGetEnquiries().catch(() => []),
      adminGetBrandMarketing().catch(() => []),
      adminGetServices().catch(() => []),
      adminGetPackages().catch(() => []),
    ])
      .then(([phos, reels, enqs, brms, srvs, pkgs]) => {
        setStats({
          photosCount: phos.length,
          reelsCount: reels.length,
          enquiriesCount: enqs.length,
          brandCount: brms.length,
          servicesCount: srvs.length,
          packagesCount: pkgs.length,
        });
        setRecent(enqs.slice(0, 5));
      })
      .catch(() => {
        setStats({ photosCount: 0, reelsCount: 0, enquiriesCount: 0, brandCount: 0, servicesCount: 0, packagesCount: 0 });
        setRecent([]);
      });
  }, []);

  if (!stats) return <Loader label="Loading statistics console" />;

  return (
    <div className="p-8 flex flex-col gap-8 font-sans">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-1">Dashboard</h1>
        <p className="text-slate-soft text-sm">Real-time overview of your studio bookings, gallery uploads, and services.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Bookings", count: stats.enquiriesCount, icon: BarChart2, to: "../bookings" },
          { label: "Photos", count: stats.photosCount, icon: Camera, to: "../photos" },
          { label: "Reels", count: stats.reelsCount, icon: Clapperboard, to: "../reels" },
          { label: "Brand Campaigns", count: stats.brandCount, icon: Briefcase, to: "../brand-marketing" },
          { label: "Services & Packages", count: `${stats.servicesCount} / ${stats.packagesCount}`, icon: Layers, to: "../services" },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="bg-white border border-slate/10 p-6 shadow-sm hover:border-studio-blue/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-soft font-mono text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
              <item.icon size={18} className="text-studio-blue shrink-0" />
            </div>
            <h3 className="font-display text-3xl font-black text-ink mt-4">{item.count}</h3>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white border border-slate/10 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate/10">
          <h3 className="font-display text-lg font-bold text-ink uppercase tracking-tight">Recent Enquiries</h3>
          <Link to="../bookings" className="eyebrow text-xs text-studio-blue hover:text-ink font-bold">
            View All Enquiries
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-8 text-slate-soft/50 text-sm">
            No booking enquiries submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate/10 text-slate-soft uppercase font-mono text-[9px]">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Shoot Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Shoot Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e.id} className="border-b border-slate/5 hover:bg-mist/10">
                    <td className="py-3.5 px-4 font-semibold text-ink">{e.name}</td>
                    <td className="py-3.5 px-4 font-mono">{e.phone}</td>
                    <td className="py-3.5 px-4">{e.service}</td>
                    <td className="py-3.5 px-4">{e.location}</td>
                    <td className="py-3.5 px-4 font-mono">{e.eventDate ? formatDate(e.eventDate) : "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 font-mono font-bold tracking-wider text-[8px] uppercase ${
                        e.status === "new" ? "bg-red-50 text-red-600 border border-red-200" :
                        e.status === "contacted" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        "bg-green-50 text-green-600 border border-green-200"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
