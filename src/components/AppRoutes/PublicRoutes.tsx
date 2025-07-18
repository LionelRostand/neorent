
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

export const PublicRoutes = [
  <Route key="home" path="/" element={<PublicHome />} />,
  <Route key="about" path="/about" element={<PublicAbout />} />,
  <Route key="contact" path="/contact" element={<PublicContact />} />,
  <Route key="properties" path="/properties" element={<PublicProperties />} />,
  <Route key="login" path="/login" element={<PublicLogin />} />,
  <Route key="legal-notice" path="/legal-notice" element={<LegalNotice />} />,
  <Route key="privacy-policy" path="/privacy-policy" element={<PrivacyPolicy />} />,
  <Route key="cookie-policy" path="/cookie-policy" element={<CookiePolicy />} />
];
