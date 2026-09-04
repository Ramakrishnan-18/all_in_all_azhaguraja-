import api from "./api";

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  if (data.token) localStorage.setItem("studio_admin_token", data.token);
  localStorage.setItem("studio_admin_name", data.name || "");
  localStorage.setItem("studio_admin_email", data.email || email);
  localStorage.setItem("studio_admin_role", data.role || "Staff");
  if (data.adminId) localStorage.setItem("studio_admin_id", data.adminId);
  return data;
}

export async function logout() {
  try { await api.post("/logout"); } catch {}
  localStorage.removeItem("studio_admin_token");
  localStorage.removeItem("studio_admin_name");
  localStorage.removeItem("studio_admin_email");
  localStorage.removeItem("studio_admin_id");
  localStorage.removeItem("studio_admin_role");
}

export async function getAdminAccounts() {
  const { data } = await api.get("/admins");
  return (data || []).map((a) => ({ ...a, id: a._id }));
}

export async function addAdminAccount({ name, email, password, role = "Staff" }) {
  const { data } = await api.post("/admins", { name, email, password, role });
  return { ...data, id: data._id };
}

export async function deleteAdminAccount(id) {
  await api.delete(`/admins/${id}`);
  return true;
}

export async function updateAdminAccount(id, updates) {
  const { data } = await api.patch(`/admins/${id}`, updates);
  return { ...data, id: data._id };
}

export async function changePassword(id, currentPassword, newPassword) {
  const { data } = await api.patch(`/admins/${id}/password`, { currentPassword, newPassword });
  return data;
}

export function getCurrentAdminId() {
  return localStorage.getItem("studio_admin_id");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("studio_admin_token"));
}

export function getCurrentRole() {
  return localStorage.getItem("studio_admin_role") || "Staff";
}

export function getCurrentAdminEmail() {
  return localStorage.getItem("studio_admin_email") || "";
}
