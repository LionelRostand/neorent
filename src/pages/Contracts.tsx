
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, User, Building2, CheckCircle, Clock, XCircle, ScrollText } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

const contracts = [
  {
    id: 1,
    title: 'Contrat de maintenance - Villa Montparnasse',
    type: 'Maintenance',
    provider: 'Plomberie Express',
    property: 'Villa Montparnasse',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    amount: '1,200€',
    status: 'Actif'
  },
  {
    id: 2,
    title: 'Contrat assurance - Appartement Rue des Fleurs',
    type: 'Assurance',
    provider: 'Assur Immo',
    property: 'Appartement Rue des Fleurs',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    amount: '800€',
    status: 'Actif'
  },
  {
    id: 3,
    title: 'Contrat syndic - Résidence Les Jardins',
    type: 'Syndic',
    provider: 'Syndic Pro',
    property: 'Studio Centre-ville',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    amount: '600€',
    status: 'Expiré'
  }
];

const Contracts = () => {
  const activeCount = contracts.filter(c => c.status === 'Actif').length;
  const expiredCount = contracts.filter(c => c.status === 'Expiré').length;
  const totalCount = contracts.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contrats</h1>
            <p className="text-gray-600 mt-2">Gérez vos contrats de services et prestataires</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau contrat
          </Button>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Contrats actifs"
            value={activeCount}
            description={`${activeCount} contrat${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="À renouveler"
            value={0}
            description="0 contrat à renouveler"
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Expirés"
            value={expiredCount}
            description={`${expiredCount} contrat${expiredCount > 1 ? 's' : ''} expiré${expiredCount > 1 ? 's' : ''}`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} contrat${totalCount > 1 ? 's' : ''} au total`}
            icon={ScrollText}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste - maintenant après les métriques */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Contrats</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{contract.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{contract.type}</p>
                    </div>
                    <Badge 
                      variant={contract.status === 'Actif' ? 'default' : 'destructive'}
                      className={contract.status === 'Actif' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {contract.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      {contract.provider}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      {contract.property}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Du {new Date(contract.startDate).toLocaleDateString('fr-FR')} au {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                      <FileText className="mr-2 h-4 w-4" />
                      {contract.amount}/an
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Modifier
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

export default Contracts;
