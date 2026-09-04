import api from "./api";

export async function getPhotos() {
  const { data } = await api.get("/photos");
  const list = data.value || data.data || data || [];
  return list.map((p) => ({ ...p, id: p._id }));
}

export async function adminGetPhotos() {
  const { data } = await api.get("/admin/photos");
  const list = data.value || data.data || data || [];
  return list.map((p) => ({ ...p, id: p._id }));
}

export async function adminSavePhoto(photo) {
  const id = photo._id || photo.id;
  if (id) {
    const { data } = await api.patch(`/admin/photos/${id}`, photo);
    const saved = data.value || data.data || data;
    return { ...saved, id: saved._id };
  }
  const { data } = await api.post("/admin/photos", photo);
  const saved = data.value || data.data || data;
  return { ...saved, id: saved._id };
}

export async function adminDeletePhoto(id) {
  await api.delete(`/admin/photos/${id}`);
  return true;
}
