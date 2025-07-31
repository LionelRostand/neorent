
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

  // Générer les options d'années dynamiquement
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Ajouter l'année prochaine, l'année actuelle et 3 années précédentes
    for (let i = 1; i >= -3; i--) {
      years.push(currentYear + i);
    }
    
    return years;
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">{t('rentalCharges.filterByYear')}</label>
      <select 
        value={selectedYear} 
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
      >
        {yearOptions.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
