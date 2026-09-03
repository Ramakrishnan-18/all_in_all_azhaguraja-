export const initialServices = [
  { title: "Personal Reels", description: "Cinematic, slow-motion, and high-energy vertical reels to showcase your personality, style, or talent.", image: "", features: ["1-2 hours shoot time", "Professional lighting & audio setup", "Color grading & trend-aligned transitions", "Delivered in 9:16 high-definition format"], startingPrice: 1000, enabled: true },
  { title: "Car & Bike Delivery Reels", description: "High-octane delivery reels capturing the thrill of driving/riding your new vehicle off the showroom floor.", image: "", features: ["Showroom location coverage", "Stabilized cinematic tracking shots", "Engine sound design integration", "Same-day delivery option"], startingPrice: 1000, enabled: true },
  { title: "Event Photography & Videography", description: "Full-scale coverage of weddings, engagements, birthday bashes, and corporate milestones in Tirunelveli.", image: "", features: ["Candid & traditional photography", "Ultra-HD highlights video & full coverage", "High-end post-production editing", "Digital download gallery access"], startingPrice: 1800, enabled: true },
  { title: "Marketing Reels", description: "Short-form advertising reels built to convert. Perfect for local shops, cafes, clothing lines, and businesses.", image: "", features: ["Hook-oriented script assist", "Product & customer-experience highlights", "Call-to-action overlays", "Optimized for Instagram ads"], startingPrice: 1500, enabled: true },
  { title: "Business Promotional Videos", description: "Premium landscape-oriented corporate profiles, brand story films, and commercial ads to explain your business vision.", image: "", features: ["Pre-production strategy & scriptwriting", "Interview & B-roll multi-cam capture", "Professional voiceover & licensed music", "Full HD/4K master delivery"], startingPrice: 2500, enabled: true },
  { title: "Social Media Content Creation", description: "End-to-end content retainer packs. We shoot and edit high-performing videos on a monthly cycle.", image: "", features: ["Monthly content planning sessions", "Batch shooting (6-12 reels per session)", "Trending audio selection & editing styles", "Consistent brand tone maintenance"], startingPrice: 1500, enabled: true },
];

export const initialPackages = [
  { category: "Personal Reels", packageName: "Basic", price: 1000, features: ["1 Hour shoot time", "1 Edited Reel (up to 30s)", "Basic color correction", "Standard music sync", "2 revisions"] },
  { category: "Personal Reels", packageName: "Standard", price: 1500, features: ["2 Hours shoot time", "1 Cinematic Reel (up to 60s)", "Advanced color grading", "Sound design & SFX", "3 revisions", "Social media hook helper"] },
  { category: "Personal Reels", packageName: "Premium", price: 2500, features: ["4 Hours shoot time", "2 Cinematic Reels (up to 90s)", "Custom concept development", "High-end color grading + sound design", "Unlimited revisions", "4K delivery"] },
  { category: "Car & Bike Delivery Reels", packageName: "Basic", price: 1000, features: ["Showroom delivery shoot", "1 Short reel (20-30s)", "Basic music alignment", "Standard grading"] },
  { category: "Car & Bike Delivery Reels", packageName: "Standard", price: 1500, features: ["Showroom + short drive shoot", "1 Dynamic cinematic reel (45s)", "Stabilized gimbal tracking", "Speed ramping edits", "Engine exhaust audio integration"] },
  { category: "Car & Bike Delivery Reels", packageName: "Premium", price: 2500, features: ["Full delivery coverage + sunset drive", "1 Premium cinematic reel (60s)", "Drone/stabilized action shots", "Vehicle owner quick photoshoot", "Next-day delivery"] },
  { category: "Event Photography & Videography", packageName: "Basic", price: 1800, features: ["1 Photographer/Videographer", "2 Hours event coverage", "50 edited photos or 1-minute highlight video", "Online gallery link"] },
  { category: "Event Photography & Videography", packageName: "Standard", price: 2500, features: ["2 Crew members", "4 Hours event coverage", "100+ edited photos", "2-minute cinematic highlight reel", "Digital storage drive delivery"] },
  { category: "Event Photography & Videography", packageName: "Premium", price: 3000, features: ["3 Crew members", "Full-day event coverage", "250+ fully edited photos", "5-minute mini-movie / highlights film", "Raw footage backup", "Priority 5-day delivery"] },
  { category: "Marketing Reels", packageName: "Basic", price: 1500, features: ["1 Product/Business Reel", "30-second duration", "Standard editing", "Logo overlay & CTA"] },
  { category: "Marketing Reels", packageName: "Standard", price: 2500, features: ["2 Marketing Reels", "Up to 60-second duration", "Professional lighting & script assist", "Kinetic typography subtitles", "Trending audio strategy"] },
  { category: "Marketing Reels", packageName: "Premium", price: 4000, features: ["4 Marketing Reels (Bulk pack)", "High-end product showcase layouts", "Voiceover sync & custom SFX", "Competitor analysis & scroll-stopping hooks", "A/B testing editing alternatives"] },
];

export const initialProjects = [];

export const initialPhotos = [];

export const initialReels = [];

export const initialBrandMarketing = [];

export const initialTestimonials = [
  { clientName: "Sudhakar S.", clientImage: "", review: "Azhaguraja and his crew made my bike delivery reel feel like a Hollywood movie teaser! The sound design was spot-on.", project: "Yamaha R15 Delivery Reel", rating: 5, date: "2026-06-03" },
  { clientName: "Meenakshi Sundaram", clientImage: "", review: "Absolutely outstanding coverage for our store launch in Palayamkottai. Within 2 days we got 40+ walk-ins.", project: "Nellai Cafe Launch Campaign", rating: 5, date: "2026-05-15" },
];

export const initialSettings = {
  brandName: "ALL IN ALL AZHAGURAJA",
  tagline: "Create Moments, Build Brands",
  contactPhone: "+91 94884 12345",
  contactWhatsApp: "919488412345",
  contactEmail: "allinallazhaguraja@gmail.com",
  instagramUrl: "https://instagram.com/all_in_all_azhaguraja",
  youtubeUrl: "https://youtube.com/@allinallazhaguraja",
  location: "Palayamkottai, Tirunelveli, Tamil Nadu",
  workingHours: "10:00 AM - 8:00 PM",
};

export const initialVideoSources = [
  {
    platform: "instagram",
    name: "All in All Azhaguraja",
    sourceUrl: "https://www.instagram.com/all_in_all_azhaguraja/",
    sourceIdentifier: "all_in_all_azhaguraja",
    isActive: true,
  },
  {
    platform: "youtube",
    name: "All in All Azhaguraja",
    sourceUrl: "https://www.youtube.com/@allinallazhaguraja",
    sourceIdentifier: "@allinallazhaguraja",
    isActive: true,
  },
];
