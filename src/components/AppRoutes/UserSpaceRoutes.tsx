
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import TenantSpace from '@/pages/TenantSpace';
import OwnerSpace from '@/pages/OwnerSpace';

export const UserSpaceRoutes = () => (
  <>
    {/* Tenant Space */}
    <Route 
      path="/tenant-space" 
      element={
        <ProtectedRoute>
          <TenantSpace />
        </ProtectedRoute>
      } 
    />
    
    {/* Owner Space avec nom personnalisé - accessible uniquement aux propriétaires */}
    <Route 
      path="/owner-space-:ownerName" 
      element={
        <ProtectedRoute requiredUserTypes={['owner']}>
          <OwnerSpace />
        </ProtectedRoute>
      } 
    />
  </>
);
