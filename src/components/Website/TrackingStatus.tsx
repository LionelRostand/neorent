
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface TrackingStatusProps {
  hasRealData: boolean;
}

export const TrackingStatus: React.FC<TrackingStatusProps> = ({ hasRealData }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 mb-4">
      {hasRealData ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t('website.trackingActive')}
          </Badge>
          <span className="text-sm text-gray-600">
            {t('website.realTimeDataAvailable')}
          </span>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 text-orange-500" />
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {t('website.awaitingData')}
          </Badge>
          <span className="text-sm text-gray-600">
            {t('website.demonstrationDataDisplayed')}
          </span>
        </>
      )}
    </div>
  );
};
