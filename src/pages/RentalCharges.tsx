
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RentalChargeForm from '@/components/RentalChargeForm';
import ChargeMetrics from '@/components/RentalCharges/ChargeMetrics';
import MonthSelector from '@/components/RentalCharges/MonthSelector';
import YearSelector from '@/components/RentalCharges/YearSelector';
import ViewSelector from '@/components/RentalCharges/ViewSelector';
import ChargesList from '@/components/RentalCharges/ChargesList';
import AnnualChargesList from '@/components/RentalCharges/AnnualChargesList';
import { useChargesData } from '@/hooks/useChargesData';

const RentalCharges = () => {
  const { charges, addCharge, deleteCharge } = useChargesData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState<'monthly' | 'annual'>('monthly');

  const filteredCharges = selectedView === 'monthly' 
    ? charges.filter(charge => charge.month === selectedMonth)
    : charges.filter(charge => charge.month.startsWith(selectedYear));
  
  const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.total, 0);
  const averageCharges = filteredCharges.length > 0 ? totalCharges / filteredCharges.length : 0;
  const propertiesCount = selectedView === 'monthly' 
    ? filteredCharges.length 
    : new Set(filteredCharges.map(c => c.propertyName)).size;
  const highestCharge = filteredCharges.length > 0 ? Math.max(...filteredCharges.map(c => c.total)) : 0;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Charges Locatives</h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Gérez les charges de vos biens immobiliers
            </p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter des charges
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <ViewSelector 
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
          
          <div className="w-full sm:w-auto">
            {selectedView === 'monthly' ? (
              <MonthSelector 
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            ) : (
              <YearSelector 
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}
          </div>
        </div>

        <ChargeMetrics
          totalCharges={totalCharges}
          averageCharges={averageCharges}
          propertiesCount={propertiesCount}
          highestCharge={highestCharge}
        />

        {selectedView === 'monthly' ? (
          <ChargesList
            charges={filteredCharges}
            selectedMonth={selectedMonth}
            onDeleteCharge={deleteCharge}
          />
        ) : (
          <AnnualChargesList
            charges={filteredCharges}
            selectedYear={selectedYear}
          />
        )}

        <RentalChargeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={addCharge}
        />
      </div>
    </MainLayout>
  );
};

export default RentalCharges;
