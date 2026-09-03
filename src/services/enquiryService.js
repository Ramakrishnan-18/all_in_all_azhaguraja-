import api from "./api";

// The real backend stores enquiries in MongoDB and returns them newest-first.
// We map the Mongo _id to a plain `id` so the admin UI keeps working unchanged.

async function submitEnquiry(enquiry) {
  const { data } = await api.post("/enquiries", enquiry);
  return { success: true, id: data.id };
}

async function adminGetEnquiries() {
  const { data } = await api.get("/admin/enquiries");
  return (data || []).map((e) => ({ ...e, id: e._id }));
}

async function adminUpdateEnquiryStatus(id, status) {
  await api.patch(`/admin/enquiries/${id}/status`, { status });
  return true;
}

async function adminDeleteEnquiry(id) {
  await api.delete(`/admin/enquiries/${id}`);
  return true;
}

export { submitEnquiry, adminGetEnquiries, adminUpdateEnquiryStatus, adminDeleteEnquiry };
