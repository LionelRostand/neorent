
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">{t('rentalCharges.filterByMonth')}</label>
      <select 
        value={selectedMonth} 
        onChange={(e) => onMonthChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="2024-12">{t('rentalCharges.december2024')}</option>
        <option value="2024-11">{t('rentalCharges.november2024')}</option>
        <option value="2024-10">{t('rentalCharges.october2024')}</option>
      </select>
    </div>
  );
};

export default MonthSelector;
