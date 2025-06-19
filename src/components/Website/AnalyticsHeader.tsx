
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, Pause } from 'lucide-react';

interface AnalyticsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  onRefresh, 
  isLoading, 
  autoRefresh, 
  onToggleAutoRefresh 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📊 Analytics</h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t('website.websiteStats')} - {t('website.description')}
        </p>
        {autoRefresh && (
          <p className="text-xs text-green-600 mt-1">
            🔄 Mise à jour automatique toutes les 30 secondes
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onToggleAutoRefresh}
          variant={autoRefresh ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {autoRefresh ? 'Pause auto' : 'Auto refresh'}
        </Button>
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? t('website.refreshing') : t('website.refresh')}
        </Button>
      </div>
    </div>
  );
};
