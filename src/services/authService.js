import api from "./api";

let currentAdmin = null;

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  currentAdmin = data;
  return data;
}

export async function getCurrentAdmin() {
  if (!localStorage.getItem("studio_admin_token")) {
    throw new Error("No token");
  }
  const { data } = await api.get("/me");
  currentAdmin = data;
  return data;
}

export async function logout() {
  try { await api.post("/logout"); } catch {}
  currentAdmin = null;
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
  return currentAdmin?._id || currentAdmin?.adminId || null;
}

export function isAuthenticated() {
  return Boolean(currentAdmin);
}

export function getCurrentRole() {
  return currentAdmin?.role || "Staff";
}

export function getCurrentAdminEmail() {
  return currentAdmin?.email || "";
}

export function getCurrentAdminName() {
  return currentAdmin?.name || "";
}
