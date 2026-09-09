import { useEffect } from "react";

export default function useSEO({ title, description, keywords }) {
  useEffect(() => {
    // Title
    const baseTitle = "ALL IN ALL AZHAGURAJA | Create Moments, Build Brands";
    document.title = title ? `${title} | ALL IN ALL AZHAGURAJA` : baseTitle;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      description ||
        "Premium cinematic photographer and video creator portfolio in Tirunelveli. Specialized in Personal reels, Car/Bike delivery reels, Event Coverage, and Brand Marketing."
    );

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const defaultKeywords =
      "Reels creator in Tirunelveli, Event videography Tirunelveli, Marketing reels Tirunelveli, Car delivery reels, Bike delivery reels, Personal reels, Business promotional videos, Photography Tirunelveli, Videography Tirunelveli";
    metaKeywords.setAttribute('content', keywords || defaultKeywords);

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title ? `${title} | ALL IN ALL AZHAGURAJA` : "ALL IN ALL AZHAGURAJA");

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description || "Create Moments, Build Brands - Cinematic photography and reels creator in Tirunelveli.");
  }, [title, description, keywords]);
}
