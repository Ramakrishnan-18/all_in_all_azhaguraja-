import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { Service, Package } from "./models/resources.js";
import { Setting } from "./models/Setting.js";
import { VideoSource } from "./models/VideoSource.js";
import { initialServices, initialPackages, initialSettings, initialVideoSources } from "./seed/seedData.js";

async function autoSeed() {
  try {
    if ((await Service.countDocuments()) === 0) {
      await Service.insertMany(initialServices.map((d) => ({ ...d, enabled: d.enabled ?? true })));
      console.log(`Auto-seeded ${initialServices.length} services`);
    }
    if ((await Package.countDocuments()) === 0) {
      await Package.insertMany(initialPackages.map((d) => ({ ...d, enabled: d.enabled ?? true })));
      console.log(`Auto-seeded ${initialPackages.length} packages`);
    }
    if ((await Setting.countDocuments()) === 0) {
      await Setting.create(initialSettings);
      console.log("Auto-seeded settings");
    }
    if ((await VideoSource.countDocuments()) === 0) {
      await VideoSource.insertMany(initialVideoSources);
      console.log("Auto-seeded video sources");
    }
  } catch (err) {
    console.error("Auto-seed failed (non-fatal):", err.message);
  }
}

async function start() {
  try {
    await connectDB();
    await autoSeed();
    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
