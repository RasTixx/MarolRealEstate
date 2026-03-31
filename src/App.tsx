import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import { usePageTracking } from './hooks/usePageTracking';

const HomePage = lazy(() => import('./pages/HomePage'));
const BuyProperty = lazy(() => import('./pages/BuyProperty'));
const SellProperty = lazy(() => import('./pages/SellProperty'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const EditProperty = lazy(() => import('./pages/EditProperty'));
const GDPRPage = lazy(() => import('./pages/GDPRPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ComplaintsPage = lazy(() => import('./pages/ComplaintsPage'));
const EthicsPage = lazy(() => import('./pages/EthicsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
  </div>
);

function PageTracker() {
  usePageTracking();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <PageTracker />
          <ScrollToTop />
          <CookieBanner />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chcem-kupit" element={<BuyProperty />} />
              <Route path="/chcem-predat" element={<SellProperty />} />
              <Route path="/referencie" element={<Testimonials />} />
              <Route path="/nehnutelnost/:id" element={<PropertyDetail />} />
              <Route path="/ochrana-osobnych-udajov" element={<GDPRPage />} />
              <Route path="/vseobecne-obchodne-podmienky" element={<TermsPage />} />
              <Route path="/reklamacny-poriadok" element={<ComplaintsPage />} />
              <Route path="/eticky-kodex" element={<EthicsPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/properties/new"
                element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/properties/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
