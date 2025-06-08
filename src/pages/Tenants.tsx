
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Phone, Home, Calendar } from 'lucide-react';

const tenants = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    property: 'Appartement Rue des Fleurs',
    rentAmount: '1,200€',
    nextPayment: '2024-01-01',
    status: 'À jour',
    leaseStart: '2023-06-01'
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '06 98 76 54 32',
    property: 'Villa Montparnasse',
    rentAmount: '2,500€',
    nextPayment: '2024-01-01',
    status: 'À jour',
    leaseStart: '2023-03-15'
  },
  {
    id: 3,
    name: 'Sophie Leroy',
    email: 'sophie.leroy@email.com',
    phone: '06 11 22 33 44',
    property: 'Appartement Boulevard Haussmann',
    rentAmount: '1,800€',
    nextPayment: '2023-12-28',
    status: 'En retard',
    leaseStart: '2023-01-10'
  }
];

const Tenants = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
            <p className="text-gray-600 mt-2">Gérez vos locataires et leurs informations</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un locataire
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tenant.property}</p>
                    </div>
                    <Badge 
                      variant={tenant.status === 'À jour' ? 'default' : 'destructive'}
                      className={tenant.status === 'À jour' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {tenant.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {tenant.email}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {tenant.phone}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Home className="mr-2 h-4 w-4" />
                      Loyer: {tenant.rentAmount}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Début bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Prochain paiement: {new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Contacter
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

export default Tenants;
