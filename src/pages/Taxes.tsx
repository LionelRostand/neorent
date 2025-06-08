import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, Calendar, Building2, DollarSign, CheckCircle, Clock, XCircle, Receipt } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

const taxes = [
  {
    id: 1,
    title: 'Taxe foncière 2023',
    type: 'Taxe foncière',
    property: 'Appartement Rue des Fleurs',
    amount: '1,200€',
    dueDate: '2023-10-15',
    status: 'Payée',
    year: 2023
  },
  {
    id: 2,
    title: 'Revenus fonciers 2023',
    type: 'Revenus fonciers',
    property: 'Villa Montparnasse',
    amount: '3,500€',
    dueDate: '2024-04-30',
    status: 'À déclarer',
    year: 2023
  },
  {
    id: 3,
    title: 'CFE 2023',
    type: 'CFE',
    property: 'Studio Centre-ville',
    amount: '450€',
    dueDate: '2023-12-15',
    status: 'En attente',
    year: 2023
  }
];

const Taxes = () => {
  const paidCount = taxes.filter(t => t.status === 'Payée').length;
  const pendingCount = taxes.filter(t => t.status === 'En attente').length;
  const todeclareCount = taxes.filter(t => t.status === 'À déclarer').length;
  const totalCount = taxes.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fiscalités</h1>
            <p className="text-gray-600 mt-2">Gérez vos obligations fiscales</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle déclaration
          </Button>
        </div>

        {/* Métriques */}
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
            title="En attente"
            value={pendingCount}
            description={`${pendingCount} paiement${pendingCount > 1 ? 's' : ''} en attente`}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Fiscalités</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxes.map((tax) => (
            <Card key={tax.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{tax.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tax.type}</p>
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
                      Voir détails
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
      </div>
    </MainLayout>
  );
};

export default Taxes;
