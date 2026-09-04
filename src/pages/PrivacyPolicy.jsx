import PageHeader from "../components/PageHeader";
import useSEO from "../hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy | All in All Azhaguraja",
    description: "Privacy policy for All in All Azhaguraja photography and videography studio in Tirunelveli."
  });

  return (
    <>
      <PageHeader
        eyebrow="LEGAL"
        title="Privacy Policy"
        description="Last updated September 2026. Review how we manage your data and content permissions."
      />
      <section className="bg-paper py-20 px-6 font-sans text-ink leading-relaxed">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 text-sm text-slate-soft">
          <p>
            At <strong>ALL IN ALL AZHAGURAJA</strong>, based in Palayamkottai, Tirunelveli, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">1. Information We Collect</h3>
          <p>
            When you submit a booking enquiry, contact form, or interact with our services, we may collect:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 ml-4">
            <li>Full name, email address, and phone number</li>
            <li>Shoot location and preferred event dates</li>
            <li>Service preferences and shoot type details</li>
            <li>Payment information processed through secure third-party gateways</li>
          </ul>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">2. How We Use Your Information</h3>
          <p>
            Your personal data is used exclusively to:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 ml-4">
            <li>Coordinate and schedule your photography or videography shoots</li>
            <li>Send booking confirmations, invoices, and delivery updates via email</li>
            <li>Respond to your enquiries and provide customer support</li>
            <li>Improve our services and website experience</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, lease, or share your personal information with third-party advertising networks or data brokers.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">3. Collected Media and Release Permissions</h3>
          <p>
            As a photography and videography studio, we create photo reels, video clips, and other visual content. We acquire explicit written permission before publishing any client deliveries on our public portfolio, website, or social media platforms. You retain full ownership of your personal media.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">4. Cookies and Local Storage</h3>
          <p>
            Our website uses browser cookies and local storage to maintain session states, remember preferences, and ensure secure admin authentication. You may disable cookies in your browser settings, though some features may not function properly.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">5. Data Security</h3>
          <p>
            We implement industry-standard security measures including encrypted data transmission (HTTPS), secure authentication tokens, and role-based access controls to protect your personal information from unauthorized access or disclosure.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">6. Third-Party Services</h3>
          <p>
            We use trusted third-party services for specific operations:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 ml-4">
            <li><strong>Cloudinary</strong> — for secure media storage and delivery</li>
            <li><strong>EmailJS</strong> — for sending enquiry confirmations</li>
            <li><strong>WhatsApp</strong> — for direct client communication</li>
          </ul>
          <p>
            These services operate under their own privacy policies and only receive data necessary for their specific function.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">7. Data Retention</h3>
          <p>
            We retain your booking and enquiry data for as long as necessary to provide our services and maintain business records. You may request deletion of your personal data by contacting us directly.
          </p>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">8. Your Rights</h3>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-1 ml-4">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for media publication at any time</li>
          </ul>

          <h3 className="font-display text-lg font-bold text-ink mt-4 uppercase">9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the revised policy.
          </p>

          <h3 className="font-display text-lg font font-bold text-ink mt-4 uppercase">10. Contact Us</h3>
          <p>
            For any questions about this Privacy Policy or to exercise your data rights, contact us at{" "}
            <a href="mailto:sakthiveeraputhiran50@gmail.com" className="text-studio-blue hover:underline">sakthiveeraputhiran50@gmail.com</a>{" "}
            or reach us on{" "}
            <a href="https://wa.me/919345552352" target="_blank" rel="noopener noreferrer" className="text-studio-blue hover:underline">WhatsApp at +91 93455 52352</a>.
          </p>
        </div>
      </section>
    </>
  );
}
