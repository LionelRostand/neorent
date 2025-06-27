
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import PublicHome from '@/pages/PublicSite/Home';
import PublicAbout from '@/pages/PublicSite/About';
import PublicContact from '@/pages/PublicSite/Contact';
import PublicProperties from '@/pages/PublicSite/Properties';
import PublicLogin from '@/pages/PublicSite/Login';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Tenants from '@/pages/Tenants';
import Roommates from '@/pages/Roommates';
import Contracts from '@/pages/Contracts';
import Leases from '@/pages/Leases';
import Inspections from '@/pages/Inspections';
import RentManagement from '@/pages/RentManagement';
import RentalCharges from '@/pages/RentalCharges';
import Forecasting from '@/pages/Forecasting';
import Taxes from '@/pages/Taxes';
import Website from '@/pages/Website';
import Messages from '@/pages/Messages';
import TenantSpace from '@/pages/TenantSpace';
import OwnerSpace from '@/pages/OwnerSpace';
import Settings from '@/pages/Settings';
import Maintenance from '@/pages/Maintenance';
import Help from '@/pages/Help';
import NotFound from '@/pages/NotFound';
import LegalNotice from '@/pages/PublicSite/LegalNotice';
import PrivacyPolicy from '@/pages/PublicSite/PrivacyPolicy';
import CookiePolicy from '@/pages/PublicSite/CookiePolicy';
import MainLayout from '@/components/Layout/MainLayout';
import AdminOwnerSpaceManager from '@/components/OwnerSpace/AdminOwnerSpaceManager';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/about" element={<PublicAbout />} />
      <Route path="/contact" element={<PublicContact />} />
      <Route path="/properties" element={<PublicProperties />} />
      <Route path="/login" element={<PublicLogin />} />
      <Route path="/legal-notice" element={<LegalNotice />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />

      {/* Protected Routes */}
      <Route 
        path="/tenant-space" 
        element={
          <ProtectedRoute>
            <TenantSpace />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/owner-space" 
        element={
          <ProtectedRoute requiredUserTypes={['admin', 'owner']}>
            <OwnerSpace />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes with MainLayout */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/properties" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Properties />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tenants" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Tenants />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/roommates" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Roommates />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/contracts" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Contracts />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/leases" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Leases />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/inspections" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Inspections />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rent-management" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <RentManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rental-charges" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <RentalCharges />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/forecasting" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Forecasting />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/maintenance" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Maintenance />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/messages" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Messages />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/taxes" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Taxes />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/website" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Website />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/help" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Help />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Route pour l'administration des espaces propriétaires avec MainLayout */}
      <Route 
        path="/admin/owner-spaces" 
        element={
          <ProtectedRoute requiredUserTypes={['admin']}>
            <MainLayout>
              <AdminOwnerSpaceManager />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
