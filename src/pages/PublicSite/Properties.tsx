
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { PublicPropertiesHero } from '@/components/PublicSite/PublicPropertiesHero';
import { PublicPropertiesList } from '@/components/PublicSite/PublicPropertiesList';

const PublicProperties = () => {
  const { t } = useTranslation();
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    trackPageView('/properties');
  }, [trackPageView]);

  return (
    <PublicLayout>
      <PublicPropertiesHero />
      <PublicPropertiesList />
      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicProperties;
