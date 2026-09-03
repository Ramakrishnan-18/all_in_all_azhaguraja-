import { useEffect, useState } from "react";
import { adminGetEnquiries, adminUpdateEnquiryStatus, adminDeleteEnquiry } from "../services/enquiryService";
import Loader from "../components/Loader";
import { formatDate } from "../utils/format";
import { Search, Trash2, ChevronLeft, ChevronRight, Inbox, Mail, Phone, MapPin, Calendar, Clock, Briefcase } from "lucide-react";

const statuses = ["new", "contacted", "closed"];
const ITEMS_PER_PAGE = 5;

export default function AdminBookings() {
  const [enquiries, setEnquiries] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const load = () => adminGetEnquiries().then(setEnquiries).catch(() => setEnquiries([]));
  useEffect(() => { load(); }, []);

  if (!enquiries) return <Loader label="Loading booking enquiries" />;

  const updateStatus = async (id, status) => {
    await adminUpdateEnquiryStatus(id, status);
    load();
  };

  const deleteEnquiry = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry? This will remove it from the control panel permanently.")) return;
    await adminDeleteEnquiry(id);
    load();
  };

  // Search, Filter and Paginate logic
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filter/search changes
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  return (
    <div className="p-8 flex flex-col gap-6 font-sans">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-1">Booking Enquiries</h1>
        <p className="text-slate-soft text-sm">
          Review, status-track, and filter inbound client leads sent from the contact/booking forms.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate/10 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by name, phone, message..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate/20 outline-none focus:border-studio-blue bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-slate-soft/50" size={14} />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-soft font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-slate/20 px-3 py-1.5 text-xs bg-white focus:border-studio-blue outline-none eyebrow font-semibold"
          >
            <option value="all">All Enquiries</option>
            {statuses.map((st) => (
              <option key={st} value={st}>{st.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Card List */}
      {paginatedEnquiries.length === 0 ? (
        <div className="bg-white p-12 text-center border border-slate/10 shadow-sm flex flex-col items-center">
          <Inbox size={44} className="text-slate/20 mb-4" />
          <p className="text-slate-soft font-medium">No bookings or enquiries match your active filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {paginatedEnquiries.map((e) => (
            <div key={e.id} className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col justify-between hover:border-slate/20 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-slate/5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink leading-tight">{e.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-soft mt-1">
                    <span className="flex items-center gap-1"><Phone size={12} className="text-studio-blue shrink-0" /> <span className="font-mono">{e.phone}</span></span>
                    {e.email && <span className="flex items-center gap-1"><Mail size={12} className="text-studio-blue shrink-0" /> {e.email}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value)}
                    className="eyebrow border border-slate/20 px-3 py-1.5 text-xs font-semibold capitalize bg-white focus:border-studio-blue outline-none"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => deleteEnquiry(e.id)}
                    className="text-slate-soft hover:text-red-600 transition-colors p-1.5 border border-slate/10 hover:border-red-200"
                    title="Delete Enquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Message Details */}
              <p className="text-slate-soft text-sm leading-relaxed mb-4 bg-mist/20 p-4 border-l-2 border-slate/20">
                {e.message}
              </p>

              {/* Meta information tags */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase text-slate-soft/75">
                <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-studio-blue shrink-0" /> Service: <strong className="text-ink">{e.service}</strong></span>
                {e.package && <span className="flex items-center gap-1.5"><Clock size={12} className="text-studio-blue shrink-0" /> Plan: <strong className="text-ink">{e.package} Package</strong></span>}
                {e.eventDate && <span className="flex items-center gap-1.5"><Calendar size={12} className="text-studio-blue shrink-0" /> Shoot Date: <strong className="text-ink">{formatDate(e.eventDate)}</strong></span>}
                {e.location && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-studio-blue shrink-0" /> Location: <strong className="text-ink">{e.location}</strong></span>}
                <span className="ml-auto text-[9px] text-slate-soft/50">Submitted: {formatDate(e.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 border border-slate/10 shadow-sm">
          <p className="text-xs text-slate-soft font-mono">
            Showing Page {currentPage} of {totalPages} ({filteredEnquiries.length} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate/20 text-slate-soft hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold eyebrow cursor-pointer"
            >
              <ChevronLeft size={14} className="inline mr-1" /> Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate/20 text-slate-soft hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold eyebrow cursor-pointer"
            >
              Next <ChevronRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
