
import React, { useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import Hero from '@/components/PublicSite/Hero';
import Features from '@/components/PublicSite/Features';
import Benefits from '@/components/PublicSite/Benefits';
import CTA from '@/components/PublicSite/CTA';

const Index = () => {
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <PublicLayout>
      <Hero />
      <Features />
      <Benefits />
      <CTA />
      <ChatWidget />
    </PublicLayout>
  );
};

export default Index;
