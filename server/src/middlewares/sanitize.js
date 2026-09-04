function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      obj[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      obj[key] = value.map((v) => (typeof v === "string" ? sanitizeString(v) : v));
    }
  }
}

export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeObject(req.params);
  }
  next();
}
