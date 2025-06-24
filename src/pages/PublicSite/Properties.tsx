
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { PublicPropertiesHero } from '@/components/PublicSite/PublicPropertiesHero';
import { PublicPropertiesList } from '@/components/PublicSite/PublicPropertiesList';

const PublicProperties = () => {
  const { t } = useTranslation();
  const { trackPageView } = useAnalyticsTracking();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    trackPageView('/properties');
  }, [trackPageView]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <PublicLayout>
      <PublicPropertiesHero onSearch={handleSearch} />
      <PublicPropertiesList searchTerm={searchTerm} />
      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicProperties;
