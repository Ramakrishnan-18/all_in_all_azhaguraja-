import api from "./api";

export async function getServices() {
  const { data } = await api.get("/services");
  const list = data.value || data.data || data || [];
  return list.map((s) => ({ ...s, id: s._id }));
}

export async function adminGetServices() {
  const { data } = await api.get("/admin/services");
  const list = data.value || data.data || data || [];
  return list.map((s) => ({ ...s, id: s._id }));
}

export async function adminSaveService(service) {
  const id = service._id || service.id;
  if (id) {
    const { data } = await api.patch(`/admin/services/${id}`, service);
    const saved = data.value || data.data || data;
    return { ...saved, id: saved._id };
  }
  const { data } = await api.post("/admin/services", service);
  const saved = data.value || data.data || data;
  return { ...saved, id: saved._id };
}

export async function adminDeleteService(id) {
  await api.delete(`/admin/services/${id}`);
  return true;
}
