
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { Layout } from './src/components/Layout';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { CaseStudies } from './pages/landing/CaseStudies';
import { RFQForm } from './pages/RFQ';
import { Careers } from './src/pages/Careers';
import { Blog } from './src/pages/Blog';
import { CatalogDownload } from './src/pages/Catalog';
import { Industries } from './src/pages/Industries';
import { About } from './src/pages/About';
import { Infrastructure } from './src/pages/Infrastructure';
import { Quality } from './src/pages/Quality';
import { CookiePolicy } from './src/pages/CookiePolicy';
import { PrivacyPolicy } from './src/pages/PrivacyPolicy';
import { TermsOfService } from './src/pages/TermsOfService';
import { NotFound } from './src/pages/NotFound';
import { Donate } from './src/pages/Donate';
import { Tracking } from './src/pages/Tracking';
import BackendTest from './src/pages/BackendTest';
import { Login } from './pages/admin/Login';
import { ToastProvider } from './src/admin/components';
import {
  CMSLayout,
  CMSDashboard,
} from './src/pages/admin/CMS';
import {
  AdminProductsPage,
  AdminCatalogPage,
  AdminIndustriesPage,
  AdminInquiriesPage,
  AdminCareersPage,
  AdminDonationsPage,
  AdminShipmentsPage,
  AdminLogisticsPage,
  AdminBlogPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
  AdminOrdersPage
} from './src/admin/pages';
import { Analytics } from './src/lib/analytics';
import { I18nProvider } from './src/components/ui/I18n';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
  if (!isAdmin) return <Navigate to="/admin/login" />;
  return <>{children}</>;
};

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Layout Wrapper ensuring Navbar persistence
const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// CMS Layout Wrapper
const CMSRoute = () => {
  return (
    <ProtectedRoute>
      <CMSLayout>
        <Outlet />
      </CMSLayout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Persistent Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:category?" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/catalog" element={<CatalogDownload />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/about" element={<About />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/rfq" element={<RFQForm />} />
        {import.meta.env.DEV && <Route path="/test" element={<BackendTest />} />}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* CMS Routes - All Protected */}
      <Route element={<CMSRoute />}>
        <Route path="/admin" element={<CMSDashboard />} />
        <Route path="/admin/dashboard" element={<CMSDashboard />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/catalog" element={<AdminCatalogPage />} />
        <Route path="/admin/industries" element={<AdminIndustriesPage />} />
        <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
        <Route path="/admin/careers" element={<AdminCareersPage />} />
        <Route path="/admin/donations" element={<AdminDonationsPage />} />
        <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
        <Route path="/admin/logistics" element={<AdminLogisticsPage />} />
        <Route path="/admin/blogs" element={<AdminBlogPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <ToastProvider>
            <AuthProvider>
              <Analytics />
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollToTop />
                <AppRoutes />
              </Router>
            </AuthProvider>
          </ToastProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
