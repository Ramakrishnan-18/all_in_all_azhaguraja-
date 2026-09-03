import api from "./api";

export async function getTestimonials() {
  const { data } = await api.get("/testimonials");
  return (data || []).map((t) => ({ ...t, id: t._id }));
}

export async function adminGetTestimonials() {
  const { data } = await api.get("/admin/testimonials");
  return (data || []).map((t) => ({ ...t, id: t._id }));
}

export async function adminSaveTestimonial(testimonial) {
  if (testimonial.id) {
    const { data } = await api.patch(`/admin/testimonials/${testimonial.id}`, testimonial);
    return { ...data, id: data._id };
  }
  const { data } = await api.post("/admin/testimonials", testimonial);
  return { ...data, id: data._id };
}

export async function adminDeleteTestimonial(id) {
  await api.delete(`/admin/testimonials/${id}`);
  return true;
}
