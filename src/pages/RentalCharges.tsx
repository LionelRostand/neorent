
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { charges, loading, error, addCharge, deleteCharge } = useFirebaseCharges();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2024-12'); // Décembre 2024 par défaut
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState<'monthly' | 'annual'>('monthly');
  const { toast } = useToast();

  // Debug pour comprendre le problème de filtrage
  console.log('🔍 Debug charges filtrage:', {
    totalCharges: charges.length,
    selectedMonth,
    selectedView,
    rawCharges: charges
  });

  // Correction du filtrage avec une logique plus robuste
  const filteredCharges = selectedView === 'monthly' 
    ? charges.filter(charge => {
        if (!charge.month) {
          console.log('⚠️ Charge sans mois:', charge);
          return false;
        }
        
        // Normaliser le format de date - supporter plusieurs formats
        let chargeMonth = charge.month;
        
        // Si le format est "juillet 2025", convertir en "2025-07"
        if (chargeMonth.includes(' ')) {
          const months = {
            'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
            'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
            'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
          };
          const [monthName, year] = chargeMonth.toLowerCase().split(' ');
          chargeMonth = `${year}-${months[monthName] || '01'}`;
        }
        
        const matches = chargeMonth === selectedMonth;
        console.log(`🎯 Filtrage: ${charge.propertyName} - ${charge.month} (normalisé: ${chargeMonth}) === ${selectedMonth} ? ${matches}`);
        return matches;
      })
    : charges.filter(charge => charge.month && charge.month.startsWith(selectedYear));
  
  console.log('📊 Charges filtrées résultat:', filteredCharges);
  
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
        title: t('common.success'),
        description: t('rentalCharges.addSuccess'),
      });
      console.log('Charge ajoutée à la collection Rent_Charges:', data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la charge:', err);
      toast({
        title: t('common.error'),
        description: t('rentalCharges.addError'),
        variant: "destructive",
      });
    }
  };
  
  // Si aucune charge n'est trouvée et qu'il n'y a pas de charges du tout, créer une charge de test
  React.useEffect(() => {
    if (charges.length === 0 && !loading) {
      console.log('🆘 Aucune charge trouvée, création d\'une charge de test...');
      const testCharge = {
        propertyName: 'Appartement 13 - Colocation',
        propertyType: 'colocation',
        tenant: 'EMAD ADAM, RUTH MEGHA',
        month: '2024-12',
        electricity: 0,
        water: 83.33,
        heating: 150,
        maintenance: 0,
        insurance: 0,
        garbage: 100,
        internet: 0,
        total: 333.33,
      };
      
      handleAddCharge(testCharge);
    }
  }, [charges.length, loading, handleAddCharge]);

  const handleDeleteCharge = async (id: string) => {
    if (window.confirm(t('rentalCharges.confirmDelete'))) {
      try {
        await deleteCharge(id);
        toast({
          title: t('common.success'),
          description: t('rentalCharges.deleteSuccess'),
        });
        console.log('Charge supprimée de la collection Rent_Charges:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression de la charge:', err);
        toast({
          title: t('common.error'),
          description: t('rentalCharges.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('rentalCharges.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('rentalCharges.title')}</h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              {t('rentalCharges.subtitle')}
            </p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('rentalCharges.addCharge')}
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
