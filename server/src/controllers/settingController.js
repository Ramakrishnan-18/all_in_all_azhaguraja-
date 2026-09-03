import { Setting } from "../models/Setting.js";

// GET /settings (public)
export async function getSettings(req, res) {
  const settings = await Setting.findOne().lean();
  return res.json(settings || {});
}

// PATCH /admin/settings
export async function updateSettings(req, res) {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  return res.json(settings);
}
