import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Layers,
  Inbox,
  Settings,
  User,
  LogOut,
  Camera,
  Clapperboard,
  Menu,
  X,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const { adminName, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const nav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/photos", label: "Photo Gallery", icon: FolderKanban },
    { to: "/admin/reels", label: "Reels", icon: Clapperboard },
    { to: "/admin/brand-marketing", label: "Brand Marketing", icon: Briefcase },
    { to: "/admin/services", label: "Services & Packages", icon: Layers },
    { to: "/admin/bookings", label: "Bookings Inbox", icon: Inbox },
    { to: "/admin/settings", label: "Studio Settings", icon: Settings },
    { to: "/admin/profile", label: "Admin Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-mist/20 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Bar — matches home page style */}
      <header className="lg:hidden sticky top-0 z-50 bg-ink border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-5">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="w-8 h-8 border border-signal-gold flex items-center justify-center bg-black">
              <Camera size={14} className="text-signal-gold" />
            </span>
            <div className="flex flex-col">
              <span className="font-display tracking-wider font-bold text-[10px] uppercase text-white leading-none">
                Studio Control
              </span>
              <span className="text-[7px] text-signal-gold font-mono tracking-widest uppercase mt-0.5 leading-none">
                {(adminName || "Studio Admin").toUpperCase()}
              </span>
            </div>
          </NavLink>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-paper hover:text-signal-gold transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden bg-ink border-t border-white/5"
            >
              <nav className="flex flex-col px-5 py-4 gap-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-xs tracking-wider eyebrow font-bold transition-colors ${
                        isActive
                          ? "bg-studio-blue-deep text-signal-gold"
                          : "text-paper/70 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs tracking-wider eyebrow font-bold text-paper/50 hover:text-signal-gold transition-colors"
                >
                  <Home size={14} />
                  <span>Back to Site</span>
                </NavLink>

                <div className="border-t border-white/10 mt-2 pt-3">
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 bg-red-950/40 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white p-2.5 text-xs font-bold tracking-wider eyebrow cursor-pointer"
                  >
                    <LogOut size={13} /> Log Out
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Sidebar — unchanged */}
      <aside className="hidden lg:flex w-64 bg-ink text-white shrink-0 flex-col justify-between border-r border-white/10 h-screen sticky top-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-white/10 gap-2.5">
            <span className="w-8 h-8 border border-signal-gold flex items-center justify-center bg-black">
              <Camera size={14} className="text-signal-gold" />
            </span>
            <div className="flex flex-col">
              <span className="font-display tracking-wider font-bold text-xs uppercase text-white leading-none">
                Studio Control
              </span>
              <span className="text-[7px] text-signal-gold font-mono tracking-widest uppercase mt-1 leading-none">
                {(adminName || "Studio Admin").toUpperCase()}
              </span>
            </div>
          </div>

          <nav className="flex flex-col p-4 gap-1 select-none">
            {nav.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-xs tracking-wider eyebrow font-bold transition-colors ${
                    isActive
                      ? "bg-studio-blue-deep text-signal-gold"
                      : "text-paper/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="text-[10px] font-mono text-paper/40 mb-3">
            Logged in as: <strong className="text-paper/70">{adminName || "Admin"}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/40 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white p-2.5 text-xs font-bold tracking-wider eyebrow cursor-pointer"
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 min-h-[calc(100vh-64px)] lg:min-h-screen overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
