
import React from 'react';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthChange
}) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">Filtrer par mois:</label>
      <select 
        value={selectedMonth} 
        onChange={(e) => onMonthChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
      >
        <option value="2024-12">Décembre 2024</option>
        <option value="2024-11">Novembre 2024</option>
        <option value="2024-10">Octobre 2024</option>
      </select>
    </div>
  );
};

export default MonthSelector;
