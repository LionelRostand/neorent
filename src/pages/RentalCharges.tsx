
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
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';
import { useToast } from '@/hooks/use-toast';

const RentalCharges = () => {
  const { charges, loading, error, addCharge, deleteCharge } = useFirebaseCharges();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState<'monthly' | 'annual'>('monthly');
  const { toast } = useToast();

  const filteredCharges = selectedView === 'monthly' 
    ? charges.filter(charge => charge.month === selectedMonth)
    : charges.filter(charge => charge.month.startsWith(selectedYear));
  
  const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.total, 0);
  const averageCharges = filteredCharges.length > 0 ? totalCharges / filteredCharges.length : 0;
  const propertiesCount = selectedView === 'monthly' 
    ? filteredCharges.length 
    : new Set(filteredCharges.map(c => c.propertyName)).size;
  const highestCharge = filteredCharges.length > 0 ? Math.max(...filteredCharges.map(c => c.total)) : 0;

  const handleAddCharge = async (data: any) => {
    try {
      await addCharge(data);
      toast({
        title: "Succès",
        description: "La charge a été ajoutée avec succès.",
      });
      console.log('Charge ajoutée à la collection Rent_Charges:', data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la charge:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la charge.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharge = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) {
      try {
        await deleteCharge(id);
        toast({
          title: "Succès",
          description: "La charge a été supprimée avec succès.",
        });
        console.log('Charge supprimée de la collection Rent_Charges:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression de la charge:', err);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de la charge.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des charges...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

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
            onDeleteCharge={handleDeleteCharge}
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
          onSubmit={handleAddCharge}
        />
      </div>
    </MainLayout>
  );
};

export default RentalCharges;
