import { Enquiry } from "../models/Enquiry.js";

// POST /enquiries (public form submission)
export async function submitEnquiry(req, res) {
  const {
    name, phone, email, eventDate, service, location, message,
    package: packageOption,
  } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  const enquiry = await Enquiry.create({
    name,
    phone,
    email,
    eventDate,
    service,
    package: packageOption,
    location,
    message,
    status: "new",
  });
  res.status(201).json({ success: true, id: enquiry._id });
}

// GET /admin/enquiries
export async function listEnquiries(req, res) {
  const { status, search } = req.query;
  const query = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safeSearch, "i");
    query.$or = [
      { name: regex },
      { phone: regex },
      { email: regex },
      { location: regex },
      { message: regex },
    ];
  }
  const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).lean();
  res.json(enquiries);
}

// PATCH /admin/enquiries/:id/status
export async function updateEnquiryStatus(req, res) {
  const { status } = req.body || {};
  if (!["new", "contacted", "closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  res.json(enquiry);
}

// DELETE /admin/enquiries/:id
export async function deleteEnquiry(req, res) {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  res.json({ success: true });
}
