import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import ArtworkDetails from './pages/ArtworkDetailsPage';
import NotFound from './pages/NotFound';
import BrowseArt from './pages/BrowseArt';
import AboutUs from './pages/AboutUs';
import Scanner from './pages/Scanner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="browse" element={<BrowseArt />} />
          <Route path="artwork/:id" element={<ArtworkDetails />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="scanner" element={<Scanner />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;