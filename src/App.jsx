import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BrandMarketing = lazy(() => import("./pages/BrandMarketing"));
const Reels = lazy(() => import("./pages/Reels"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./admin/AdminProjects"));
const AdminProjectForm = lazy(() => import("./admin/AdminProjectForm"));
const AdminPhotos = lazy(() => import("./admin/AdminPhotos"));
const AdminReels = lazy(() => import("./admin/AdminReels"));
const AdminServices = lazy(() => import("./admin/AdminServices"));
const AdminBookings = lazy(() => import("./admin/AdminBookings"));
const AdminSettings = lazy(() => import("./admin/AdminSettings"));
const AdminProfile = lazy(() => import("./admin/AdminProfile"));
const AdminBrandMarketing = lazy(() => import("./admin/AdminBrandMarketing"));

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader label="Loading" /></div>}>
          <Routes>
            {/* Customer Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:id" element={<ProjectDetail />} />
              <Route path="/brand-marketing" element={<BrandMarketing />} />
              <Route path="/packages" element={<Services />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/videos" element={<Reels />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Navigate to="/contact" replace />} />
              <Route path="/book-session" element={<Navigate to="/contact" replace />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="portfolio" element={<AdminProjects />} />
              <Route path="portfolio/add" element={<AdminProjectForm />} />
              <Route path="portfolio/edit/:id" element={<AdminProjectForm />} />
              <Route path="photos" element={<AdminPhotos />} />
              <Route path="reels" element={<AdminReels />} />
              <Route path="brand-marketing" element={<AdminBrandMarketing />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="packages" element={<Navigate to="/admin/services" replace />} />
              <Route path="testimonials" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
