
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ViewSelectorProps {
  selectedView: 'monthly' | 'annual';
  onViewChange: (view: 'monthly' | 'annual') => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  selectedView,
  onViewChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">{t('rentalCharges.view')}</label>
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <button
          onClick={() => onViewChange('monthly')}
          className={`px-4 py-2 text-sm ${
            selectedView === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {t('rentalCharges.monthlyView')}
        </button>
        <button
          onClick={() => onViewChange('annual')}
          className={`px-4 py-2 text-sm border-l border-gray-300 ${
            selectedView === 'annual'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {t('rentalCharges.annualView')}
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;
