import { useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import Lightbox from "../components/Lightbox";
import { useProjects } from "../hooks/useProjects";
import "./WeddingsEvents.css";

const filters = [
  { value: "all", label: "All" },
  { value: "Wedding", label: "Weddings" },
  { value: "Engagement", label: "Engagement" },
  { value: "Reception", label: "Reception" },
  { value: "Birthday", label: "Birthday" },
  { value: "Cultural", label: "Cultural" },
  { value: "Corporate", label: "Corporate" },
  { value: "Other Events", label: "Other Events" },
];

export default function WeddingsEvents() {
  const [subcategory, setSubcategory] = useState("all");
  const [viewMode, setViewMode] = useState("stories");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { projects, loading } = useProjects({ subcategory });
  // Weddings & Events spans both the "wedding" and "event" backend categories
  const scoped = projects.filter((p) => p.category === "wedding" || p.category === "event");

  const images = scoped.flatMap((p) =>
    (p.gallery || []).map((src) => ({ src, title: p.title, subcategory: p.subcategory }))
  );

  return (
    <>
      <PageHeader
        eyebrow="Portfolio — Weddings & Events"
        title="Every ceremony, celebration and gathering we've been trusted with."
        description="From two-day weddings to backyard birthdays — documented as they actually happened."
      />
      <section className="we-section">
        <div className="we-header">
          <FilterBar options={filters} active={subcategory} onChange={setSubcategory} />
          <div className="we-toggle-container">
            <button
              onClick={() => setViewMode("stories")}
              className={`we-toggle-btn ${
                viewMode === "stories" ? "we-toggle-btn-active" : "we-toggle-btn-inactive"
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setViewMode("photos")}
              className={`we-toggle-btn ${
                viewMode === "photos" ? "we-toggle-btn-active" : "we-toggle-btn-inactive"
              }`}
            >
              Photos
            </button>
          </div>
        </div>

        {loading ? (
          <Loader label={viewMode === "stories" ? "Loading projects" : "Loading photos"} />
        ) : viewMode === "stories" ? (
          scoped.length === 0 ? (
            <p className="we-empty-msg">No projects in this category yet.</p>
          ) : (
            <div className="we-stories-grid">
              {scoped.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )
        ) : (
          images.length === 0 ? (
            <p className="we-empty-msg">No photos in this category yet.</p>
          ) : (
            <div className="we-photos-columns">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="we-photo-btn group"
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className="we-photo-img group-hover:scale-105"
                  />
                  <span className="we-photo-overlay group-hover:opacity-100">
                    <span className="we-photo-eyebrow">{img.subcategory}</span>
                  </span>
                </button>
              ))}
            </div>
          )
        )}
      </section>
      <Lightbox
        images={images.map((i) => i.src)}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
