
import React from 'react';
import { Route } from 'react-router-dom';
import PublicHome from '@/pages/PublicSite/Home';
import PublicAbout from '@/pages/PublicSite/About';
import PublicContact from '@/pages/PublicSite/Contact';
import PublicProperties from '@/pages/PublicSite/Properties';
import PublicLogin from '@/pages/PublicSite/Login';
import LegalNotice from '@/pages/PublicSite/LegalNotice';
import PrivacyPolicy from '@/pages/PublicSite/PrivacyPolicy';
import CookiePolicy from '@/pages/PublicSite/CookiePolicy';

export const PublicRoutes = () => (
  <>
    <Route path="/" element={<PublicHome />} />
    <Route path="/about" element={<PublicAbout />} />
    <Route path="/contact" element={<PublicContact />} />
    <Route path="/properties" element={<PublicProperties />} />
    <Route path="/login" element={<PublicLogin />} />
    <Route path="/legal-notice" element={<LegalNotice />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/cookie-policy" element={<CookiePolicy />} />
  </>
);
