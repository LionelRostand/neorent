import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyRentFiltersProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthlyRentFilters: React.FC<MonthlyRentFiltersProps> = ({
  selectedMonth,
  onMonthChange
}) => {
  const { t } = useTranslation();

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const handleCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long',
      year: 'numeric' 
    });
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth.getMonth() === now.getMonth() && 
           selectedMonth.getFullYear() === now.getFullYear();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sélection du mois
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Mois précédent
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">
                {formatMonth(selectedMonth)}
              </div>
              {isCurrentMonth() && (
                <div className="text-sm text-green-600 font-medium">
                  Mois actuel
                </div>
              )}
            </div>
            
            {!isCurrentMonth() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCurrentMonth}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Retour au mois actuel
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="flex items-center gap-2"
          >
            Mois suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyRentFilters;