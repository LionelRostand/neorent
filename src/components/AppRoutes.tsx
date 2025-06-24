
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Lazy load components
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Properties = React.lazy(() => import('@/pages/Properties'));
const Tenants = React.lazy(() => import('@/pages/Tenants'));
const Contracts = React.lazy(() => import('@/pages/Contracts'));
const RentManagement = React.lazy(() => import('@/pages/RentManagement'));
const Maintenance = React.lazy(() => import('@/pages/Maintenance'));
const Inspections = React.lazy(() => import('@/pages/Inspections'));
const Roommates = React.lazy(() => import('@/pages/Roommates'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Website = React.lazy(() => import('@/pages/Website'));
const RentalCharges = React.lazy(() => import('@/pages/RentalCharges'));
const Taxes = React.lazy(() => import('@/pages/Taxes'));
const Forecasting = React.lazy(() => import('@/pages/Forecasting'));
const OwnerSpace = React.lazy(() => import('@/pages/OwnerSpace'));
const TenantSpace = React.lazy(() => import('@/pages/TenantSpace'));
const PaymentValidation = React.lazy(() => import('@/pages/PaymentValidation'));
const Messages = React.lazy(() => import('@/pages/Messages'));
const Help = React.lazy(() => import('@/pages/Help'));
const Index = React.lazy(() => import('@/pages/Index'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Public site pages
const PublicHome = React.lazy(() => import('@/pages/PublicSite/Home'));
const PublicLogin = React.lazy(() => import('@/pages/PublicSite/Login'));
const PublicAbout = React.lazy(() => import('@/pages/PublicSite/About'));
const PublicContact = React.lazy(() => import('@/pages/PublicSite/Contact'));
const PublicProperties = React.lazy(() => import('@/pages/PublicSite/Properties'));
const CookiePolicy = React.lazy(() => import('@/pages/PublicSite/CookiePolicy'));
const LegalNotice = React.lazy(() => import('@/pages/PublicSite/LegalNotice'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PublicSite/PrivacyPolicy'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<PublicLogin />} />
        <Route path="/about" element={<PublicAbout />} />
        <Route path="/contact" element={<PublicContact />} />
        <Route path="/properties" element={<PublicProperties />} />
        <Route path="/politique-cookies" element={<CookiePolicy />} />
        <Route path="/mentions-legales" element={<LegalNotice />} />
        <Route path="/confidentialite" element={<PrivacyPolicy />} />

        {/* Protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/properties" element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        } />
        <Route path="/admin/tenants" element={
          <ProtectedRoute>
            <Tenants />
          </ProtectedRoute>
        } />
        <Route path="/admin/contracts" element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        } />
        <Route path="/admin/rent-management" element={
          <ProtectedRoute>
            <RentManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/maintenance" element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        } />
        <Route path="/admin/inspections" element={
          <ProtectedRoute>
            <Inspections />
          </ProtectedRoute>
        } />
        <Route path="/admin/roommates" element={
          <ProtectedRoute>
            <Roommates />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/admin/website" element={
          <ProtectedRoute>
            <Website />
          </ProtectedRoute>
        } />
        <Route path="/admin/rental-charges" element={
          <ProtectedRoute>
            <RentalCharges />
          </ProtectedRoute>
        } />
        <Route path="/admin/taxes" element={
          <ProtectedRoute>
            <Taxes />
          </ProtectedRoute>
        } />
        <Route path="/admin/forecasting" element={
          <ProtectedRoute>
            <Forecasting />
          </ProtectedRoute>
        } />
        <Route path="/admin/owner-space" element={
          <ProtectedRoute>
            <OwnerSpace />
          </ProtectedRoute>
        } />
        <Route path="/admin/tenant-space" element={
          <ProtectedRoute>
            <TenantSpace />
          </ProtectedRoute>
        } />
        <Route path="/admin/payment-validation" element={
          <ProtectedRoute>
            <PaymentValidation />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/admin/help" element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
