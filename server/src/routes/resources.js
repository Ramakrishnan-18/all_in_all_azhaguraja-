import { Router } from "express";
import {
  Service,
  Package,
  Photo,
  Reel,
  Project,
  Testimonial,
  BrandMarketing,
} from "../models/resources.js";
import { createResourceController } from "../controllers/resourceController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect, requireRole } from "../middlewares/auth.js";
import { detectPlatformAndIdentifier, isValidInstagramContentUrl, deriveSourceIdentifier } from "../utils/videoSource.js";
import { Setting } from "../models/Setting.js";

const router = Router();

// Validates that a media URL is a valid Instagram reel/post or YouTube video
// from the configured channel. Instagram: just verify it's a reel/post URL.
// YouTube: match the video's channel against the YouTube URL in Global Configuration.
async function assertApprovedVideoUrl(videoUrl) {
  if (!videoUrl) return;
  const { platform } = detectPlatformAndIdentifier(videoUrl);
  if (!platform || platform === "unsupported") {
    const err = new Error("Invalid video URL. Only Instagram and YouTube videos are supported.");
    err.status = 400;
    throw err;
  }

  // Instagram: just verify it's a valid reel/post URL — no account matching needed
  if (platform === "instagram") {
    if (!isValidInstagramContentUrl(videoUrl)) {
      const err = new Error("Please enter a valid Instagram reel or post URL (e.g. instagram.com/reel/... or instagram.com/p/...).");
      err.status = 400;
      throw err;
    }
    return; // valid Instagram content URL — allow it
  }

  // YouTube: validate that the video belongs to the configured YouTube channel
  if (platform === "youtube") {
    const settings = await Setting.findOne().lean();
    const configuredYoutubeUrl = settings?.youtubeUrl;
    if (!configuredYoutubeUrl) {
      const err = new Error("No YouTube channel configured in Studio Settings. Please add your YouTube URL in Global Configuration first.");
      err.status = 400;
      throw err;
    }
    // Extract the video's channel identifier
    const videoChannelId = deriveSourceIdentifier(videoUrl);
    const configuredChannelId = deriveSourceIdentifier(configuredYoutubeUrl);
    // For watch?v= URLs, we can't extract channel from URL alone — just validate it's youtube.com
    // For channel/handle URLs, match against configured channel
    if (videoChannelId && configuredChannelId && videoChannelId !== configuredChannelId) {
      const err = new Error("This YouTube video does not belong to your configured channel. Only videos from your own channel can be added.");
      err.status = 400;
      throw err;
    }
    return; // valid YouTube URL
  }
}

async function validateReelPayload(payload, id, req) {
  if (payload.videoUrl) await assertApprovedVideoUrl(payload.videoUrl);
  // Prevent the same video URL being added more than once.
  if (payload.videoUrl) {
    const dup = await Reel.findOne({ videoUrl: payload.videoUrl, _id: { $ne: id } });
    if (dup) {
      const err = new Error("This video URL has already been added.");
      err.status = 400;
      throw err;
    }
  }
  return {};
}

// Resource name -> options
const resources = {
  services: {
    model: Service,
    publicFilter: { enabled: true },
    searchable: ["title", "description"],
  },
  packages: {
    model: Package,
    publicFilter: { enabled: true },
    searchable: ["category", "packageName"],
  },
  photos: {
    model: Photo,
    publicFilter: { published: true },
    searchable: ["title", "category", "location"],
    sortOrder: -1,
  },
  reels: {
    model: Reel,
    publicFilter: { published: true },
    searchable: ["title", "category", "client", "location"],
    beforeSave: validateReelPayload,
    sortOrder: -1,
  },
  projects: {
    model: Project,
    publicFilter: { published: true },
    searchable: ["title", "category", "client"],
    sortOrder: -1,
  },

  "brand-marketing": {
    model: BrandMarketing,
    publicFilter: { enabled: true },
    searchable: ["brandName", "tagline"],
    sortOrder: -1,
  },
  testimonials: {
    model: Testimonial,
    publicFilter: {},
    searchable: ["clientName", "quote"],
  },
};

for (const [route, { model, publicFilter, searchable, beforeSave, sortOrder }] of Object.entries(resources)) {
  const c = createResourceController(model, { publicFilter, searchable, beforeSave, sortOrder });

  // Public
  router.get(`/${route}`, asyncHandler(c.listPublic));
  router.get(`/${route}/:id`, asyncHandler(c.getPublic));

  // Admin (all authenticated admins can manage content)
  router.use(`/admin/${route}`, protect);
  router.get(`/admin/${route}`, asyncHandler(c.listAll));
  router.post(`/admin/${route}`, asyncHandler(c.create));
  router.patch(`/admin/${route}/:id`, asyncHandler(c.update));
  router.delete(`/admin/${route}/:id`, asyncHandler(c.remove));
}

export default router;
