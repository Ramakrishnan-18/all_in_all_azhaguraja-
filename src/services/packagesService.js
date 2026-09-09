import api from "./api";

export async function getPackages() {
  const { data } = await api.get("/packages");
  const list = data.value || data.data || data || [];
  return list.map((p) => ({ ...p, id: p._id }));
}

export async function adminGetPackages() {
  const { data } = await api.get("/admin/packages");
  const list = data.value || data.data || data || [];
  return list.map((p) => ({ ...p, id: p._id }));
}

export async function adminSavePackage(pkg) {
  const id = pkg._id || pkg.id;
  if (id) {
    const { data } = await api.patch(`/admin/packages/${id}`, pkg);
    const saved = data.value || data.data || data;
    return { ...saved, id: saved._id };
  }
  const { data } = await api.post("/admin/packages", pkg);
  const saved = data.value || data.data || data;
  return { ...saved, id: saved._id };
}

export async function adminDeletePackage(id) {
  await api.delete(`/admin/packages/${id}`);
  return true;
}
