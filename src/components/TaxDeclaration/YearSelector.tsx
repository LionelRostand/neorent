
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearSelectorProps {
  declarationYear: number;
  onYearChange: (year: number) => void;
}

const YearSelector = ({ declarationYear, onYearChange }: YearSelectorProps) => {
  const generateYears = () => {
    const years = [];
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 5;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="year">Année de déclaration</Label>
      <Select value={declarationYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {generateYears().map((year) => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
