
import React from 'react';
import { useTranslation } from 'react-i18next';

interface YearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">{t('rentalCharges.filterByYear')}</label>
      <select 
        value={selectedYear} 
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
    </div>
  );
};

export default YearSelector;
