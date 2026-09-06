import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || TEMPLATE_ID;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "sakthiveeraputhiran50@gmail.com";

const configured = () =>
  Boolean(SERVICE_ID && SERVICE_ID !== "service_xxx") &&
  Boolean(TEMPLATE_ID && TEMPLATE_ID !== "template_xxx") &&
  Boolean(PUBLIC_KEY && PUBLIC_KEY !== "your_public_key_here");

export const emailjsConfigured = configured;

// Sends acknowledgment to customer + notification to admin.
// Use same template for both; admin email comes from VITE_ADMIN_EMAIL.
export async function sendBookingConfirmation(enquiry) {
  if (!configured()) return false;
  let customerSent = false;
  // 1. Customer confirmation (if they gave email)
  if (enquiry.email) {
    try {
      const params = {
        to_email: enquiry.email,
        from_name: "Lumen & Frame Studio",
        reply_to: ADMIN_EMAIL,
        name: enquiry.name,
        phone: enquiry.phone,
        service: enquiry.service,
        package: enquiry.package || "Not specified",
        eventDate: enquiry.eventDate || "To be scheduled",
        location: enquiry.location || "To be confirmed",
        message: enquiry.message || "",
      };
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
      customerSent = true;
    } catch (err) {
      console.error("EmailJS customer mail failed:", err);
    }
  }
  // 2. Admin notification — always send to studio
  try {
    const adminParams = {
      to_email: ADMIN_EMAIL,
      from_name: "Lumen & Frame Studio",
      reply_to: enquiry.email || ADMIN_EMAIL,
      name: enquiry.name,
      phone: enquiry.phone,
      service: enquiry.service,
      package: enquiry.package || "Not specified",
      eventDate: enquiry.eventDate || "To be scheduled",
      location: enquiry.location || "To be confirmed",
      message: enquiry.message || "",
    };
    await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, adminParams, { publicKey: PUBLIC_KEY });
  } catch (err) {
    console.error("EmailJS admin mail failed:", err);
  }
  return customerSent;
}
