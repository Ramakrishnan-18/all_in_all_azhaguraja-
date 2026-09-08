import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import "./NotFound.css";

export default function NotFound() {
  useSEO({ title: "Page Not Found | 404" });

  return (
    <div className="nf-wrapper">
      <p className="nf-eyebrow">404</p>
      <h1 className="nf-title">This frame doesn't exist.</h1>
      <Link to="/" className="nf-btn">Back to home</Link>
    </div>
  );
}
