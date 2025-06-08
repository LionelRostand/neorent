import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, User, Building2, CheckCircle, Clock, XCircle, ScrollText } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

const leases = [
  {
    id: 1,
    title: 'Bail Marie Dubois',
    tenant: 'Marie Dubois',
    property: 'Appartement Rue des Fleurs',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    rent: '1,200€',
    deposit: '2,400€',
    status: 'Actif'
  },
  {
    id: 2,
    title: 'Bail Jean Martin',
    tenant: 'Jean Martin',
    property: 'Villa Montparnasse',
    startDate: '2023-03-15',
    endDate: '2024-03-15',
    rent: '2,500€',
    deposit: '5,000€',
    status: 'Actif'
  },
  {
    id: 3,
    title: 'Bail Sophie Leroy',
    tenant: 'Sophie Leroy',
    property: 'Appartement Boulevard Haussmann',
    startDate: '2023-01-10',
    endDate: '2024-01-10',
    rent: '1,800€',
    deposit: '3,600€',
    status: 'À renouveler'
  }
];

const Leases = () => {
  const activeCount = leases.filter(l => l.status === 'Actif').length;
  const renewCount = leases.filter(l => l.status === 'À renouveler').length;
  const totalCount = leases.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Baux</h1>
            <p className="text-gray-600 mt-2">Gérez les baux de vos locataires</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau bail
          </Button>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Baux actifs"
            value={activeCount}
            description={`${activeCount} bail${activeCount > 1 ? 'x' : ''} actif${activeCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="À renouveler"
            value={renewCount}
            description={`${renewCount} bail${renewCount > 1 ? 'x' : ''} à renouveler`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Résiliés"
            value={0}
            description="0 bail résilié"
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} bail${totalCount > 1 ? 'x' : ''} au total`}
            icon={ScrollText}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Baux</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leases.map((lease) => (
            <Card key={lease.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{lease.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lease.property}</p>
                    </div>
                    <Badge 
                      variant={lease.status === 'Actif' ? 'default' : 'secondary'}
                      className={lease.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {lease.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      {lease.tenant}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      Loyer: {lease.rent}/mois
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Dépôt: {lease.deposit}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Du {new Date(lease.startDate).toLocaleDateString('fr-FR')} au {new Date(lease.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir bail
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

export default Leases;
