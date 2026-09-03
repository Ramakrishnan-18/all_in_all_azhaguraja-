import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import "./Packages.css";

const categories = [
  { value: "all", label: "All Packages" },
  { value: "personal", label: "Personal Reels" },
  { value: "delivery", label: "Car & Bike Delivery Reels" },
  { value: "events", label: "Event Photography & Videography" },
  { value: "marketing", label: "Marketing Reels" },
];

const packages = [
  // --- Personal Reels ---
  {
    category: "personal",
    categoryLabel: "Personal Reels",
    num: "[05]",
    name: "Basic",
    price: "1,000",
    features: [
      "1 Hour shoot time",
      "1 Edited Reel (up to 30s)",
      "Basic color correction",
      "Standard music sync",
      "2 revisions",
    ],
  },
  {
    category: "personal",
    categoryLabel: "Personal Reels",
    num: "[08]",
    name: "Standard",
    price: "1,500",
    features: [
      "2 Hours shoot time",
      "1 Cinematic Reel (up to 60s)",
      "Advanced color grading",
      "Sound design & SFX",
      "3 revisions",
      "Social media hook helper",
    ],
  },
  {
    category: "personal",
    categoryLabel: "Personal Reels",
    num: "[07]",
    name: "Premium",
    price: "2,500",
    features: [
      "4 Hours shoot time",
      "2 Cinematic Reels (up to 90s)",
      "Custom concept development",
      "High-end color grading + sound design",
      "Unlimited revisions",
      "4K delivery",
    ],
  },

  // --- Car & Bike Delivery Reels ---
  {
    category: "delivery",
    categoryLabel: "Car & Bike Delivery Reels",
    num: "[05]",
    name: "Basic",
    price: "1,000",
    features: [
      "Showroom delivery shoot",
      "1 Short reel (20-30s)",
      "Basic music alignment",
      "Standard grading",
    ],
  },
  {
    category: "delivery",
    categoryLabel: "Car & Bike Delivery Reels",
    num: "[08]",
    name: "Standard",
    price: "1,500",
    features: [
      "Showroom + short drive shoot",
      "1 Dynamic cinematic reel (45s)",
      "Stabilized gimbal tracking",
      "Speed ramping edits",
      "Engine exhaust audio integration",
    ],
  },
  {
    category: "delivery",
    categoryLabel: "Car & Bike Delivery Reels",
    num: "[07]",
    name: "Premium",
    price: "2,500",
    features: [
      "Full delivery coverage + sunset drive",
      "1 Premium cinematic reel (60s)",
      "Drone/stabilized action shots",
      "Vehicle owner quick photoshoot",
      "Next-day delivery",
    ],
  },

  // --- Event Photography & Videography ---
  {
    category: "events",
    categoryLabel: "Event Photography & Videography",
    num: "[05]",
    name: "Basic",
    price: "1,800",
    features: [
      "1 Photographer/Videographer",
      "2 Hours event coverage",
      "50 edited photos or 1-minute highlight video",
      "Online gallery link",
    ],
  },
  {
    category: "events",
    categoryLabel: "Event Photography & Videography",
    num: "[08]",
    name: "Standard",
    price: "2,500",
    features: [
      "2 Crew members",
      "4 Hours event coverage",
      "100+ edited photos",
      "2-minute cinematic highlight reel",
      "Digital storage drive delivery",
    ],
  },
  {
    category: "events",
    categoryLabel: "Event Photography & Videography",
    num: "[07]",
    name: "Premium",
    price: "3,000",
    features: [
      "3 Crew members",
      "Full-day event coverage",
      "250+ fully edited photos",
      "5-minute mini-movie / highlights film",
      "Raw footage backup",
      "Priority 5-day delivery",
    ],
  },

  // --- Marketing Reels ---
  {
    category: "marketing",
    categoryLabel: "Marketing Reels",
    num: "[05]",
    name: "Basic",
    price: "1,500",
    features: [
      "1 Product/Business Reel",
      "30-second duration",
      "Standard editing",
      "Logo overlay & CTA",
    ],
  },
  {
    category: "marketing",
    categoryLabel: "Marketing Reels",
    num: "[08]",
    name: "Standard",
    price: "2,500",
    features: [
      "2 Marketing Reels",
      "Up to 60-second duration",
      "Professional lighting & script assist",
      "Kinetic typography subtitles",
      "Trending audio strategy",
    ],
  },
  {
    category: "marketing",
    categoryLabel: "Marketing Reels",
    num: "[07]",
    name: "Premium",
    price: "4,000",
    features: [
      "4 Marketing Reels (Bulk pack)",
      "High-end product showcase layouts",
      "Voiceover sync & custom SFX",
      "Competitor analysis & scroll-stopping hooks",
      "A/B testing editing alternatives",
    ],
  },
];

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="currentColor"
    className="pk-whatsapp-icon"
  >
    <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.767.46 3.427 1.258 4.894L2 22l5.249-1.378a9.96 9.96 0 0 0 4.763 1.208c5.532 0 9.998-4.48 9.998-10.012C22.01 6.48 17.544 2 12.012 2zm6.366 14.15c-.263.74-.755 1.344-1.376 1.777-.621.433-1.344.621-2.079.621-.341 0-.756-.05-1.222-.19a12.67 12.67 0 0 1-2.585-1.12c-.933-.553-1.745-1.242-2.42-2.049-.675-.807-1.189-1.688-1.523-2.618a8.878 8.878 0 0 1-.581-2.316c-.027-.723.155-1.425.537-2.036.381-.61.907-1.077 1.558-1.344.208-.088.423-.131.642-.131.144 0 .285.027.42.083.136.056.252.147.34.272.247.381.536.877.854 1.464.318.587.587 1.096.793 1.503a.47.47 0 0 1 .054.345.894.894 0 0 1-.225.438c-.146.17-.308.337-.478.498-.17.161-.318.318-.439.467-.12.148-.21.288-.266.42a1.36 1.36 0 0 0 .193.993c.318.552.747 1.09 1.272 1.597.525.508 1.092.935 1.684 1.267.332.186.666.27.994.254.327-.016.621-.133.873-.347.161-.139.33-.298.5-.472.169-.174.331-.337.479-.479.13-.12.274-.183.424-.183h.143c.123 0 .252.023.38.07.129.047.247.112.35.193a20.08 20.08 0 0 1 1.708 1.488c.28.272.482.493.593.652.12.161.166.331.139.516z" />
  </svg>
);

export default function Packages() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPackages =
    activeTab === "all"
      ? packages
      : packages.filter((p) => p.category === activeTab);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Transparent pricing built for creators, brands and events."
        description="Select a package category below to view our tiers. All packages include pre-production planning and standard post-production."
      />

      <section className="pk-section">
        <div className="pk-filter-wrapper">
          <FilterBar
            options={categories}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="pk-grid">
          {filteredPackages.map((pkg, index) => {
            const contactUrl = `/contact?service=${encodeURIComponent(
              pkg.categoryLabel + " - " + pkg.name
            )}`;
            const whatsAppUrl = `https://wa.me/919876543210?text=Hi,%20I'm%20interested%20in%20your%20${encodeURIComponent(
              pkg.name + " " + pkg.categoryLabel
            )}%20package.`;

            return (
              <div key={pkg.category + pkg.name + index} className="pk-card">
                <div className="pk-card-header">
                  <span className="pk-card-badge">{pkg.categoryLabel}</span>
                  <span className="pk-card-number">{pkg.num}</span>
                </div>

                <h3 className="pk-card-name">{pkg.name}</h3>

                <p className="pk-label">Investment</p>
                <p className="pk-price">₹{pkg.price}</p>

                <p className="pk-features-label">Package Features:</p>
                <ul className="pk-features-list">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="pk-feature-item">
                      <Check size={14} className="pk-checkmark" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <Link to={contactUrl} className="pk-btn-choose">
                    Choose Package
                  </Link>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pk-btn-whatsapp"
                  >
                    <WhatsAppIcon />
                    <span>Enquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
