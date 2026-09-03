# Lumen & Frame — Studio Portfolio

A premium, cinematic React frontend for a Photography, Videography & Brand Marketing studio,
built around two equally-weighted business lines: **Weddings & Events** and **Brand Marketing**.

## Stack

React 19 · React Router · Tailwind CSS v4 · Framer Motion · Axios · React Hook Form · Lucide React · Vite

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your real backend
npm run dev
```

## Admin

Visit `/admin/login`. Demo credentials (mock auth, see below):

- Email: `admin@studio.com`
- Password: `studio2026`

## Connecting a real backend

The app currently runs on an in-memory mock dataset (`src/services/mockData.js`) so it's fully
functional and demo-able with zero backend. Every service file in `src/services/` follows the
same pattern:

```js
const USE_MOCK = true; // flip to false

export async function getProjects(filters) {
  if (USE_MOCK) { /* mock branch */ }
  const { data } = await api.get("/projects", { params: filters });
  return data;
}
```

To connect your real API:

1. Set `VITE_API_URL` in `.env`.
2. Flip `USE_MOCK = false` in each `src/services/*Service.js` file.
3. Implement matching REST endpoints on your backend (see the routes referenced in each service —
   `/projects`, `/projects/featured`, `/projects/:id`, `/testimonials`, `/enquiries`,
   `/admin/projects`, `/admin/enquiries`, `/auth/login`, etc.).
4. Media uploads: `MediaUploader` is wired for drag-and-drop with preview/progress, but the actual
   upload call (`onFilesReady`) needs to POST to your media storage service (S3, Cloudinary, etc.)
   — only the returned URL should be persisted to your database, per the "no large files in
   MongoDB" requirement.
5. Auth: `src/services/authService.js` currently mocks a JWT. Swap in a real `/auth/login` call;
   the axios instance already attaches `Authorization: Bearer <token>` from `localStorage` on
   every request.

## Structure

```
src/
  components/   shared UI (Navbar, Footer, ProjectCard, VideoPlayer, Lightbox, MediaUploader, ...)
  pages/        public routes (Home, WeddingsEvents, BrandMarketing, ProjectDetail, ...)
  layouts/      MainLayout (public site) and AdminLayout (dashboard shell)
  admin/        protected admin pages (Dashboard, Projects CRUD, Media, Testimonials, Enquiries)
  services/     axios instance + one file per resource, mock-first / API-ready
  hooks/        useAuth, useProjects
  context/      AuthContext
  routes/       ProtectedRoute
  utils/        formatting helpers
```

## Design system

- Palette: Studio Blue `#003366`, Signal Gold `#FFD700`, Ink `#0B0D10`, Paper `#F7F5F0`, plus
  supporting slate/mist neutrals — defined as Tailwind v4 `@theme` tokens in `src/index.css`.
- Type: **Fraunces** (display/headlines), **Manrope** (body/UI), **Space Mono** (eyebrows, meta,
  category labels — a nod to film-production slates).
- Signature element: the homepage's split-screen "Weddings vs. Brand" section, which widens
  whichever side the visitor hovers — a literal expression of the studio's 50/50 positioning.

## Notes / known limitations

- This is a frontend-only build with a realistic mock data layer — there is no real backend.
  All "database" state (projects, enquiries, testimonials) lives in memory and resets on reload.
- Video sources in the mock data use a placeholder sample clip; swap in real project footage URLs.
- `npm run build` succeeds cleanly (~168 kB gzipped JS). For production, consider route-based code
  splitting (`React.lazy`) given the number of pages.
