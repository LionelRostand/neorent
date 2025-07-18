
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
import Settings from '@/pages/Settings';
import Maintenance from '@/pages/Maintenance';
import Help from '@/pages/Help';

export const AdminRoutes = [
  // Admin Routes - Accessible UNIQUEMENT à l'admin
  <Route 
    key="admin-root"
    path="/admin" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-dashboard"
    path="/admin/dashboard" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-properties"
    path="/admin/properties" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Properties />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-tenants"
    path="/admin/tenants" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Tenants />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-roommates"
    path="/admin/roommates" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Roommates />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-contracts"
    path="/admin/contracts" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Contracts />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-leases"
    path="/admin/leases" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Leases />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-inspections"
    path="/admin/inspections" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Inspections />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-rent-management"
    path="/admin/rent-management" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <RentManagement />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-rental-charges"
    path="/admin/rental-charges" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <RentalCharges />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-forecasting"
    path="/admin/forecasting" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Forecasting />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-maintenance"
    path="/admin/maintenance" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Maintenance />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-messages"
    path="/admin/messages" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Messages />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-taxes"
    path="/admin/taxes" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Taxes />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-website"
    path="/admin/website" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Website />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-settings"
    path="/admin/settings" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Settings />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="admin-help"
    path="/admin/help" 
    element={
      <ProtectedRoute requiredUserTypes={['admin']}>
        <Help />
      </ProtectedRoute>
    } 
  />
];
