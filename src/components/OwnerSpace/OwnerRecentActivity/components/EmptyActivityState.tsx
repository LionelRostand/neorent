
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

const EmptyActivityState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-8">
      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">{t('ownerSpace.recentActivity.noActivity')}</p>
    </div>
  );
};

export default EmptyActivityState;
