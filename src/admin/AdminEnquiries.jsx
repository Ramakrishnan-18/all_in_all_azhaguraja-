import { useEffect, useState } from "react";
import { adminGetEnquiries, adminUpdateEnquiryStatus } from "../services/enquiryService";
import Loader from "../components/Loader";
import { formatDate } from "../utils/format";

const statuses = ["new", "contacted", "closed"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState(null);

  const load = () => adminGetEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  useEffect(() => { load(); }, []);

  if (!enquiries) return <Loader label="Loading enquiries" />;

  const updateStatus = async (id, status) => {
    await adminUpdateEnquiryStatus(id, status);
    load();
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-1">Enquiries</h1>
      <p className="text-slate-soft text-sm mb-8">{enquiries.length} total enquiries</p>

      {enquiries.length === 0 ? (
        <p className="text-slate-soft">No enquiries yet — submissions from the Contact page will appear here.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-white border border-slate/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-slate-soft">{e.email} · {e.phone}</p>
                </div>
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e.id, ev.target.value)}
                  className="eyebrow border border-slate/20 px-3 py-2 text-xs capitalize"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-sm text-slate-soft mb-2">{e.message}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-slate-soft/70">
                <span>Service: {e.service}</span>
                {e.eventDate && <span>Event date: {formatDate(e.eventDate)}</span>}
                {e.location && <span>Location: {e.location}</span>}
                <span>Received: {formatDate(e.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
