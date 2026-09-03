import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./SplitServices.css";

const weddingItems = [
  "Wedding Photography", "Wedding Films", "Engagements", "Receptions",
  "Birthdays", "Cultural Functions", "Corporate Events", "Other Events",
];
const brandItems = [
  "Brand Films", "Product Photography", "Commercial Videos",
  "Social Media Content", "Campaign Photography", "Promotional Videos",
];

function Panel({ side, hovered, setHovered, title, sceneLabel, image, items, to, ctaLabel }) {
  const isHovered = hovered === side;
  const isDimmed = hovered && hovered !== side;

  return (
    <motion.div
      onMouseEnter={() => setHovered(side)}
      onMouseLeave={() => setHovered(null)}
      animate={{ flexGrow: isHovered ? 1.25 : isDimmed ? 0.8 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="split-panel group"
    >
      <img
        src={image}
        alt=""
        className="split-panel-img group-hover:scale-105"
      />
      <div className={`absolute inset-0 ${side === "wedding" ? "bg-studio-blue-deep/80" : "bg-ink/80"} transition-opacity duration-500`} />

      <div className="split-panel-content">
        <p className="split-panel-scene">{sceneLabel}</p>

        <div>
          <h3 className="split-panel-title">{title}</h3>
          <ul className="split-panel-list">
            {items.map((it) => (
              <li key={it} className="split-panel-list-item">
                <span className="split-panel-bullet" /> {it}
              </li>
            ))}
          </ul>
          <Link
            to={to}
            className="split-panel-cta"
          >
            {ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SplitServices() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="split-wrapper">
      <div className="split-header">
        <p className="split-header-eyebrow">Two lines, one standard</p>
        <h2 className="split-header-title">
          Every project runs on one of two tracks.
        </h2>
      </div>
      <div className="split-panels-container">
        <Panel
          side="wedding"
          hovered={hovered}
          setHovered={setHovered}
          title="Weddings & Events"
          sceneLabel="SCENE 01 — CEREMONY"
          image="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1400&auto=format&fit=crop"
          items={weddingItems}
          to="/weddings-events"
          ctaLabel="Explore Weddings & Events"
        />
        <Panel
          side="brand"
          hovered={hovered}
          setHovered={setHovered}
          title="Brand Marketing"
          sceneLabel="SCENE 02 — CAMPAIGN"
          image="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1400&auto=format&fit=crop"
          items={brandItems}
          to="/brand-marketing"
          ctaLabel="Explore Brand Marketing"
        />
      </div>
    </section>
  );
}
