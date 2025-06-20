
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import TaxesHeader from '@/components/Taxes/TaxesHeader';
import TaxEstimationCard from '@/components/Taxes/TaxEstimationCard';
import YearFilter from '@/components/Taxes/YearFilter';
import TaxMetrics from '@/components/Taxes/TaxMetrics';
import TaxList from '@/components/Taxes/TaxList';
import TaxDeclarationForm from '@/components/TaxDeclarationForm';
import TaxDetailsModal from '@/components/TaxDetails/TaxDetailsModal';
import { useFirebaseFiscality } from '@/hooks/useFirebaseFiscality';

// Génération dynamique des années à partir de 2025
const generateYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const endYear = Math.max(currentYear + 2, startYear + 5); // Au moins 5 ans à partir de 2025 ou 2 ans après l'année courante
  
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

// Calcul approximatif des impôts pour l'année par défaut (2025 ou année courante si supérieure)
const defaultYear = Math.max(new Date().getFullYear(), 2025);

const Taxes = () => {
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [isDeclarationFormOpen, setIsDeclarationFormOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { fiscalities, loading, addFiscality, updateFiscality, deleteFiscality } = useFirebaseFiscality();
  
  const availableYears = generateYears();
  const filteredTaxes = fiscalities.filter(t => t.year === selectedYear);
  const currentYearTaxes = fiscalities.filter(t => t.year === defaultYear);
  
  const paidCount = filteredTaxes.filter(t => t.status === 'Payée').length;
  const pendingCount = filteredTaxes.filter(t => t.status === 'À payer').length;
  const todeclareCount = filteredTaxes.filter(t => t.status === 'À déclarer').length;
  const totalCount = filteredTaxes.length;

  // Calcul du montant total approximatif pour l'année par défaut
  const totalCurrentYearAmount = currentYearTaxes.reduce((sum, tax) => {
    const amount = parseFloat(tax.amount.replace('€', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const paidCurrentYear = currentYearTaxes.filter(t => t.status === 'Payée').reduce((sum, tax) => {
    const amount = parseFloat(tax.amount.replace('€', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const remainingCurrentYear = totalCurrentYearAmount - paidCurrentYear;

  const handleNewDeclaration = async (declarationData: any) => {
    try {
      console.log('Nouvelle déclaration fiscale:', declarationData);
      
      // Créer une nouvelle entrée de fiscalité basée sur la déclaration
      const newFiscality = {
        title: `Déclaration revenus fonciers ${declarationData.declarationYear}`,
        type: 'Revenus fonciers',
        property: `${declarationData.selectedProperties.length} bien(s) sélectionné(s)`,
        amount: `${declarationData.calculations.estimatedTax.toLocaleString('fr-FR')}€`,
        dueDate: `${declarationData.declarationYear + 1}-04-30`,
        status: 'À déclarer' as const,
        year: declarationData.declarationYear,
        description: `Déclaration générée automatiquement - Revenus nets: ${declarationData.calculations.netIncome.toLocaleString('fr-FR')}€`
      };

      await addFiscality(newFiscality);
      console.log('Déclaration fiscale ajoutée à Firebase');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la déclaration:', error);
    }
  };

  const handleShowDetails = (tax: any) => {
    setSelectedTax(tax);
    setIsDetailsModalOpen(true);
  };

  const handleEditTax = (taxId: string) => {
    console.log('Modifier la fiscalité:', taxId);
    // Ici on pourrait ouvrir une modale d'édition
  };

  const handleDeleteTax = async (taxId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiscalité ?')) {
      try {
        await deleteFiscality(taxId);
        console.log('Fiscalité supprimée:', taxId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleMarkAsPaid = async (taxId: string) => {
    try {
      await updateFiscality(taxId, { status: 'Payée' });
      console.log('Fiscalité marquée comme payée:', taxId);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-4">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <TaxesHeader onNewDeclaration={() => setIsDeclarationFormOpen(true)} />

        <TaxEstimationCard
          totalCurrentYearAmount={totalCurrentYearAmount}
          paidCurrentYear={paidCurrentYear}
          remainingCurrentYear={remainingCurrentYear}
        />

        <YearFilter
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={availableYears}
        />

        <TaxMetrics
          paidCount={paidCount}
          todeclareCount={todeclareCount}
          pendingCount={pendingCount}
          totalCount={totalCount}
        />

        <TaxList
          filteredTaxes={filteredTaxes}
          selectedYear={selectedYear}
          onShowDetails={handleShowDetails}
          onEditTax={handleEditTax}
          onDeleteTax={handleDeleteTax}
          onMarkAsPaid={handleMarkAsPaid}
        />

        <TaxDeclarationForm
          isOpen={isDeclarationFormOpen}
          onClose={() => setIsDeclarationFormOpen(false)}
          onSubmit={handleNewDeclaration}
        />

        <TaxDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          tax={selectedTax}
          onEdit={handleEditTax}
          onDelete={handleDeleteTax}
        />
      </div>
    </MainLayout>
  );
};

export default Taxes;
