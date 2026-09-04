import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import BrandMarketing from "./pages/BrandMarketing";
import Reels from "./pages/Reels";
import Contact from "./pages/Contact";
import BookSession from "./pages/BookSession";
import Booking from "./pages/Booking";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProjects from "./admin/AdminProjects";
import AdminProjectForm from "./admin/AdminProjectForm";
import AdminPhotos from "./admin/AdminPhotos";
import AdminReels from "./admin/AdminReels";
import AdminServices from "./admin/AdminServices";
import AdminBookings from "./admin/AdminBookings";
import AdminSettings from "./admin/AdminSettings";
import AdminProfile from "./admin/AdminProfile";
import AdminBrandMarketing from "./admin/AdminBrandMarketing";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            {/* Compatibility alias for old /videos path */}
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
      </BrowserRouter>
    </AuthProvider>
  );
}
