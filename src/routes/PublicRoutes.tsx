
import React from 'react';
import { Route } from 'react-router-dom';
import PublicHome from "@/pages/PublicSite/Home";
import PublicAbout from "@/pages/PublicSite/About";
import PublicContact from "@/pages/PublicSite/Contact";
import PublicLogin from "@/pages/PublicSite/Login";

export const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<PublicHome />} />
      <Route path="/about" element={<PublicAbout />} />
      <Route path="/contact" element={<PublicContact />} />
      <Route path="/login" element={<PublicLogin />} />
    </>
  );
};
