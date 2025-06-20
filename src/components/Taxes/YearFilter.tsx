
import React from 'react';
import { useTranslation } from 'react-i18next';

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  availableYears: number[];
}

const YearFilter = ({ selectedYear, onYearChange, availableYears }: YearFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="text-sm font-medium text-gray-700">{t('taxes.filterByYear')}</label>
      <select 
        value={selectedYear} 
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
      >
        {availableYears.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearFilter;
