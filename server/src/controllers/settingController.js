import { Setting } from "../models/Setting.js";
import { cache } from "../app.js";

// GET /settings (public) — cached 5 min
export async function getSettings(req, res) {
  const cached = cache.get("settings");
  if (cached) return res.json(cached);

  const settings = await Setting.findOne().lean();
  const data = settings || {};
  cache.set("settings", data, 300);
  return res.json(data);
}

// PATCH /admin/settings — invalidate cache
export async function updateSettings(req, res) {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  cache.del("settings");
  return res.json(settings);
}
