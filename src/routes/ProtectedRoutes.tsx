
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
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

export const ProtectedRoutes = () => (
  <>
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
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <OwnerSpace />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/admin" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/dashboard" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/properties" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Properties />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/tenants" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Tenants />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/roommates" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Roommates />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/contracts" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Contracts />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/leases" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Leases />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/inspections" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Inspections />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/rent-management" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <RentManagement />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/rental-charges" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <RentalCharges />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/forecasting" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Forecasting />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/maintenance" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Maintenance />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/messages" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Messages />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/taxes" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Taxes />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/website" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Website />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/settings" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Settings />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/help" 
      element={
        <ProtectedRoute requiredUserTypes={['admin', 'employee']}>
          <Help />
        </ProtectedRoute>
      } 
    />
  </>
);
