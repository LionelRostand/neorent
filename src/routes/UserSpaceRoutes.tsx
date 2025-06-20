
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import TenantSpace from "@/pages/TenantSpace";
import OwnerSpace from "@/pages/OwnerSpace";

export const UserSpaceRoutes = () => {
  return (
    <>
      {/* Tenant Space - Protected for tenants and roommates */}
      <Route 
        path="/tenant-space" 
        element={
          <ProtectedRoute requiredUserTypes={['locataire', 'colocataire', 'admin']}>
            <TenantSpace />
          </ProtectedRoute>
        } 
      />
      
      {/* Owner Space - Protected for owners and admins */}
      <Route 
        path="/owner-space" 
        element={
          <ProtectedRoute requiredUserTypes={['employee', 'admin']}>
            <OwnerSpace />
          </ProtectedRoute>
        } 
      />
    </>
  );
};
