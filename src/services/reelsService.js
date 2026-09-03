import api from "./api";

export async function getReels() {
  const { data } = await api.get("/reels");
  return (data || []).map((r) => ({ ...r, id: r._id }));
}

export async function adminGetReels() {
  const { data } = await api.get("/admin/reels");
  return (data || []).map((r) => ({ ...r, id: r._id }));
}

export async function adminSaveReel(reel) {
  if (reel.id) {
    const { data } = await api.patch(`/admin/reels/${reel.id}`, reel);
    return { ...data, id: data._id };
  }
  const { data } = await api.post("/admin/reels", reel);
  return { ...data, id: data._id };
}

export async function adminDeleteReel(id) {
  await api.delete(`/admin/reels/${id}`);
  return true;
}
