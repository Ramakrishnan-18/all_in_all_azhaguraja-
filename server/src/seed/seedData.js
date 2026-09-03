// Initial seed data mirroring the frontend's mockData.js
export const initialServices = [
  { title: "Personal Reels", description: "Cinematic, slow-motion, and high-energy vertical reels to showcase your personality, style, or talent.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", features: ["1-2 hours shoot time", "Professional lighting & audio setup", "Color grading & trend-aligned transitions", "Delivered in 9:16 high-definition format"], startingPrice: 1000, enabled: true },
  { title: "Car & Bike Delivery Reels", description: "High-octane delivery reels capturing the thrill of driving/riding your new vehicle off the showroom floor.", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop", features: ["Showroom location coverage", "Stabilized cinematic tracking shots", "Engine sound design integration", "Same-day delivery option"], startingPrice: 1000, enabled: true },
  { title: "Event Photography & Videography", description: "Full-scale coverage of weddings, engagements, birthday bashes, and corporate milestones in Tirunelveli.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop", features: ["Candid & traditional photography", "Ultra-HD highlights video & full coverage", "High-end post-production editing", "Digital download gallery access"], startingPrice: 1800, enabled: true },
  { title: "Marketing Reels", description: "Short-form advertising reels built to convert. Perfect for local shops, cafes, clothing lines, and businesses.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", features: ["Hook-oriented script assist", "Product & customer-experience highlights", "Call-to-action overlays", "Optimized for Instagram ads"], startingPrice: 1500, enabled: true },
  { title: "Business Promotional Videos", description: "Premium landscape-oriented corporate profiles, brand story films, and commercial ads to explain your business vision.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop", features: ["Pre-production strategy & scriptwriting", "Interview & B-roll multi-cam capture", "Professional voiceover & licensed music", "Full HD/4K master delivery"], startingPrice: 2500, enabled: true },
  { title: "Social Media Content Creation", description: "End-to-end content retainer packs. We shoot and edit high-performing videos on a monthly cycle.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop", features: ["Monthly content planning sessions", "Batch shooting (6-12 reels per session)", "Trending audio selection & editing styles", "Consistent brand tone maintenance"], startingPrice: 1500, enabled: true },
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

export const initialProjects = [
  { title: "Nellai Cafe — Sensory Brand Reel", category: "Business/Marketing", description: "A fast-paced, highly visual marketing reel shot for Nellai Cafe in Tirunelveli.", location: "Tirunelveli Town", date: "2026-05-10", coverImage: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "Cafe Brand Reel", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop" }], client: "Nellai Cafe", featured: true, published: true },
  { title: "Yamaha R15 V4 — Delivery Thrill", category: "Car/Bike Delivery", description: "An epic, high-energy delivery reel shot at the Tirunelveli Yamaha showroom.", location: "Vannarpettai, Tirunelveli", date: "2026-06-01", coverImage: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "R15 V4 Delivery", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop" }], client: "Sudhakar S.", featured: true, published: true },
  { title: "The Heritage Wedding of S&A", category: "Events", description: "Three days of traditional wedding celebrations in Nellai.", location: "Kanyakumari Road, Tirunelveli", date: "2026-04-18", coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "Wedding Teaser", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop" }], client: "Suresh & Ananya", featured: true, published: true },
  { title: "Street Style — Personal Reel", category: "Personal Reels", description: "An urban lifestyle reel shot against vintage architecture.", location: "Town, Tirunelveli", date: "2026-07-02", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "Fashion Reel", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop" }], client: "Kavitha M.", featured: false, published: true },
  { title: "Royal Enfield Classic 350 — Stealth Black", category: "Car/Bike Delivery", description: "Thunderous thump of the Royal Enfield Classic 350 captured right at delivery moment.", location: "High Ground, Tirunelveli", date: "2026-03-20", coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "Royal Enfield Delivery", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop" }], client: "Dinesh Kumar", featured: true, published: true },
  { title: "Trend Apparel — Festive Collection", category: "Business/Marketing", description: "Fast-cut, vibrant commercial reel showcasing ethnic and modern festive wear collections.", location: "Palayamkottai, Tirunelveli", date: "2026-01-28", coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", gallery: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"], videos: [{ type: "reel", title: "Apparel Season Launch", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" }], client: "Trend Apparel", featured: true, published: true },
];

export const initialPhotos = [
  { title: "Golden Hour Portrait", category: "Portraits", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop", location: "Palayamkottai, Tirunelveli", date: "2026-07-10", published: true },
  { title: "Yamaha R15 V4 — Delivery Day Handover", category: "Car & Bike", url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop", location: "Vannarpettai, Tirunelveli", date: "2026-06-01", published: true },
  { title: "The Heritage Temple Wedding", category: "Events", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop", location: "Kanyakumari Road, Tirunelveli", date: "2026-04-18", published: true },
  { title: "Nellai Cafe — Filter Coffee Pour", category: "Food", url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop", location: "Tirunelveli Town", date: "2026-05-10", published: true },
  { title: "Street Style — Urban Fashion", category: "Portraits", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", location: "Town, Tirunelveli", date: "2026-07-02", published: true },
  { title: "Royal Enfield Classic — Stealth First Ride", category: "Car & Bike", url: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=800&auto=format&fit=crop", location: "High Ground, Tirunelveli", date: "2026-03-20", published: true },
  { title: "Birthday Bash — Festive Aesthetic", category: "Events", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", location: "Junction, Tirunelveli", date: "2026-02-14", published: true },
  { title: "Trend Apparel — Festive Ethnic Wear", category: "Commercial", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", location: "Palayamkottai", date: "2026-01-28", published: true },
  { title: "Cinematic Couple Pre-Wedding", category: "Events", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", location: "Courtallam, Tirunelveli", date: "2026-06-20", published: true },
  { title: "Suzuki Gixxer — Night Delivery", category: "Car & Bike", url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop", location: "Tirunelveli", date: "2026-05-05", published: true },
  { title: "Lifestyle Portrait — Park Shoot", category: "Portraits", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", location: "VOC Park, Tirunelveli", date: "2026-07-15", published: true },
  { title: "Artisanal Biryani & Cuisine Styling", category: "Food", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", location: "Palayamkottai", date: "2026-04-02", published: true },
];

export const initialReels = [
  { title: "Yamaha R15 V4 — Delivery Day Thrill", category: "Car/Bike Delivery", client: "Sudhakar S.", location: "Vannarpettai, Tirunelveli", poster: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
  { title: "Nellai Cafe — Sensory Filter Coffee Reel", category: "Business/Marketing", client: "Nellai Cafe", location: "Tirunelveli Town", poster: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
  { title: "Street Style — Urban Flow & Transitions", category: "Personal Reels", client: "Kavitha M.", location: "Town, Tirunelveli", poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
  { title: "The Heritage Wedding of S & A — Teaser", category: "Events", client: "Suresh & Ananya", location: "Kanyakumari Road, Tirunelveli", poster: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
  { title: "Royal Enfield Classic 350 — Stealth Delivery", category: "Car/Bike Delivery", client: "Dinesh Kumar", location: "High Ground, Tirunelveli", poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
  { title: "Trend Apparel — Festive Collection Launch", category: "Business/Marketing", client: "Trend Apparel", location: "Palayamkottai", poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", published: true },
];

export const initialBrandMarketing = [
  { brandName: "Yamaha Motors Nellai", tagline: "High-Energy Delivery Reels", description: "Shot custom launch & handover reels for the new R15 V4.", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", enabled: true },
  { brandName: "Nellai Filter Cafe", tagline: "Sensory Macro Commercial", description: "A conversion-driven vertical promo capturing steam, coffee drops, and authentic snack styling.", image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", enabled: true },
  { brandName: "Trend Apparel Town", tagline: "Style Showcase Reels", description: "Fashion aesthetics shot against historical Tirunelveli architectures.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", enabled: true },
];

export const initialTestimonials = [
  { clientName: "Sudhakar S.", clientImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop", review: "Azhaguraja and his crew made my bike delivery reel feel like a Hollywood movie teaser! The sound design was spot-on.", project: "Yamaha R15 Delivery Reel", rating: 5, date: "2026-06-03" },
  { clientName: "Meenakshi Sundaram", clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop", review: "Absolutely outstanding coverage for our store launch in Palayamkottai. Within 2 days we got 40+ walk-ins.", project: "Nellai Cafe Launch Campaign", rating: 5, date: "2026-05-15" },
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
