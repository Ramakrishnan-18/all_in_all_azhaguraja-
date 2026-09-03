import "./FilterBar.css";

export default function FilterBar({ options, active, onChange }) {
  return (
    <div className="filter-container">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`filter-btn ${
            active === opt.value
              ? "filter-btn-active"
              : "filter-btn-inactive"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
