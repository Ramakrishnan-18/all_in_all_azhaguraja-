import mongoose from "mongoose";
import { env } from "../config/env.js";
import {
  Service,
  Package,
  Photo,
  Reel,
  Project,
  Testimonial,
  BrandMarketing,
} from "../models/resources.js";
import { Setting } from "../models/Setting.js";
import { AdminUser } from "../models/AdminUser.js";
import { VideoSource } from "../models/VideoSource.js";
import {
  initialServices,
  initialPackages,
  initialPhotos,
  initialReels,
  initialProjects,
  initialTestimonials,
  initialBrandMarketing,
  initialSettings,
  initialVideoSources,
} from "./seedData.js";

const MODEL_MAP = [
  [Service, initialServices],
  [Package, initialPackages],
  [Photo, initialPhotos],
  [Reel, initialReels],
  [Project, initialProjects],
  [Testimonial, initialTestimonials],
  [BrandMarketing, initialBrandMarketing],
];

async function seed({ wipe = false } = {}) {
  await mongoose.connect(env.mongodbUri);

  if (wipe) {
    console.log("Wiping existing collections...");
    for (const [Model] of MODEL_MAP) {
      await Model.deleteMany({});
    }
    await Setting.deleteMany({});
    await AdminUser.deleteMany({});
    await VideoSource.deleteMany({});
  }

  for (const [Model, data] of MODEL_MAP) {
    if (Model === Photo || Model === Reel || Model === Project) {
      // Only seed photos/reels/projects if empty (non-destructive sync).
      if ((await Model.countDocuments()) === 0) {
        await Model.insertMany(data);
        console.log(`Seeded ${Model.modelName}: ${data.length}`);
      } else {
        console.log(`Skipped ${Model.modelName} (already has data)`);
      }
    } else if ((await Model.countDocuments()) === 0) {
      await Model.insertMany(data.map((d) => ({ ...d, enabled: d.enabled ?? true })));
      console.log(`Seeded ${Model.modelName}: ${data.length}`);
    } else {
      console.log(`Skipped ${Model.modelName} (already has data)`);
    }
  }

  // Settings singleton
  if ((await Setting.countDocuments()) === 0) {
    await Setting.create(initialSettings);
    console.log("Seeded Setting");
  } else {
    console.log("Skipped Setting (already has data)");
  }

  // Video Sources
  if ((await VideoSource.countDocuments()) === 0) {
    await VideoSource.insertMany(initialVideoSources);
    console.log("Seeded VideoSource:", initialVideoSources.length);
  } else {
    console.log("Skipped VideoSource (already has data)");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

const wipe = process.argv.includes("--wipe");
seed({ wipe })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
