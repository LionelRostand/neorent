
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Admin pages
import PublicLogin from '@/pages/PublicSite/Login';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Tenants from '@/pages/Tenants';
import Roommates from '@/pages/Roommates';
import Contracts from '@/pages/Contracts';
import Inspections from '@/pages/Inspections';
import RentManagement from '@/pages/RentManagement';
import RentalCharges from '@/pages/RentalCharges';
import Forecasting from '@/pages/Forecasting';
import Maintenance from '@/pages/Maintenance';
import Messages from '@/pages/Messages';
import Taxes from '@/pages/Taxes';
import Website from '@/pages/Website';
import Settings from '@/pages/Settings';
import Help from '@/pages/Help';

// Tenant/Roommate pages
import TenantSpace from '@/pages/TenantSpace';

// Owner pages
import OwnerSpace from '@/pages/OwnerSpace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicLogin />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Properties />
              </ProtectedRoute>
            } />
            <Route path="/admin/tenants" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Tenants />
              </ProtectedRoute>
            } />
            <Route path="/admin/roommates" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Roommates />
              </ProtectedRoute>
            } />
            <Route path="/admin/contracts" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Contracts />
              </ProtectedRoute>
            } />
            <Route path="/admin/inspections" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Inspections />
              </ProtectedRoute>
            } />
            <Route path="/admin/rent-management" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <RentManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/rental-charges" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <RentalCharges />
              </ProtectedRoute>
            } />
            <Route path="/admin/forecasting" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Forecasting />
              </ProtectedRoute>
            } />
            <Route path="/admin/maintenance" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Maintenance />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/admin/taxes" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Taxes />
              </ProtectedRoute>
            } />
            <Route path="/admin/website" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Website />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin/help" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <Help />
              </ProtectedRoute>
            } />

            {/* Owner space routes */}
            <Route path="/owner-space" element={
              <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
                <OwnerSpace />
              </ProtectedRoute>
            } />

            {/* Tenant/Roommate routes */}
            <Route path="/tenant-space" element={
              <ProtectedRoute requiredUserTypes={['locataire', 'colocataire']}>
                <TenantSpace />
              </ProtectedRoute>
            } />

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
