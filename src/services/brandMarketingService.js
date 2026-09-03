import api from "./api";

export async function getBrandMarketing() {
  const { data } = await api.get("/brand-marketing");
  return (data || []).map((b) => ({ ...b, id: b._id }));
}

export async function adminGetBrandMarketing() {
  const { data } = await api.get("/admin/brand-marketing");
  return (data || []).map((b) => ({ ...b, id: b._id }));
}

export async function adminSaveBrandMarketing(campaign) {
  if (campaign.id) {
    const { data } = await api.patch(`/admin/brand-marketing/${campaign.id}`, campaign);
    return { ...data, id: data._id };
  }
  const { data } = await api.post("/admin/brand-marketing", campaign);
  return { ...data, id: data._id };
}

export async function adminDeleteBrandMarketing(id) {
  await api.delete(`/admin/brand-marketing/${id}`);
  return true;
}
