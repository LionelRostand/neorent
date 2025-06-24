
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicRoutes } from '@/routes/PublicRoutes';
import { ProtectedRoutes } from '@/routes/ProtectedRoutes';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <PublicRoutes />
      <ProtectedRoutes />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
