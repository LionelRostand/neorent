
import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-blue-700">
        <strong>{t('publicSite.ownerRegistration.importantInfo')}:</strong> {t('publicSite.ownerRegistration.importantInfoText')}
      </p>
    </div>
  );
};

export default InfoBanner;
