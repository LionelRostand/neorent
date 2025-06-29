
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicRoutes } from './AppRoutes/PublicRoutes';
import { UserSpaceRoutes } from './AppRoutes/UserSpaceRoutes';
import { AdminRoutes } from './AppRoutes/AdminRoutes';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PublicRoutes}

      {/* User Space Routes (Tenant & Owner) */}
      {UserSpaceRoutes}
      
      {/* Admin Routes */}
      {AdminRoutes}

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
