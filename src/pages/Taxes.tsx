import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Calendar, Building2, DollarSign, CheckCircle, Clock, XCircle, Receipt, TrendingUp, FileText } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import TaxDeclarationForm from '@/components/TaxDeclarationForm';

const taxes = [
  {
    id: 1,
    title: 'Taxe foncière 2024',
    type: 'Taxe foncière',
    property: 'Appartement Rue des Fleurs',
    amount: '1,350€',
    dueDate: '2024-10-15',
    status: 'À payer',
    year: 2024,
    description: 'Taxe sur la propriété foncière'
  },
  {
    id: 2,
    title: 'Revenus fonciers 2024',
    type: 'Revenus fonciers',
    property: 'Villa Montparnasse',
    amount: '4,200€',
    dueDate: '2025-04-30',
    status: 'À déclarer',
    year: 2024,
    description: 'Déclaration des revenus locatifs'
  },
  {
    id: 3,
    title: 'CFE 2024',
    type: 'CFE',
    property: 'Studio Centre-ville',
    amount: '520€',
    dueDate: '2024-12-15',
    status: 'À payer',
    year: 2024,
    description: 'Cotisation foncière des entreprises'
  },
  {
    id: 4,
    title: 'Taxe foncière 2023',
    type: 'Taxe foncière',
    property: 'Appartement Rue des Fleurs',
    amount: '1,200€',
    dueDate: '2023-10-15',
    status: 'Payée',
    year: 2023,
    description: 'Taxe sur la propriété foncière'
  },
  {
    id: 5,
    title: 'IFI 2024',
    type: 'IFI',
    property: 'Ensemble du patrimoine',
    amount: '2,800€',
    dueDate: '2024-06-15',
    status: 'Payée',
    year: 2024,
    description: 'Impôt sur la fortune immobilière'
  }
];

// Calcul approximatif des impôts pour l'année courante
const currentYear = new Date().getFullYear();
const currentYearTaxes = taxes.filter(t => t.year === currentYear);

const Taxes = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDeclarationFormOpen, setIsDeclarationFormOpen] = useState(false);
  
  const filteredTaxes = taxes.filter(t => t.year === selectedYear);
  const paidCount = filteredTaxes.filter(t => t.status === 'Payée').length;
  const pendingCount = filteredTaxes.filter(t => t.status === 'À payer').length;
  const todeclareCount = filteredTaxes.filter(t => t.status === 'À déclarer').length;
  const totalCount = filteredTaxes.length;

  // Calcul du montant total approximatif pour l'année courante
  const totalCurrentYearAmount = currentYearTaxes.reduce((sum, tax) => {
    const amount = parseFloat(tax.amount.replace('€', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const paidCurrentYear = currentYearTaxes.filter(t => t.status === 'Payée').reduce((sum, tax) => {
    const amount = parseFloat(tax.amount.replace('€', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const remainingCurrentYear = totalCurrentYearAmount - paidCurrentYear;

  const handleNewDeclaration = (declarationData: any) => {
    console.log('Nouvelle déclaration fiscale:', declarationData);
    // Ici on pourrait ajouter la déclaration à la liste des taxes
    // Pour l'instant on log juste les données
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fiscalités</h1>
            <p className="text-gray-600 mt-2">Gérez vos obligations fiscales et estimez vos impôts</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsDeclarationFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle déclaration
          </Button>
        </div>

        {/* Estimation fiscale pour l'année courante */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <TrendingUp className="mr-2 h-5 w-5" />
              Estimation Fiscale {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Approximatif</p>
                <p className="text-2xl font-bold text-blue-600">{totalCurrentYearAmount.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Déjà Payé</p>
                <p className="text-2xl font-bold text-green-600">{paidCurrentYear.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Reste à Payer</p>
                <p className="text-2xl font-bold text-orange-600">{remainingCurrentYear.toLocaleString('fr-FR')}€</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Cette estimation est basée sur les données déclarées et peut varier selon l'évolution de votre patrimoine et des taux d'imposition.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur d'année */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrer par année:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
        </div>

        {/* Métriques pour l'année sélectionnée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Payées"
            value={paidCount}
            description={`${paidCount} taxe${paidCount > 1 ? 's' : ''} payée${paidCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="À déclarer"
            value={todeclareCount}
            description={`${todeclareCount} déclaration${todeclareCount > 1 ? 's' : ''} à faire`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="À payer"
            value={pendingCount}
            description={`${pendingCount} paiement${pendingCount > 1 ? 's' : ''} à effectuer`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} obligation${totalCount > 1 ? 's' : ''} au total`}
            icon={Receipt}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Fiscalités - {selectedYear}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTaxes.map((tax) => (
            <Card key={tax.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{tax.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tax.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{tax.description}</p>
                    </div>
                    <Badge 
                      variant={tax.status === 'Payée' ? 'default' : tax.status === 'À déclarer' ? 'secondary' : 'destructive'}
                      className={
                        tax.status === 'Payée' ? 'bg-green-100 text-green-800' : 
                        tax.status === 'À déclarer' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }
                    >
                      {tax.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      {tax.property}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Montant: {tax.amount}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Échéance: {new Date(tax.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calculator className="mr-2 h-4 w-4" />
                      Année: {tax.year}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="mr-1 h-3 w-3" />
                      Détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Actions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTaxes.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune fiscalité</h3>
            <p className="mt-2 text-gray-500">Aucune obligation fiscale trouvée pour l'année {selectedYear}.</p>
          </div>
        )}

        <TaxDeclarationForm
          isOpen={isDeclarationFormOpen}
          onClose={() => setIsDeclarationFormOpen(false)}
          onSubmit={handleNewDeclaration}
        />
      </div>
    </MainLayout>
  );
};

export default Taxes;
