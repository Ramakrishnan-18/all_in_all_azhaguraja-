import api from "./api";

export async function getSettings() {
  const { data } = await api.get("/settings");
  return data || {};
}

export async function adminUpdateSettings(settings) {
  const { data } = await api.patch("/admin/settings", settings);
  return data;
}
