import PageHeader from "../components/PageHeader";
import useSEO from "../hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy | Legal",
    description: "Privacy policy terms for All in All Azhaguraja studio services."
  });

  return (
    <>
      <PageHeader
        eyebrow="LEGAL"
        title="Privacy Policy"
        description="Last updated August 2026. Review how we manage customer details and content permissions."
      />
      <section className="bg-paper py-20 px-6 font-sans text-ink leading-relaxed">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 text-sm text-slate-soft">
          <p>
            At <strong>ALL IN ALL AZHAGURAJA</strong>, we respect your privacy. Any personal information (including name, email address, phone number, and location details) submitted via our booking or enquiry forms is used solely to coordinate your production shoots. We never sell, lease, or share your details with third-party advertising networks.
          </p>
          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">1. Collected Media and Release Permissions</h3>
          <p>
            As a photography and videography studio, we produce photo reels and video clips. We acquire explicit permission (often outlined in booking retainers) before publishing client deliveries on our public portfolio or social media platforms.
          </p>
          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">2. Local Storage Usage</h3>
          <p>
            Our website uses browser cookies and local storage to maintain session states and temporary mock database states for admin testing.
          </p>
        </div>
      </section>
    </>
  );
}
