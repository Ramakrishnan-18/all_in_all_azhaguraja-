import mongoose from "mongoose";

// Generic resource model factory for the simple CRUD entities.
// Each entity returns documents with the exact shape the frontend expects.
const schemas = {
  Service: {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    features: { type: [String], default: [] },
    startingPrice: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  Package: {
    category: { type: String, default: "" },
    packageName: { type: String, default: "" },
    price: { type: Number, default: 0 },
    features: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
  },
  Photo: {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    url: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  Reel: {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    client: { type: String, default: "" },
    location: { type: String, default: "" },
    poster: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    videoFile: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  Project: {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    videos: {
      type: [
        {
          type: { type: String, default: "reel" },
          title: { type: String, default: "" },
          url: { type: String, default: "" },
          poster: { type: String, default: "" },
        },
      ],
      default: [],
    },
    client: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  Testimonial: {
    clientName: { type: String, default: "" },
    clientImage: { type: String, default: "" },
    review: { type: String, default: "" },
    project: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    date: { type: String, default: "" },
  },
  BrandMarketing: {
    brandName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
  },
};

const models = {};

for (const [name, schemaDef] of Object.entries(schemas)) {
  const schema = new mongoose.Schema(schemaDef, { timestamps: true });
  if (schemaDef.enabled !== undefined) {
    schema.index({ enabled: 1, createdAt: -1 });
  }
  if (schemaDef.published !== undefined) {
    schema.index({ published: 1, createdAt: -1 });
  }
  if (name === "Reel") {
    schema.index({ videoUrl: 1 }, { sparse: true });
  }
  models[name] = mongoose.model(name, schema);
}

export const {
  Service,
  Package,
  Photo,
  Reel,
  Project,
  Testimonial,
  BrandMarketing,
} = models;
