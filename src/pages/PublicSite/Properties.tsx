
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
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    trackPageView('/properties');
  }, [trackPageView]);

  const handleSearch = (searchTerm: string) => {
    console.log('📥 Filtre de recherche reçu:', searchTerm);
    setSearchFilter(searchTerm);
  };

  return (
    <PublicLayout>
      <PublicPropertiesHero onSearch={handleSearch} />
      <PublicPropertiesList searchFilter={searchFilter} />
      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicProperties;
