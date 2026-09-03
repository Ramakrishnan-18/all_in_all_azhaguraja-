// Mock database with LocalStorage persistence for ALL IN ALL AZHAGURAJA
// Enables Admin dashboard CRUD changes to persist immediately on page refresh.

const STORAGE_KEYS = {
  PROJECTS: "azhaguraja_projects",
  TESTIMONIALS: "azhaguraja_testimonials",
  ENQUIRIES: "azhaguraja_enquiries",
  SERVICES: "azhaguraja_services",
  PACKAGES: "azhaguraja_packages",
  SETTINGS: "azhaguraja_settings",
  BRAND_MARKETING: "azhaguraja_brand_marketing",
  PHOTOS: "azhaguraja_photos",
  REELS: "azhaguraja_reels",
};

// Initial data templates
const initialServices = [
  {
    id: "s1",
    title: "Personal Reels",
    description: "Cinematic, slow-motion, and high-energy vertical reels to showcase your personality, style, or talent. Ideal for influencers, creators, and personal branding.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    features: ["1-2 hours shoot time", "Professional lighting & audio setup", "Color grading & trend-aligned transitions", "Delivered in 9:16 high-definition format"],
    startingPrice: 1000,
    enabled: true
  },
  {
    id: "s2",
    title: "Car & Bike Delivery Reels",
    description: "High-octane delivery reels capturing the thrill of driving/riding your new vehicle off the showroom floor. Features dynamic angles, speed ramps, and epic music beats.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    features: ["Showroom location coverage", "Stabilized cinematic tracking shots", "Engine sound design integration", "Same-day delivery option"],
    startingPrice: 1000,
    enabled: true
  },
  {
    id: "s3",
    title: "Event Photography & Videography",
    description: "Full-scale coverage of weddings, engagements, birthday bashes, and corporate milestones in Tirunelveli. We capture the emotions, details, and major highlights.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    features: ["Candid & traditional photography", "Ultra-HD highlights video & full coverage", "High-end post-production editing", "Digital download gallery access"],
    startingPrice: 1800,
    enabled: true
  },
  {
    id: "s4",
    title: "Marketing Reels",
    description: "Short-form advertising reels built to convert. Perfect for local shops, cafes, clothing lines, and businesses looking to drive enquiries through Instagram and YouTube.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    features: ["Hook-oriented script assist", "Product & customer-experience highlights", "Call-to-action overlays", "Optimized for Instagram ads"],
    startingPrice: 1500,
    enabled: true
  },
  {
    id: "s5",
    title: "Business Promotional Videos",
    description: "Premium landscape-oriented corporate profiles, brand story films, and commercial ads to explain your business vision, showcase facilities, and build professional authority.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    features: ["Pre-production strategy & scriptwriting", "Interview & B-roll multi-cam capture", "Professional voiceover & licensed music", "Full HD/4K master delivery"],
    startingPrice: 2500,
    enabled: true
  },
  {
    id: "s6",
    title: "Social Media Content Creation",
    description: "End-to-end content retainer packs. We shoot and edit high-performing videos on a monthly cycle to maintain your brand's presence on Instagram, TikTok, and YouTube.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    features: ["Monthly content planning sessions", "Batch shooting (6-12 reels per session)", "Trending audio selection & editing styles", "Consistent brand tone maintenance"],
    startingPrice: 1500,
    enabled: true
  }
];

const initialPackages = [
  { id: "pk1", category: "Personal Reels", packageName: "Basic", price: 1000, features: ["1 Hour shoot time", "1 Edited Reel (up to 30s)", "Basic color correction", "Standard music sync", "2 revisions"], enabled: true },
  { id: "pk2", category: "Personal Reels", packageName: "Standard", price: 1500, features: ["2 Hours shoot time", "1 Cinematic Reel (up to 60s)", "Advanced color grading", "Sound design & SFX", "3 revisions", "Social media hook helper"], enabled: true },
  { id: "pk3", category: "Personal Reels", packageName: "Premium", price: 2500, features: ["4 Hours shoot time", "2 Cinematic Reels (up to 90s)", "Custom concept development", "High-end color grading + sound design", "Unlimited revisions", "4K delivery"], enabled: true },

  { id: "pk4", category: "Car & Bike Delivery Reels", packageName: "Basic", price: 1000, features: ["Showroom delivery shoot", "1 Short reel (20-30s)", "Basic music alignment", "Standard grading"], enabled: true },
  { id: "pk5", category: "Car & Bike Delivery Reels", packageName: "Standard", price: 1500, features: ["Showroom + short drive shoot", "1 Dynamic cinematic reel (45s)", "Stabilized gimbal tracking", "Speed ramping edits", "Engine exhaust audio integration"], enabled: true },
  { id: "pk6", category: "Car & Bike Delivery Reels", packageName: "Premium", price: 2500, features: ["Full delivery coverage + sunset drive", "1 Premium cinematic reel (60s)", "Drone/stabilized action shots", "Vehicle owner quick photoshoot", "Next-day delivery"], enabled: true },

  { id: "pk7", category: "Event Photography & Videography", packageName: "Basic", price: 1800, features: ["1 Photographer/Videographer", "2 Hours event coverage", "50 edited photos or 1-minute highlight video", "Online gallery link"], enabled: true },
  { id: "pk8", category: "Event Photography & Videography", packageName: "Standard", price: 2500, features: ["2 Crew members", "4 Hours event coverage", "100+ edited photos", "2-minute cinematic highlight reel", "Digital storage drive delivery"], enabled: true },
  { id: "pk9", category: "Event Photography & Videography", packageName: "Premium", price: 3000, features: ["3 Crew members", "Full-day event coverage", "250+ fully edited photos", "5-minute mini-movie / highlights film", "Raw footage backup", "Priority 5-day delivery"], enabled: true },

  { id: "pk10", category: "Marketing Reels", packageName: "Basic", price: 1500, features: ["1 Product/Business Reel", "30-second duration", "Standard editing", "Logo overlay & CTA"], enabled: true },
  { id: "pk11", category: "Marketing Reels", packageName: "Standard", price: 2500, features: ["2 Marketing Reels", "Up to 60-second duration", "Professional lighting & script assist", "Kinetic typography subtitles", "Trending audio strategy"], enabled: true },
  { id: "pk12", category: "Marketing Reels", packageName: "Premium", price: 4000, features: ["4 Marketing Reels (Bulk pack)", "High-end product showcase layouts", "Voiceover sync & custom SFX", "Competitor analysis & scroll-stopping hooks", "A/B testing editing alternatives"], enabled: true }
];

const initialProjects = [
  {
    id: "pr1",
    title: "Nellai Cafe — Sensory Brand Reel",
    category: "Business/Marketing",
    description: "A fast-paced, highly visual marketing reel shot for Nellai Cafe in Tirunelveli. Captured the aroma of filter coffee, steam, and freshly made snacks using macro lenses and quick speed ramps to drive local foot traffic.",
    location: "Tirunelveli Town",
    date: "2026-05-10",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "Cafe Brand Reel", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Nellai Cafe",
    featured: true,
    published: true
  },
  {
    id: "pr2",
    title: "Yamaha R15 V4 — Delivery Thrill",
    category: "Car/Bike Delivery",
    description: "An epic, high-energy delivery reel shot at the Tirunelveli Yamaha showroom. Focuses on the shiny dark aesthetics of the new R15 V4, exhaust sound, key handover, and first ride-out.",
    location: "Vannarpettai, Tirunelveli",
    date: "2026-06-01",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "R15 V4 Delivery", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Sudhakar S.",
    featured: true,
    published: true
  },
  {
    id: "pr3",
    title: "The Heritage Wedding of S&A",
    category: "Events",
    description: "Three days of traditional wedding celebrations in Nellai. Combining warm temple backdrops, traditional nadaswaram cues, and slow-moving tracking shots.",
    location: "Kanyakumari Road, Tirunelveli",
    date: "2026-04-18",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "Wedding Teaser", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Suresh & Ananya",
    featured: true,
    published: true
  },
  {
    id: "pr4",
    title: "Street Style — Personal Reel",
    category: "Personal Reels",
    description: "An urban lifestyle reel shot against vintage architecture. Highlighting style, fashion flow, and modern rapid transitions.",
    location: "Town, Tirunelveli",
    date: "2026-07-02",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "Fashion Reel", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Kavitha M.",
    featured: false,
    published: true
  },
  {
    id: "pr5",
    title: "Royal Enfield Classic 350 — Stealth Black",
    category: "Car/Bike Delivery",
    description: "Thunderous thump of the Royal Enfield Classic 350 captured right at delivery moment. Sunset cruise across High Ground, Tirunelveli.",
    location: "High Ground, Tirunelveli",
    date: "2026-03-20",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "Royal Enfield Delivery", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Dinesh Kumar",
    featured: true,
    published: true
  },
  {
    id: "pr6",
    title: "Trend Apparel — Festive Collection",
    category: "Business/Marketing",
    description: "Fast-cut, vibrant commercial reel showcasing ethnic and modern festive wear collections with kinetic typography.",
    location: "Palayamkottai, Tirunelveli",
    date: "2026-01-28",
    year: 2026,
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
    ],
    videos: [
      { type: "reel", title: "Apparel Season Launch", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" }
    ],
    client: "Trend Apparel",
    featured: true,
    published: true
  }
];

// Photo gallery collection (managed from the Photos admin page)
const initialPhotos = [
  {
    id: "ph1",
    title: "Golden Hour Portrait",
    category: "Portraits",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
    location: "Palayamkottai, Tirunelveli",
    date: "2026-07-10",
    published: true
  },
  {
    id: "ph2",
    title: "Yamaha R15 V4 — Delivery Day Handover",
    category: "Car & Bike",
    url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    location: "Vannarpettai, Tirunelveli",
    date: "2026-06-01",
    published: true
  },
  {
    id: "ph3",
    title: "The Heritage Temple Wedding",
    category: "Events",
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
    location: "Kanyakumari Road, Tirunelveli",
    date: "2026-04-18",
    published: true
  },
  {
    id: "ph4",
    title: "Nellai Cafe — Filter Coffee Pour",
    category: "Food",
    url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop",
    location: "Tirunelveli Town",
    date: "2026-05-10",
    published: true
  },
  {
    id: "ph5",
    title: "Street Style — Urban Fashion",
    category: "Portraits",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    location: "Town, Tirunelveli",
    date: "2026-07-02",
    published: true
  },
  {
    id: "ph6",
    title: "Royal Enfield Classic — Stealth First Ride",
    category: "Car & Bike",
    url: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop",
    location: "High Ground, Tirunelveli",
    date: "2026-03-20",
    published: true
  },
  {
    id: "ph7",
    title: "Birthday Bash — Festive Aesthetic",
    category: "Events",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    location: "Junction, Tirunelveli",
    date: "2026-02-14",
    published: true
  },
  {
    id: "ph8",
    title: "Trend Apparel — Festive Ethnic Wear",
    category: "Commercial",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    location: "Palayamkottai",
    date: "2026-01-28",
    published: true
  },
  {
    id: "ph9",
    title: "Cinematic Couple Pre-Wedding",
    category: "Events",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    location: "Courtallam, Tirunelveli",
    date: "2026-06-20",
    published: true
  },
  {
    id: "ph10",
    title: "Suzuki Gixxer — Night Delivery",
    category: "Car & Bike",
    url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    location: "Tirunelveli",
    date: "2026-05-05",
    published: true
  },
  {
    id: "ph11",
    title: "Lifestyle Portrait — Park Shoot",
    category: "Portraits",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    location: "VOC Park, Tirunelveli",
    date: "2026-07-15",
    published: true
  },
  {
    id: "ph12",
    title: "Artisanal Biryani & Cuisine Styling",
    category: "Food",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    location: "Palayamkottai",
    date: "2026-04-02",
    published: true
  }
];

// Reels collection (managed from the Reels admin page)
const initialReels = [
  {
    id: "rl1",
    title: "Yamaha R15 V4 — Delivery Day Thrill",
    category: "Car/Bike Delivery",
    client: "Sudhakar S.",
    location: "Vannarpettai, Tirunelveli",
    poster: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  },
  {
    id: "rl2",
    title: "Nellai Cafe — Sensory Filter Coffee Reel",
    category: "Business/Marketing",
    client: "Nellai Cafe",
    location: "Tirunelveli Town",
    poster: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  },
  {
    id: "rl3",
    title: "Street Style — Urban Flow & Transitions",
    category: "Personal Reels",
    client: "Kavitha M.",
    location: "Town, Tirunelveli",
    poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  },
  {
    id: "rl4",
    title: "The Heritage Wedding of S & A — Teaser",
    category: "Events",
    client: "Suresh & Ananya",
    location: "Kanyakumari Road, Tirunelveli",
    poster: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  },
  {
    id: "rl5",
    title: "Royal Enfield Classic 350 — Stealth Delivery",
    category: "Car/Bike Delivery",
    client: "Dinesh Kumar",
    location: "High Ground, Tirunelveli",
    poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  },
  {
    id: "rl6",
    title: "Trend Apparel — Festive Collection Launch",
    category: "Business/Marketing",
    client: "Trend Apparel",
    location: "Palayamkottai",
    poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    published: true
  }
];

const initialBrandMarketing = [
  {
    id: "bm1",
    brandName: "Yamaha Motors Nellai",
    tagline: "High-Energy Delivery Reels",
    description: "Shot custom launch & handover reels for the new R15 V4. Paced transitions and roaring exhaust sound design increased Instagram video engagement by 180% and drove direct showroom enquiries.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    enabled: true
  },
  {
    id: "bm2",
    brandName: "Nellai Filter Cafe",
    tagline: "Sensory Macro Commercial",
    description: "A conversion-driven vertical promo capturing steam, coffee drops, and authentic snack styling. Tailored hooks stopped user scrolls, converting digital views into local cafe foot traffic.",
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    enabled: true
  },
  {
    id: "bm3",
    brandName: "Trend Apparel Town",
    tagline: "Style Showcase Reels",
    description: "Fashion aesthetics shot against historical Tirunelveli architectures. Combined modern tracking camera work and dynamic speed ramps to highlight seasonal clothing launches.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    enabled: true
  }
];

const initialTestimonials = [
  {
    id: "t1",
    clientName: "Sudhakar S.",
    clientImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    review: "Azhaguraja and his crew made my bike delivery reel feel like a Hollywood movie teaser! The sound design was spot-on.",
    project: "Yamaha R15 Delivery Reel",
    rating: 5,
    date: "2026-06-03"
  },
  {
    id: "t2",
    clientName: "Meenakshi Sundaram",
    clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    review: "Absolutely outstanding coverage for our store launch in Palayamkottai. Within 2 days we got 40+ walk-ins.",
    project: "Nellai Cafe Launch Campaign",
    rating: 5,
    date: "2026-05-15"
  }
];

const initialSettings = {
  brandName: "ALL IN ALL AZHAGURAJA",
  tagline: "Create Moments, Build Brands",
  contactPhone: "+91 94884 12345",
  contactWhatsApp: "919488412345",
  contactEmail: "allinallazhaguraja@gmail.com",
  instagramUrl: "https://instagram.com/all_in_all_azhaguraja",
  youtubeUrl: "https://youtube.com/@allinallazhaguraja",
  location: "Palayamkottai, Tirunelveli, Tamil Nadu",
  workingHours: "10:00 AM - 8:00 PM",
  apiBaseUrl: import.meta.env.VITE_API_URL || ""
};

// Helper: safe JSON parsing
const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

// Seed function
export function seedDB() {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    setStored(STORAGE_KEYS.SERVICES, initialServices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    setStored(STORAGE_KEYS.PACKAGES, initialPackages);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    setStored(STORAGE_KEYS.PROJECTS, initialProjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    setStored(STORAGE_KEYS.TESTIMONIALS, initialTestimonials);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    setStored(STORAGE_KEYS.ENQUIRIES, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, initialSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BRAND_MARKETING)) {
    setStored(STORAGE_KEYS.BRAND_MARKETING, initialBrandMarketing);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PHOTOS)) {
    setStored(STORAGE_KEYS.PHOTOS, initialPhotos);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REELS)) {
    setStored(STORAGE_KEYS.REELS, initialReels);
  }
}

seedDB();

export const _db = {
  getProjects: () => getStored(STORAGE_KEYS.PROJECTS, initialProjects),
  setProjects: (next) => setStored(STORAGE_KEYS.PROJECTS, next),

  getTestimonials: () => getStored(STORAGE_KEYS.TESTIMONIALS, initialTestimonials),
  setTestimonials: (next) => setStored(STORAGE_KEYS.TESTIMONIALS, next),

  getServices: () => getStored(STORAGE_KEYS.SERVICES, initialServices),
  setServices: (next) => setStored(STORAGE_KEYS.SERVICES, next),

  getPackages: () => getStored(STORAGE_KEYS.PACKAGES, initialPackages),
  setPackages: (next) => setStored(STORAGE_KEYS.PACKAGES, next),

  getEnquiries: () => getStored(STORAGE_KEYS.ENQUIRIES, []),
  setEnquiries: (next) => setStored(STORAGE_KEYS.ENQUIRIES, next),
  addEnquiry: (e) => {
    const list = getStored(STORAGE_KEYS.ENQUIRIES, []);
    const newEnq = {
      ...e,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new"
    };
    setStored(STORAGE_KEYS.ENQUIRIES, [newEnq, ...list]);
  },

  getSettings: () => getStored(STORAGE_KEYS.SETTINGS, initialSettings),
  setSettings: (next) => setStored(STORAGE_KEYS.SETTINGS, next),

  getBrandMarketing: () => getStored(STORAGE_KEYS.BRAND_MARKETING, initialBrandMarketing),
  setBrandMarketing: (next) => setStored(STORAGE_KEYS.BRAND_MARKETING, next),

  getPhotos: () => getStored(STORAGE_KEYS.PHOTOS, initialPhotos),
  setPhotos: (next) => setStored(STORAGE_KEYS.PHOTOS, next),

  getReels: () => getStored(STORAGE_KEYS.REELS, initialReels),
  setReels: (next) => setStored(STORAGE_KEYS.REELS, next),
};

export const studioStats = [
  { label: "Personal Reels Shot", value: 120, suffix: "+" },
  { label: "Happy Clients", value: 98, suffix: "%" },
  { label: "Car & Bike Deliveries", value: 85, suffix: "+" },
  { label: "Tirunelveli Events Covered", value: 50, suffix: "+" },
];
