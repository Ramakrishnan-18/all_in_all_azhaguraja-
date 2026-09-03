import { Link } from "react-router-dom";
import "./CTASection.css";

export default function CTASection() {
  return (
    <section className="cta-wrapper">
      <p className="cta-eyebrow">Ready when you are</p>
      <h2 className="cta-title">
        Let's put your story on camera.
      </h2>
      <Link
        to="/contact"
        className="cta-btn"
      >
        Book / Enquire
      </Link>
    </section>
  );
}
