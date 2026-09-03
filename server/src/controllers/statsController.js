import {
  Service,
  Package,
  Photo,
  Reel,
  Project,
  BrandMarketing,
  Testimonial,
} from "../models/resources.js";
import { Enquiry } from "../models/Enquiry.js";

// GET /admin/stats — dashboard counts
export async function getStats(req, res) {
  const [
    servicesCount,
    packagesCount,
    photosCount,
    reelsCount,
    projectsCount,
    brandCount,
    testimonialsCount,
    enquiries,
  ] = await Promise.all([
    Service.countDocuments(),
    Package.countDocuments(),
    Photo.countDocuments(),
    Reel.countDocuments(),
    Project.countDocuments(),
    BrandMarketing.countDocuments(),
    Testimonial.countDocuments(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.json({
    servicesCount,
    packagesCount,
    photosCount,
    reelsCount,
    projectsCount,
    brandCount,
    testimonialsCount,
    enquiriesCount: enquiries.length,
    recentEnquiries: enquiries,
  });
}
