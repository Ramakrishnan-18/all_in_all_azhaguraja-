import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { submitEnquiry } from "../services/enquiryService";
import { sendBookingConfirmation } from "../services/emailService";
import { getSettings } from "../services/settingsService";
import { CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./SocialIcons";
import WhatsAppButton from "./WhatsAppButton";

const services = [
  "Personal Reels",
  "Car & Bike Delivery Reels",
  "Event Photography & Videography",
  "Marketing Reels",
  "Business Promotional Videos",
  "Social Media Content Creation",
  "Other Capture"
];

const packages = ["Basic", "Standard", "Premium", "Custom / Retainer"];

const labelClass = "eyebrow text-slate-soft block mb-1.5 text-[9px] font-bold uppercase tracking-wider";
const inputClass = "w-full border border-slate/20 px-4 py-3 text-sm outline-none focus:border-studio-blue bg-white font-sans text-ink transition-colors";

export default function ContactForm({ defaultService = "", defaultPackage = "" }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [emailSent, setEmailSent] = useState(false);
  const [settings, setSettings] = useState({ contactPhone: "+91 94884 12345", instagramUrl: "#", youtubeUrl: "#" });

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
    if (defaultService) setValue("service", defaultService);
    if (defaultPackage) setValue("package", defaultPackage);
  }, [defaultService, defaultPackage, setValue]);

  const onSubmit = async (data) => {
    setStatus(null);
    setEmailSent(false);
    try {
      // 1. Save the booking to the backend so it appears in the admin inbox.
      await submitEnquiry(data);
      // 2. Email customer (if email given) + notify admin (always).
      const sent = await sendBookingConfirmation(data); // fail-soft, never throws
      setEmailSent(sent);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 border border-slate/10 shadow-sm font-sans">
      {status === "success" ? (
        <div className="text-center py-10 flex flex-col items-center">
          <CheckCircle2 size={52} className="text-green-600 mb-6" />
          <h3 className="font-display text-2xl font-bold mb-4 text-ink uppercase tracking-tight">Enquiry Submitted</h3>
          <p className="text-slate-soft text-sm max-w-md mx-auto mb-8">
            Thank you! Your booking request was recorded in our control panel{emailSent ? " and a confirmation email is on its way to your inbox." : ". We will reach out to schedule locations and pricing details."}
          </p>

          <p className="eyebrow text-slate-soft text-[10px] mb-4 font-bold tracking-widest">OR REACH US INSTANTLY VIA:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <WhatsAppButton variant="inline" className="font-bold text-xs shadow-md" label="WhatsApp Enquiry" />
            <a
              href={`tel:${settings.contactPhone}`}
              className="eyebrow bg-ink text-paper px-6 py-3.5 hover:bg-studio-blue flex items-center gap-2 font-bold text-xs transition-colors"
            >
              <Phone size={14} /> Call Studio
            </a>
          </div>
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate/10 w-full justify-center">
            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-soft hover:text-studio-blue transition-colors">
              <InstagramIcon size={20} />
            </a>
            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-slate-soft hover:text-red-600 transition-colors">
              <YoutubeIcon size={20} />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1 text-ink uppercase tracking-tight">Shoot Enquiry</h2>
            <p className="text-slate-soft text-xs leading-relaxed">Submit details directly to owner dashboard for scheduling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Your Name *</label>
              <input
                className={inputClass}
                placeholder="e.g. Anand"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1 font-mono">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Phone Number *</label>
              <input
                className={inputClass}
                placeholder="10-digit number"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian phone number" }
                })}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1 font-mono">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="e.g. name@domain.com"
                {...register("email")}
              />
            </div>

            {/* Shoot Date */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Event / Shoot Date</label>
              <input
                type="date"
                className={inputClass}
                {...register("eventDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Service Category */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Service Category *</label>
              <select
                className={inputClass}
                {...register("service", { required: "Please select a service" })}
                defaultValue=""
              >
                <option value="" disabled>Choose a service</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.service && <p className="text-xs text-red-600 mt-1 font-mono">{errors.service.message}</p>}
            </div>

            {/* Package Option */}
            <div>
              <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Pricing Package</label>
              <select
                className={inputClass}
                {...register("package")}
                defaultValue=""
              >
                <option value="" disabled>Choose a plan (Optional)</option>
                {packages.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Shoot Location *</label>
            <input
              className={inputClass}
              placeholder="e.g. Tirunelveli Showroom / Temple Name"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && <p className="text-xs text-red-600 mt-1 font-mono">{errors.location.message}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="eyebrow text-slate-soft text-[9px] block mb-1.5 font-bold uppercase tracking-wider">Details &amp; Requirements *</label>
            <textarea
              rows={4}
              className={inputClass}
              placeholder="Tell us about your delivery time, duration, music choice or shoot concepts..."
              {...register("message", { required: "Shoot details are required" })}
            />
            {errors.message && <p className="text-xs text-red-600 mt-1 font-mono">{errors.message.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate/5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="eyebrow bg-ink text-paper px-8 py-4 hover:bg-studio-blue transition-colors font-bold text-xs tracking-wider cursor-pointer w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Send Request"}
            </button>

            {status === "error" && (
              <span className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> Something went wrong. Please check your inputs.
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
