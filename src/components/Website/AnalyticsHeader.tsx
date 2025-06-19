
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ onRefresh, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📊 Analytics</h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t('website.websiteStats')} - {t('website.description')}
        </p>
      </div>
      <Button 
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? t('website.refreshing') : t('website.refresh')}
      </Button>
    </div>
  );
};
