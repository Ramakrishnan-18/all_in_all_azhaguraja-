import api from "./api";

export async function getBrandMarketing() {
  const { data } = await api.get("/brand-marketing");
  const list = data.value || data.data || data || [];
  return list.map((b) => ({ ...b, id: b._id }));
}

export async function adminGetBrandMarketing() {
  const { data } = await api.get("/admin/brand-marketing");
  const list = data.value || data.data || data || [];
  return list.map((b) => ({ ...b, id: b._id }));
}

export async function adminSaveBrandMarketing(campaign) {
  const id = campaign._id || campaign.id;
  if (id) {
    const { data } = await api.patch(`/admin/brand-marketing/${id}`, campaign);
    const saved = data.value || data.data || data;
    return { ...saved, id: saved._id };
  }
  const { data } = await api.post("/admin/brand-marketing", campaign);
  const saved = data.value || data.data || data;
  return { ...saved, id: saved._id };
}

export async function adminDeleteBrandMarketing(id) {
  await api.delete(`/admin/brand-marketing/${id}`);
  return true;
}
