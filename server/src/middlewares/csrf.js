import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");
const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

function signToken(token) {
  return crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
}

// Generate and set CSRF cookie on GET requests
export function csrfGenerate(req, res, next) {
  try {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const raw = crypto.randomBytes(32).toString("hex");
      const signed = signToken(raw);

      res.cookie(CSF_COOKIE, `${raw}.${signed}`, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 1000,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

// Validate CSRF on state-changing requests (POST, PUT, PATCH, DELETE)
export function csrfValidate(req, res, next) {
  try {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    const cookieVal = req.cookies?.[CSRF_COOKIE];
    const headerVal = req.headers[CSRF_HEADER];

    if (!cookieVal || !headerVal) {
      return res.status(403).json({ message: "CSRF token missing" });
    }

    const [rawCookie, signedCookie] = cookieVal.split(".");
    const [rawHeader, signedHeader] = headerVal.split(".");

    if (!rawCookie || !signedCookie || !rawHeader || !signedHeader) {
      return res.status(403).json({ message: "CSRF token malformed" });
    }

    if (rawCookie !== rawHeader) {
      return res.status(403).json({ message: "CSRF token mismatch" });
    }

    const expected = signToken(rawCookie);
    if (!crypto.timingSafeEqual(Buffer.from(signedCookie), Buffer.from(expected))) {
      return res.status(403).json({ message: "CSRF token invalid" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
