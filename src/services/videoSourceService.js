import api from "./api";

// Video Source URL Management service.
// Talks to the real backend (POST /video-sources/validate, /admin/video-sources CRUD).
// If the API is unreachable, falls back to a small localStorage store so the page
// still works during development before the backend is wired.

const USE_MOCK = false;
const KEY = "azhaguraja_video_sources";

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function delay(v, ms = 250) {
  return new Promise((res) => setTimeout(() => res(v), ms));
}

// ---- Public active sources ----
export async function getVideoSources() {
  if (USE_MOCK) return delay(readLocal().filter((s) => s.isActive !== false));
  const { data } = await api.get("/video-sources");
  return data;
}

// ---- Validate a video URL against approved sources ----
export async function validateVideoUrl(videoUrl) {
  if (USE_MOCK) {
    const identifier = deriveMockIdentifier(videoUrl);
    if (!identifier) {
      throw {
        response: { data: { message: "Unable to verify the source of this video from its URL.", code: "UNVERIFIABLE" } },
      };
    }
    const match = readLocal().find(
      (s) => s.isActive !== false && s.sourceIdentifier === identifier
    );
    if (!match) {
      throw {
        response: {
          data: {
            message: "This video cannot be added because it does not belong to an approved video source.",
            code: "SOURCE_NOT_APPROVED",
          },
        },
      };
    }
    return { ok: true, source: match };
  }
  const { data } = await api.post("/video-sources/validate", { videoUrl });
  return data;
}

// ---- Admin CRUD ----
export async function adminGetVideoSources() {
  if (USE_MOCK) return delay(readLocal());
  const { data } = await api.get("/admin/video-sources");
  return data;
}

export async function adminSaveVideoSource(source) {
  if (USE_MOCK) {
    const all = readLocal();
    const existing = all.find(
      (s) =>
        s.sourceIdentifier === source.sourceIdentifier &&
        s.platform === source.platform &&
        s.id !== source.id
    );
    if (existing) throw new Error("This video source already exists.");
    if (source.id) {
      const idx = all.findIndex((s) => s.id === source.id);
      if (idx !== -1) all[idx] = { ...all[idx], ...source };
    } else {
      source.id = "vs" + Date.now();
      source.isActive = source.isActive !== false;
      source.createdAt = new Date().toISOString();
      all.push(source);
    }
    writeLocal(all);
    return delay(source);
  }
  if (source.id) {
    const { data } = await api.patch(`/admin/video-sources/${source.id}`, source);
    return data;
  }
  const { data } = await api.post("/admin/video-sources", source);
  return data;
}

export async function adminToggleVideoSource(id) {
  if (USE_MOCK) {
    const all = readLocal();
    const idx = all.findIndex((s) => s.id === id);
    if (idx !== -1) all[idx].isActive = !all[idx].isActive;
    writeLocal(all);
    return delay(all[idx]);
  }
  const { data } = await api.patch(`/admin/video-sources/${id}/toggle`);
  return data;
}

export async function adminDeleteVideoSource(id) {
  if (USE_MOCK) {
    writeLocal(readLocal().filter((s) => s.id !== id));
    return delay(true);
  }
  await api.delete(`/admin/video-sources/${id}`);
  return true;
}

// Simple client-side platform detection + identifier derivation (used only in mock mode
// and to give the UI a helpful preview. The backend remains the final authority.)
export function detectPlatform(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (host.endsWith("instagram.com")) return "instagram";
    if (host.endsWith("youtube.com") || host.endsWith("youtu.be")) return "youtube";
  } catch {
    return null;
  }
  return null;
}

function deriveMockIdentifier(url) {
  const platform = detectPlatform(url);
  if (!platform) return null;
  try {
    const p = new URL(url);
    if (platform === "instagram") {
      const seg = p.pathname.split("/").filter(Boolean);
      const skip = new Set(["p", "reel", "reels", "explore", "stories", "accounts", "directory", "oembed"]);
      const acct = seg.find((s) => !skip.has(s.toLowerCase()));
      return acct ? acct.toLowerCase() : null;
    }
    const handle = p.pathname.match(/^\/@([a-z0-9_.-]+)/i);
    if (handle) return "@" + handle[1].toLowerCase();
    const channel = p.pathname.match(/^\/channel\/([a-z0-9_-]+)/i);
    if (channel) return channel[1].toLowerCase();
    return null;
  } catch {
    return null;
  }
}
