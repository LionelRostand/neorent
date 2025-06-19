
import React, { useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import AboutHero from '@/components/PublicSite/AboutHero';
import AboutStory from '@/components/PublicSite/AboutStory';
import AboutValues from '@/components/PublicSite/AboutValues';
import AboutStats from '@/components/PublicSite/AboutStats';
import AboutTeam from '@/components/PublicSite/AboutTeam';

const PublicAbout = () => {
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    trackPageView('/about');
  }, [trackPageView]);

  return (
    <PublicLayout>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutStats />
      <AboutTeam />
      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicAbout;
