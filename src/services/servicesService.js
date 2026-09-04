import api from "./api";

export async function getServices() {
  const { data } = await api.get("/services");
  const list = data.value || data.data || data;
  return list.filter((s) => s.enabled !== false);
}

export async function adminGetServices() {
  const { data } = await api.get("/admin/services");
  return data.value || data.data || data;
}

export async function adminSaveService(service) {
  const id = service._id || service.id;
  if (id) {
    const { data } = await api.patch(`/admin/services/${id}`, service);
    return data.value || data.data || data;
  }
  const { data } = await api.post("/admin/services", service);
  return data.value || data.data || data;
}

export async function adminDeleteService(id) {
  await api.delete(`/admin/services/${id}`);
  return true;
}
