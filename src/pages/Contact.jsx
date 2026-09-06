import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { InstagramIcon, YoutubeIcon } from "../components/SocialIcons";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";

export default function Contact() {
  useSEO({
    title: "Contact Us | Tirunelveli Videography",
    description: "Get in touch with All in All Azhaguraja. Enquire about personal reels, bike delivery videos, event coverage, or business marketing packages.",
    keywords: "contact photographer Tirunelveli, book reels creator, Tirunelveli photography contact"
  });

  const settings = useSettings();

  return (
    <>
      <PageHeader
        eyebrow="GET IN TOUCH"
        title="Let's capture your moments or build your brand."
        description="Fill out the contact details below, and we will get back to you with custom package estimates immediately."
      />

      <section className="bg-paper py-12 pb-24 font-sans text-ink">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details Sidebar */}
          <div className="lg:col-span-5 bg-ink text-white p-8 md:p-10 flex flex-col justify-between relative shadow-lg">
            <div className="absolute inset-0 bg-studio-blue-deep/10 pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <span className="eyebrow text-signal-gold font-bold tracking-widest block mb-2 text-[9px]">CONTACT CHANNELS</span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">Creative Headquarters</h3>
                <p className="text-paper/60 text-xs">Reach out directly via email, mobile call, WhatsApp, or Instagram DM.</p>
              </div>

              <div className="flex flex-col gap-5 text-sm text-paper/85">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-signal-gold shrink-0" />
                  <span>{settings.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-signal-gold shrink-0" />
                  <span>{settings.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-signal-gold shrink-0">📍</span>
                  <span>{settings.location}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/15 hover:border-signal-gold hover:text-signal-gold flex items-center justify-center transition-all"
                  title="Instagram"
                >
                  <InstagramIcon size={16} />
                </a>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/15 hover:border-signal-gold hover:text-signal-gold flex items-center justify-center transition-all"
                  title="YouTube"
                >
                  <YoutubeIcon size={16} />
                </a>
                <WhatsAppButton variant="icon" className="w-10 h-10" />
              </div>
            </div>

            <div className="border border-slate/15 p-6 bg-white text-ink mt-12 relative z-10">
              <p className="eyebrow text-studio-blue mb-2 font-bold tracking-widest text-[9px]">OFFICE HOURS</p>
              <p className="font-display text-sm font-semibold">{settings.workingHours}</p>
              <p className="text-[10px] text-slate-soft/80 mt-1">Available for outstation shoots upon advanced booking.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
