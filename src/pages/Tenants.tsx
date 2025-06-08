
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Prochain paiement</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.phone}</TableCell>
                  <TableCell>{tenant.property}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{tenant.rentAmount}</TableCell>
                  <TableCell>{new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={tenant.status === 'À jour' ? 'default' : 'destructive'}
                      className={tenant.status === 'À jour' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {tenant.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tenants;
