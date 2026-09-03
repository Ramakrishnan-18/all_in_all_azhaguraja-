import "./Loader.css";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p className="loader-label">{label}</p>
    </div>
  );
}
