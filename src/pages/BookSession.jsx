import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import useSEO from "../hooks/useSEO";
import WhatsAppButton from "../components/WhatsAppButton";

export default function BookSession() {
  useSEO({
    title: "Book a Session",
    description: "Schedule your photography/video session – we’ll connect via the contact page.",
    keywords: "book session, contact, photography booking"
  });

  const navigate = useNavigate();

  const handleClick = () => {
    // Redirect to the Contact page where the user can actually send a message
    navigate("/contact");
  };

  return (
    <>
      <PageHeader
        eyebrow="BOOK SESSION"
        title="Ready to create moments?"
        description="Click the button below and you will be taken to our contact page to finalize your booking."
      />

      <section className="bg-paper py-12 flex flex-col items-center font-sans text-ink">
        <button
          onClick={handleClick}
          className="eyebrow bg-studio-blue text-paper px-8 py-4 hover:bg-ink text-lg font-bold tracking-wider shadow-md shadow-studio-blue/15"
        >
          Book Session
        </button>
      </section>

      <WhatsAppButton variant="sticky" />
    </>
  );
}
