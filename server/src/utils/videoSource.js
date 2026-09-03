// Parse and validate Instagram / YouTube media URLs against approved VideoSources.
// The sourceIdentifier is normalized so matching is reliable regardless of how the
// account/channel URL was entered (www, scheme, trailing slash, case, etc.).

const DEFAULT_PORT = 80;

function normalizeHost(host) {
  return String(host || "").toLowerCase().replace(/^www\./, "");
}

// Instagram path structure:
//   https://www.instagram.com/{account}/p/{shortcode}/
//   https://www.instagram.com/{account}/reel/{id}/
//   https://www.instagram.com/{account}/
// Non-account first-segments we should never treat as an account:
const IG_SKIP_SEGMENTS = new Set([
  "p",
  "reel",
  "reels",
  "explore",
  "stories",
  "accounts",
  "directory",
  "oembed",
  "login",
  "about",
  "privacy",
  "terms",
]);

// YouTube channel identifiers we look for in a URL.
const YT_CHANNEL_SUFFIXES = ["/channel/", "/@", "/c/", "/user/"];

export function parsePlatform(url) {
  let parsed;
  try {
    parsed = new URL(String(url || "").trim());
  } catch (err) {
    return null;
  }
  const host = normalizeHost(parsed.hostname);
  if (host.endsWith("instagram.com")) return "instagram";
  if (host.endsWith("youtube.com") || host.endsWith("youtu.be")) return "youtube";
  return "unsupported";
}

function parseInstagram(url) {
  const p = new URL(url);
  const segments = p.pathname.split("/").filter(Boolean);
  // The account is the first meaningful segment.
  const account = segments.find((seg) => !IG_SKIP_SEGMENTS.has(seg.toLowerCase()));
  return account ? account.toLowerCase() : null;
}

// Check if an Instagram URL is a valid reel or post link.
export function isValidInstagramContentUrl(url) {
  try {
    const p = new URL(String(url || "").trim());
    if (!normalizeHost(p.hostname).endsWith("instagram.com")) return false;
    const segments = p.pathname.split("/").filter(Boolean);
    // Valid patterns: /reel/{id}/, /p/{shortcode}/, /reels/{id}/
    if (segments.length >= 2) {
      const type = segments[0].toLowerCase();
      if (["reel", "reels", "p"].includes(type)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

function parseYouTube(url) {
  const p = new URL(url);
  const full = (normalizeHost(p.hostname) + p.pathname).toLowerCase();

  // /channel/{channelId}
  const channelMatch = p.pathname.match(/^\/channel\/([a-z0-9_-]+)/i);
  if (channelMatch) return { type: "channel", identifier: channelMatch[1].toLowerCase() };

  // /@handle  or  /c/{name}  or  /user/{name}
  const handleMatch = p.pathname.match(/^\/@([a-z0-9_.-]+)/i);
  if (handleMatch) return { type: "handle", identifier: "@" + handleMatch[1].toLowerCase() };

  const cMatch = p.pathname.match(/^\/c\/([a-z0-9_.-]+)/i);
  if (cMatch) return { type: "handle", identifier: "@" + cMatch[1].toLowerCase() };

  const userMatch = p.pathname.match(/^\/user\/([a-z0-9_.-]+)/i);
  if (userMatch) return { type: "handle", identifier: "@" + userMatch[1].toLowerCase() };

  // Everything else (watch?v=, youtu.be, streams, shorts, embed) is a video page
  // whose channel cannot be derived from the URL alone.
  if (full.includes("/watch") || full.includes("/shorts") || full.includes("/streams") || full.includes("/embed") || full.includes("/live")) {
    return { type: "unknown", identifier: null };
  }

  return { type: "unknown", identifier: null };
}

// Derive a normalized sourceIdentifier (matching shape of VideoSource.sourceIdentifier).
export function deriveSourceIdentifier(url) {
  const platform = parsePlatform(url);
  if (platform === "instagram") return parseInstagram(url);
  if (platform === "youtube") {
    const parsed = parseYouTube(url);
    return parsed.identifier;
  }
  return null;
}

// Derive the platform enum string for a URL (or "unsupported").
export function detectPlatformAndIdentifier(url) {
  const platform = parsePlatform(url);
  if (!platform) return { platform: "unsupported", identifier: null };
  if (platform === "unsupported") return { platform: "unsupported", identifier: null };
  const identifier = deriveSourceIdentifier(url);
  return { platform, identifier };
}

// Normalize an Instagram/YouTube account URL into canonical "source" form the admin stores.
export function normalizeSourceUrl(url) {
  const platform = parsePlatform(url);
  const identifier = deriveSourceIdentifier(url);
  if (platform === "instagram" && identifier) {
    return `https://www.instagram.com/${identifier}/`;
  }
  if (platform === "youtube" && identifier) {
    return `https://www.youtube.com/${identifier.startsWith("@") ? identifier : "channel/" + identifier}`;
  }
  return String(url || "").trim();
}

export { parseYouTube as _parseYouTube };
