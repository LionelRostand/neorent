
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import TenantSpace from '@/pages/TenantSpace';
import OwnerSpace from '@/pages/OwnerSpace';

export const UserSpaceRoutes = [
  // Tenant Space
  <Route 
    key="tenant-space"
    path="/tenant-space" 
    element={
      <ProtectedRoute>
        <TenantSpace />
      </ProtectedRoute>
    } 
  />,
  
  // Redirection de /owner-space vers /owner-space-lionel-rostand
  <Route 
    key="owner-space-redirect"
    path="/owner-space" 
    element={<Navigate to="/owner-space-lionel-rostand" replace />}
  />,
  
  // Owner Space avec nom personnalisé - accessible aux propriétaires et admins
  <Route 
    key="owner-space-lionel-rostand"
    path="/owner-space-lionel-rostand" 
    element={
      <ProtectedRoute requiredUserTypes={['owner', 'admin']}>
        <OwnerSpace />
      </ProtectedRoute>
    } 
  />,
  
  // Route générique pour capturer d'autres variations d'owner-space
  <Route 
    key="owner-space-generic"
    path="/owner-space-*" 
    element={
      <ProtectedRoute requiredUserTypes={['owner', 'admin']}>
        <OwnerSpace />
      </ProtectedRoute>
    } 
  />
];
