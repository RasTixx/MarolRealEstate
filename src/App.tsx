import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import BuyProperty from './pages/BuyProperty';
import SellProperty from './pages/SellProperty';
import Testimonials from './pages/Testimonials';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chcem-kupit" element={<BuyProperty />} />
          <Route path="/chcem-predat" element={<SellProperty />} />
          <Route path="/referencie" element={<Testimonials />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
