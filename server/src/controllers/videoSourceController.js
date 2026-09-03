import { VideoSource } from "../models/VideoSource.js";
import {
  detectPlatformAndIdentifier,
  deriveSourceIdentifier,
  normalizeSourceUrl,
  parsePlatform,
} from "../utils/videoSource.js";

// GET /video-sources (public — only active ones are listed)
export async function listActive(req, res) {
  const sources = await VideoSource.find({ isActive: true }).sort({ platform: 1, name: 1 }).lean();
  res.json(sources);
}

// GET /admin/video-sources (all sources, active + inactive)
export async function listAll(req, res) {
  const sources = await VideoSource.find().sort({ platform: 1, name: 1 }).lean();
  res.json(sources);
}

// POST /admin/video-sources
export async function createSource(req, res) {
  const { platform, name, sourceUrl } = req.body || {};
  if (!platform || !name || !sourceUrl) {
    return res.status(400).json({ message: "Platform, name and source URL are required" });
  }

  const detected = parsePlatform(sourceUrl);
  if (detected === "unsupported") {
    return res.status(400).json({ message: "Invalid URL. Please provide an Instagram or YouTube account/channel URL." });
  }
  if (detected && platform && detected !== platform) {
    return res.status(400).json({ message: `The URL is from ${detected === "instagram" ? "Instagram" : "YouTube"} but you selected ${platform === "instagram" ? "Instagram" : "YouTube"}.` });
  }
  if (!detected) {
    return res.status(400).json({ message: "Invalid URL. Please provide an Instagram or YouTube account/channel URL." });
  }

  const identifier = deriveSourceIdentifier(sourceUrl);
  if (!identifier) {
    return res.status(400).json({ message: "Unable to identify the account/channel from this URL. Use a channel/account URL (e.g. instagram.com/{username} or youtube.com/@{channel})." });
  }

  const normalizedUrl = normalizeSourceUrl(sourceUrl);

  const duplicate = await VideoSource.findOne({ platform, sourceIdentifier: identifier });
  if (duplicate) {
    return res.status(400).json({ message: "This video source already exists." });
  }

  const source = await VideoSource.create({
    platform,
    name,
    sourceUrl: normalizedUrl,
    sourceIdentifier: identifier,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdBy: req.admin ? req.admin._id : null,
  });
  res.status(201).json(source);
}

// PATCH /admin/video-sources/:id
export async function updateSource(req, res) {
  const source = await VideoSource.findById(req.params.id);
  if (!source) return res.status(404).json({ message: "Video source not found" });

  const { platform, name, sourceUrl, isActive } = req.body || {};

  if (sourceUrl !== undefined) {
    const detected = parsePlatform(sourceUrl);
    if (!detected || detected === "unsupported") {
      return res.status(400).json({ message: "Invalid URL. Please provide an Instagram or YouTube account/channel URL." });
    }
    const identifier = deriveSourceIdentifier(sourceUrl);
    if (!identifier) {
      return res.status(400).json({ message: "Unable to identify the account/channel from this URL." });
    }
    const dup = await VideoSource.findOne({
      platform: platform || source.platform,
      sourceIdentifier: identifier,
      _id: { $ne: source._id },
    });
    if (dup) return res.status(400).json({ message: "Another video source already uses this account/channel." });
    source.sourceUrl = normalizeSourceUrl(sourceUrl);
    source.sourceIdentifier = identifier;
  }

  if (platform !== undefined) source.platform = platform;
  if (name !== undefined) source.name = name;
  if (isActive !== undefined) source.isActive = !!isActive;

  await source.save();
  res.json(source);
}

// PATCH /admin/video-sources/:id/toggle
export async function toggleSource(req, res) {
  const source = await VideoSource.findById(req.params.id);
  if (!source) return res.status(404).json({ message: "Video source not found" });
  source.isActive = !source.isActive;
  await source.save();
  res.json(source);
}

// DELETE /admin/video-sources/:id
export async function deleteSource(req, res) {
  const source = await VideoSource.findById(req.params.id);
  if (!source) return res.status(404).json({ message: "Video source not found" });
  await source.deleteOne();
  res.json({ success: true });
}

// POST /video-sources/validate
// Verifies a video URL belongs to an active approved source.
export async function validateVideoUrl(req, res) {
  const { videoUrl } = req.body || {};
  if (!videoUrl) {
    return res.status(400).json({ ok: false, message: "Video URL is required" });
  }

  const { platform, identifier } = detectPlatformAndIdentifier(videoUrl);

  if (!platform || platform === "unsupported") {
    return res.status(400).json({
      ok: false,
      message: "Invalid URL. Only Instagram and YouTube videos are supported.",
      code: "INVALID_URL",
    });
  }

  if (!identifier) {
    return res.status(400).json({
      ok: false,
      message: "Unable to verify the source of this video from its URL.",
      code: "UNVERIFIABLE",
    });
  }

  const approved = await VideoSource.findOne({ platform, sourceIdentifier: identifier });

  if (!approved) {
    return res.status(400).json({
      ok: false,
      message: "This video cannot be added because it does not belong to an approved video source.",
      code: "SOURCE_NOT_APPROVED",
    });
  }
  if (!approved.isActive) {
    return res.status(400).json({
      ok: false,
      message: "This video's source account is currently disabled. Enable it first.",
      code: "SOURCE_DISABLED",
    });
  }

  res.json({ ok: true, source: approved });
}
