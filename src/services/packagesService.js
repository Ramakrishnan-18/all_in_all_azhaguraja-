import api from "./api";

export async function getPackages() {
  const { data } = await api.get("/packages");
  const list = data.value || data.data || data;
  return list.filter((p) => p.enabled !== false);
}

export async function adminGetPackages() {
  const { data } = await api.get("/admin/packages");
  return data.value || data.data || data;
}

export async function adminSavePackage(pkg) {
  const id = pkg._id || pkg.id;
  if (id) {
    const { data } = await api.patch(`/admin/packages/${id}`, pkg);
    return data.value || data.data || data;
  }
  const { data } = await api.post("/admin/packages", pkg);
  return data.value || data.data || data;
}

export async function adminDeletePackage(id) {
  await api.delete(`/admin/packages/${id}`);
  return true;
}
