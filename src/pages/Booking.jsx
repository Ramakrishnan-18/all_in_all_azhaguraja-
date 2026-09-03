import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";
import WhatsAppButton from "../components/WhatsAppButton";
import useSEO from "../hooks/useSEO";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialPackage = searchParams.get("package") || "";

  useSEO({
    title: "Book a Shoot Slot | Scheduling",
    description: "Schedule your automotive or event photoshoot slot directly with our crew.",
    keywords: "book photoshoot Tirunelveli, schedule bike delivery video"
  });

  return (
    <>
      <PageHeader
        eyebrow="SCHEDULER"
        title="Coordinate shoot date and packages with our team."
        description="Share your brand campaign timeline, vehicle handover slot, or event details to check crew availability immediately."
      />

      <section className="bg-paper py-12 pb-24 font-sans text-ink">
        <div className="max-w-[800px] mx-auto px-6">
          <ContactForm defaultService={initialService} defaultPackage={initialPackage} />
        </div>
      </section>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
