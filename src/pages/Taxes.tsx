import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Calendar, Building2, DollarSign, CheckCircle, Clock, XCircle, Receipt, TrendingUp, FileText, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
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
  const { t } = useTranslation();
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
          <p className="ml-4">{t('taxes.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('taxes.fiscalities')}</h1>
            <p className="text-sm sm:text-base text-gray-600">{t('taxes.manageFiscalObligations')}</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={() => setIsDeclarationFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('taxes.newDeclaration')}</span>
            <span className="sm:hidden">Nouvelle Déclaration</span>
          </Button>
        </div>

        {/* Estimation fiscale - Responsive card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center text-blue-800 text-base sm:text-lg">
              <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">{t('taxes.taxEstimation2025')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.approximateTotal')}</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalCurrentYearAmount.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-center p-3 sm:p-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.alreadyPaid')}</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{paidCurrentYear.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-center p-3 sm:p-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('taxes.remainingToPay')}</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{remainingCurrentYear.toLocaleString('fr-FR')}€</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-100 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>{t('common.note')}:</strong> {t('taxes.estimationNote')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur d'année - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-gray-700">{t('taxes.filterByYear')}</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Métriques - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title={t('taxes.paidTaxes')}
            value={paidCount}
            description={`${paidCount} ${t('taxes.taxPaid')}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title={t('taxes.taxesToDeclare')}
            value={todeclareCount}
            description={`${todeclareCount} ${t('taxes.declarationToDo')}`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title={t('taxes.taxesToPay')}
            value={pendingCount}
            description={`${pendingCount} ${t('taxes.paymentToMake')}`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title={t('taxes.totalTaxes')}
            value={totalCount}
            description={`${totalCount} ${t('taxes.totalObligation')}`}
            icon={Receipt}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste - Responsive */}
        <div className="pt-2 sm:pt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('taxes.taxList2025', { year: selectedYear })}</h2>
        </div>

        {/* Liste des taxes - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredTaxes.map((tax) => (
            <Card key={tax.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{tax.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{tax.type}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tax.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <Badge 
                        variant={tax.status === 'Payée' ? 'default' : tax.status === 'À déclarer' ? 'secondary' : 'destructive'}
                        className={`text-xs ${
                          tax.status === 'Payée' ? 'bg-green-100 text-green-800' : 
                          tax.status === 'À déclarer' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {tax.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTax(tax.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTax(tax.id)}
                          className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Building2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{tax.property}</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-xs sm:text-sm">
                      <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Montant: {tax.amount}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Échéance: {new Date(tax.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Calculator className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Année: {tax.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleShowDetails(tax)}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Détails</span>
                      <span className="sm:hidden">Voir</span>
                    </Button>
                    {tax.status !== 'Payée' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleMarkAsPaid(tax.id)}
                      >
                        <span className="hidden sm:inline">Marquer payé</span>
                        <span className="sm:hidden">Payé</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state - Responsive */}
        {filteredTaxes.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Receipt className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">Aucune fiscalité</h3>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 px-4">
              Aucune obligation fiscale trouvée pour l'année {selectedYear}.
            </p>
          </div>
        )}

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
