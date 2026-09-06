import PageHeader from "../components/PageHeader";
import useSEO from "../hooks/useSEO";

export default function Terms() {
  useSEO({
    title: "Terms & Conditions | Legal",
    description: "Terms and conditions of booking and hiring Lumen & Frame studio services."
  });

  return (
    <>
      <PageHeader
        eyebrow="LEGAL"
        title="Terms &amp; Conditions"
        description="Last updated August 2026. Standard booking deposit, scheduling guidelines, and deliverable agreements."
      />
      <section className="bg-paper py-20 px-6 font-sans text-ink leading-relaxed">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 text-sm text-slate-soft">
          <p>
            Welcome to the creative studio of <strong>Lumen & Frame</strong>. By hiring our production crew, booking a shoot date, or choosing pricing packages, you agree to comply with our standard production rules.
          </p>
          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">1. Booking Deposits and Postponements</h3>
          <p>
            Due to strict scheduling limits for events and vehicle deliveries in Tirunelveli, booking dates are locked only upon payment of the designated retainer deposit. Shoots cancelled or postponed less than 48 hours prior to the date are subject to forfeiture.
          </p>
          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">2. Delivery Timelines</h3>
          <p>
            Standard vertical reels and showroom delivery clips are processed and delivered in 48-72 hours. Wedding films, event collections, and multi-cam business promotional edits require 2 to 3 weeks unless priority rush terms are purchased.
          </p>
        </div>
      </section>
    </>
  );
}
