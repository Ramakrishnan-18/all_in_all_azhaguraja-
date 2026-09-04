import api from "./api";

export async function getReels() {
  const { data } = await api.get("/reels");
  const list = data.value || data.data || data || [];
  return list.map((r) => ({ ...r, id: r._id }));
}

export async function adminGetReels() {
  const { data } = await api.get("/admin/reels");
  const list = data.value || data.data || data || [];
  return list.map((r) => ({ ...r, id: r._id }));
}

export async function adminSaveReel(reel) {
  const id = reel._id || reel.id;
  if (id) {
    const { data } = await api.patch(`/admin/reels/${id}`, reel);
    const saved = data.value || data.data || data;
    return { ...saved, id: saved._id };
  }
  const { data } = await api.post("/admin/reels", reel);
  const saved = data.value || data.data || data;
  return { ...saved, id: saved._id };
}

export async function adminDeleteReel(id) {
  await api.delete(`/admin/reels/${id}`);
  return true;
}
