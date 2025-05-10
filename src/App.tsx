import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import FeedbackPage from './pages/FeedbackPage';
import ComplaintPage from './pages/ComplaintPage';
import AdminPage from './pages/AdminPage';
import Login from './pages/login';
import Register from './pages/Register';
import { User } from 'lucide-react';
import UserProfilePage from './pages/UserProfilePage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/register'].includes(location.pathname);
  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!hideLayout && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
          error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  );
};

// Vérifie si l'utilisateur est admin
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  console.log('ProtectedAdminRoute - isAdmin:', isAdmin); // Debugging line
  return isAdmin ? children : <Navigate to="/login" replace />;
};

// Vérifie si l'utilisateur est connecté
const ProtectedUserRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('username');
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      element={
        <Layout>
          <HomePage />
        </Layout>
      }
    />
    <Route
      path="/feedback"
      element={
        <ProtectedUserRoute>
          <Layout>
            <FeedbackPage />
          </Layout>
        </ProtectedUserRoute>
      }
    />
    <Route
      path="/complaint"
      element={
        <ProtectedUserRoute>
          <Layout>
            <ComplaintPage />
          </Layout>
        </ProtectedUserRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedAdminRoute>
          <Layout>
            <AdminPage />
          </Layout>
        </ProtectedAdminRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedUserRoute>
          <Layout>
            <UserProfilePage />
          </Layout>
        </ProtectedUserRoute>
      }
    />
  </Routes>
);

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}
