import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  User, Shield, Save, CheckCircle, UserPlus, Trash2,
  Eye, EyeOff, Crown, Users, AlertTriangle
} from "lucide-react";
import {
  getAdminAccounts,
  addAdminAccount,
  deleteAdminAccount,
  updateAdminAccount,
  changePassword,
  getCurrentAdminId
} from "../services/authService";

const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white font-sans text-ink";

const ROLE_COLORS = {
  Admin: "bg-signal-gold/20 text-amber-700 border-amber-300",
  Manager: "bg-studio-blue/10 text-studio-blue border-studio-blue/30",
  Staff: "bg-slate/10 text-slate-soft border-slate/20",
};

export default function AdminProfile() {
  const { adminName, setAdminName } = useAuth();
  const currentId = getCurrentAdminId();

  // ---- My Profile state ----
  const [name, setName] = useState(adminName || "Azhaguraja S.");
  const [email, setEmail] = useState("admin@studio.com");
  const [role] = useState("Admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  // ---- Manage Admins state ----
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newRole, setNewRole] = useState("Staff");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    getAdminAccounts().then(setAdmins).catch(() => setAdmins([]));
  }, []);

  const refreshAdmins = () => getAdminAccounts().then(setAdmins).catch(() => setAdmins([]));

  // ---- Profile handlers ----
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateAdminAccount(currentId, { name });
      localStorage.setItem("studio_admin_name", name);
      setAdminName(name);
      await refreshAdmins();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save profile");
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdError("");
    if (newPassword.length < 6) {
      setPwdError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match!");
      return;
    }
    try {
      await changePassword(currentId, currentPassword, newPassword);
      setPwdSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(false), 2500);
    } catch (err) {
      setPwdError(err?.response?.data?.message || "Failed to change password");
    }
  };

  // ---- Add Admin handler ----
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    if (newAdminPassword.length < 6) {
      setAddError("Password must be at least 6 characters.");
      return;
    }
    try {
      await addAdminAccount({ name: newName, email: newEmail, password: newAdminPassword, role: newRole });
      await refreshAdmins();
      setAddSuccess(`Admin "${newName}" added successfully.`);
      setNewName("");
      setNewEmail("");
      setNewAdminPassword("");
      setNewRole("Staff");
      setShowAddForm(false);
      setTimeout(() => setAddSuccess(""), 3000);
    } catch (err) {
      setAddError(err?.response?.data?.message || err.message || "Failed to add admin");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (id === currentId) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm("Are you sure you want to remove this admin account?")) return;
    try {
      await deleteAdminAccount(id);
      await refreshAdmins();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="p-8 flex flex-col gap-8 font-sans max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-1">Admin Profile</h1>
        <p className="text-slate-soft text-sm">Update your login details and manage all admin accounts for this studio.</p>
      </div>

      {/* ---- Profile & Password Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate/10">
            <User className="text-studio-blue" size={20} />
            <h3 className="font-display text-lg font-bold text-ink">General Info</h3>
          </div>

          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Email Address</label>
              <input type="email" value={email} className={inputClass} disabled />
              <p className="text-[10px] text-slate-soft/70 mt-1">Email is locked. Contact system admin to change.</p>
            </div>

            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Role Title</label>
              <input type="text" value={role} className={inputClass} disabled />
              <p className="text-[10px] text-slate-soft/80 mt-1">Role permission is locked to Admin.</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate/5 mt-2">
              <button
                type="submit"
                className="eyebrow bg-studio-blue text-paper px-5 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
              >
                <Save size={13} /> Save Profile
              </button>
              {success && (
                <span className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle size={14} /> Profile updated!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-slate/10 p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate/10">
            <Shield className="text-studio-blue" size={20} />
            <h3 className="font-display text-lg font-bold text-ink">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {pwdError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertTriangle size={12} /> {pwdError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-slate/5 mt-2">
              <button
                type="submit"
                className="eyebrow bg-studio-blue text-paper px-5 py-3 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
              >
                <Save size={13} /> Update Password
              </button>
              {pwdSuccess && (
                <span className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle size={14} /> Password changed!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ---- Manage Admin Accounts ---- */}
      <div className="bg-white border border-slate/10 shadow-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate/10">
          <div className="flex items-center gap-3">
            <Users className="text-studio-blue" size={20} />
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Admin Accounts</h3>
              <p className="text-[11px] text-slate-soft mt-0.5">
                Manage who has access to the studio control panel. ({admins.length} account{admins.length !== 1 ? "s" : ""})
              </p>
            </div>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="eyebrow bg-studio-blue text-paper px-4 py-2.5 hover:bg-ink text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-md shadow-studio-blue/15 cursor-pointer"
            >
              <UserPlus size={13} /> Add Admin
            </button>
          )}
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddAdmin}
            className="p-6 border-b border-slate/10 bg-mist/20 flex flex-col gap-4"
          >
            <h4 className="font-display text-sm font-bold text-ink uppercase tracking-tight flex items-center gap-2">
              <UserPlus size={14} className="text-studio-blue" /> Create New Admin Account
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Full Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ravi Kumar"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Email Address *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin2@studio.com"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Password *</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-soft hover:text-ink cursor-pointer"
                  >
                    {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="eyebrow text-slate-soft block mb-1 text-[8px] font-bold">Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </div>

            {addError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertTriangle size={12} /> {addError}
              </p>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="eyebrow bg-ink hover:bg-studio-blue text-paper px-4 py-2 text-[10px] font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus size={12} /> Create Admin
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setAddError(""); }}
                className="eyebrow border border-slate/20 text-slate-soft px-4 py-2 text-[10px] font-bold tracking-wider cursor-pointer hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Success banner */}
        {addSuccess && (
          <div className="px-6 py-3 bg-green-50 border-b border-green-200 text-xs text-green-700 flex items-center gap-2">
            <CheckCircle size={14} /> {addSuccess}
          </div>
        )}

        {/* Admins Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate/10 text-slate-soft uppercase font-mono text-[9px] bg-slate/5">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isMe = admin.id === currentId || admin.id === "1";
                return (
                  <tr key={admin.id} className="border-b border-slate/5 hover:bg-mist/10 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-studio-blue-deep text-signal-gold flex items-center justify-center text-[10px] font-bold shrink-0">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-ink">{admin.name}</span>
                        {isMe && (
                          <span className="text-[8px] font-mono bg-studio-blue/10 text-studio-blue px-1.5 py-0.5 border border-studio-blue/20">YOU</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-soft">{admin.email}</td>
                    <td className="py-3.5 px-5">
                      <span className={`eyebrow text-[8px] font-bold tracking-wider px-2 py-1 border inline-flex items-center gap-1 ${ROLE_COLORS[admin.role] || ROLE_COLORS.Staff}`}>
                        {admin.role === "Admin" && <Crown size={9} />}
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {admin.role !== "Admin" && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-slate-soft hover:text-red-600 p-1.5 border border-slate/10 cursor-pointer transition-colors"
                          title="Remove Admin"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
