import api from "./api";

export async function getPhotos() {
  const { data } = await api.get("/photos");
  return (data || []).map((p) => ({ ...p, id: p._id }));
}

export async function adminGetPhotos() {
  const { data } = await api.get("/admin/photos");
  return (data || []).map((p) => ({ ...p, id: p._id }));
}

export async function adminSavePhoto(photo) {
  if (photo.id) {
    const { data } = await api.patch(`/admin/photos/${photo.id}`, photo);
    return { ...data, id: data._id };
  }
  const { data } = await api.post("/admin/photos", photo);
  return { ...data, id: data._id };
}

export async function adminDeletePhoto(id) {
  await api.delete(`/admin/photos/${id}`);
  return true;
}
