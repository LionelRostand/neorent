
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

  // Générer les options de mois dynamiquement pour l'année complète
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Créer les 12 mois de l'année en cours
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      options.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1) // Capitaliser la première lettre
      });
    }
    
    // Ajouter aussi les 12 mois de l'année prochaine
    const nextYear = currentYear + 1;
    for (let month = 0; month < 12; month++) {
      const date = new Date(nextYear, month, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      options.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1)
      });
    }
    
    // Ajouter aussi les 12 mois de l'année précédente au début
    const previousYear = currentYear - 1;
    const previousYearOptions = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(previousYear, month, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      previousYearOptions.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1)
      });
    }
    
    // Combiner : année précédente + année actuelle + année prochaine
    return [...previousYearOptions, ...options];
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">{t('rentalCharges.filterByMonth')}</label>
      <select 
        value={selectedMonth} 
        onChange={(e) => onMonthChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
