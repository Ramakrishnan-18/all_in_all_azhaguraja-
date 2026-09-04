// Mock database with LocalStorage persistence for ALL IN ALL AZHAGURAJA
// Enables Admin dashboard CRUD changes to persist immediately on page refresh.

const STORAGE_KEYS = {
  SERVICES: "azhaguraja_services",
  PACKAGES: "azhaguraja_packages",
  SETTINGS: "azhaguraja_settings",
  SEED_VERSION: "azhaguraja_seed_version",
};

const CURRENT_SEED_VERSION = 2;

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
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    features: ["Showroom location coverage", "Stabilized cinematic tracking shots", "Engine sound design integration", "Same-day delivery option"],
    startingPrice: 1000,
    enabled: true
  },
  {
    id: "s3",
    title: "Event Photography & Videography",
    description: "Full-scale coverage of weddings, engagements, birthday bashes, and corporate milestones in Tirunelveli. We capture the emotions, details, and major highlights.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    features: ["Candid & traditional photography", "Ultra-HD highlights video & full coverage", "High-end post-production editing", "Digital download gallery access"],
    startingPrice: 1800,
    enabled: true
  },
  {
    id: "s4",
    title: "Marketing Reels",
    description: "Short-form advertising reels built to convert. Perfect for local shops, cafes, clothing lines, and businesses looking to drive enquiries through Instagram and YouTube.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    features: ["Hook-oriented script assist", "Product & customer-experience highlights", "Call-to-action overlays", "Optimized for Instagram ads"],
    startingPrice: 1500,
    enabled: true
  },
  {
    id: "s5",
    title: "Business Promotional Videos",
    description: "Premium landscape-oriented corporate profiles, brand story films, and commercial ads to explain your business vision, showcase facilities, and build professional authority.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    features: ["Pre-production strategy & scriptwriting", "Interview & B-roll multi-cam capture", "Professional voiceover & licensed music", "Full HD/4K master delivery"],
    startingPrice: 2500,
    enabled: true
  },
  {
    id: "s6",
    title: "Social Media Content Creation",
    description: "End-to-end content retainer packs. We shoot and edit high-performing videos on a monthly cycle to maintain your brand's presence on Instagram, TikTok, and YouTube.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=800&auto=format&fit=crop",
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

export function seedDB() {
  const storedVersion = Number(localStorage.getItem(STORAGE_KEYS.SEED_VERSION)) || 0;

  if (storedVersion < CURRENT_SEED_VERSION) {
    setStored(STORAGE_KEYS.SERVICES, initialServices);
    setStored(STORAGE_KEYS.PACKAGES, initialPackages);
    setStored(STORAGE_KEYS.SETTINGS, initialSettings);
    localStorage.setItem(STORAGE_KEYS.SEED_VERSION, CURRENT_SEED_VERSION);
    return;
  }

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    setStored(STORAGE_KEYS.SERVICES, initialServices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    setStored(STORAGE_KEYS.PACKAGES, initialPackages);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStored(STORAGE_KEYS.SETTINGS, initialSettings);
  }
}

seedDB();

export const _db = {
  getServices: () => getStored(STORAGE_KEYS.SERVICES, initialServices),
  setServices: (next) => setStored(STORAGE_KEYS.SERVICES, next),
  getPackages: () => getStored(STORAGE_KEYS.PACKAGES, initialPackages),
  setPackages: (next) => setStored(STORAGE_KEYS.PACKAGES, next),
  getSettings: () => getStored(STORAGE_KEYS.SETTINGS, initialSettings),
  setSettings: (next) => setStored(STORAGE_KEYS.SETTINGS, next),
};

export const studioStats = [
  { label: "Personal Reels Shot", value: 120, suffix: "+" },
  { label: "Happy Clients", value: 98, suffix: "%" },
  { label: "Car & Bike Deliveries", value: 85, suffix: "+" },
  { label: "Tirunelveli Events Covered", value: 50, suffix: "+" },
];
