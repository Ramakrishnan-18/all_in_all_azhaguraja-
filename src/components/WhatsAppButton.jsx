import { MessageCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function WhatsAppButton({
  packageName = "",
  serviceName = "",
  message = "",
  label = "WhatsApp Us",
  variant = "inline", // inline, sticky, outline, icon
  className = ""
}) {
  const settings = useSettings();

  // Construct message template
  let finalMessage = message;
  if (!finalMessage) {
    if (packageName && serviceName) {
      finalMessage = `Hi All in All Azhaguraja, I'm interested in the ${packageName} package for ${serviceName}. Please share availability.`;
    } else if (serviceName) {
      finalMessage = `Hi All in All Azhaguraja, I'm interested in your ${serviceName} service. Please share details.`;
    } else {
      finalMessage = "Hi All in All Azhaguraja, I'm interested in booking a cinematic shoot with you!";
    }
  }

  const encoded = encodeURIComponent(finalMessage);
  const waUrl = `https://wa.me/${settings.contactWhatsApp}?text=${encoded}`;

  if (variant === "sticky") {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 pointer-events-auto">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform animate-bounce"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all ${className}`}
        title="Chat on WhatsApp"
      >
        <MessageCircle size={16} />
      </a>
    );
  }

  if (variant === "outline") {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`eyebrow border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white py-3 px-5 transition-all text-[10px] tracking-wider font-bold text-center block ${className}`}
      >
        <MessageCircle size={12} className="inline mr-1.5 -mt-0.5" /> {label}
      </a>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`eyebrow bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 transition-all text-xs tracking-wider font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/10 ${className}`}
    >
      <MessageCircle size={15} /> {label}
    </a>
  );
}
