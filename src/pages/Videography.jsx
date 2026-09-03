import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import VideoPlayer from "../components/VideoPlayer";
import { getProjects } from "../services/projectsService";
import "./Videography.css";

const filters = [
  { value: "all", label: "All" },
  { value: "wedding", label: "Wedding Films" },
  { value: "event", label: "Event Films" },
  { value: "brand", label: "Brand Films & Commercials" },
];

export default function Videography() {
  const [category, setCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects({ category }).then((data) => { setProjects(data); setLoading(false); });
  }, [category]);

  const items = projects.flatMap((p) =>
    (p.videos || []).map((v) => ({ ...v, projectId: p.id, projectTitle: p.title }))
  );

  return (
    <>
      <PageHeader
        eyebrow="Videography"
        title="Motion work — from full wedding films to 30-second commercials."
        description="Every video here starts muted with a poster frame — press play when you're ready."
      />
      <section className="video-page-section">
        <div className="video-page-filter-wrapper">
          <FilterBar options={filters} active={category} onChange={setCategory} />
        </div>
        {loading ? (
          <Loader label="Loading films" />
        ) : items.length === 0 ? (
          <p className="video-page-empty-msg">No films in this category yet.</p>
        ) : (
          <div className="video-page-grid">
            {items.map((v, i) => (
              <div key={i}>
                <VideoPlayer src={v.url} poster={v.poster} title={v.title} />
                <Link to={`/project/${v.projectId}`} className="video-page-project-link">
                  {v.projectTitle}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
