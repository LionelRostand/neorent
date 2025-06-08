
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

const contracts = [
  {
    id: 1,
    contractNumber: 'CT-2024-001',
    tenant: 'Marie Dubois',
    property: 'Appartement Rue des Fleurs',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    monthlyRent: '1,200€',
    deposit: '2,400€',
    status: 'Actif'
  },
  {
    id: 2,
    contractNumber: 'CT-2024-002',
    tenant: 'Jean Martin',
    property: 'Villa Montparnasse',
    startDate: '2023-03-15',
    endDate: '2024-03-15',
    monthlyRent: '2,500€',
    deposit: '5,000€',
    status: 'Actif'
  },
  {
    id: 3,
    contractNumber: 'CT-2023-015',
    tenant: 'Sophie Leroy',
    property: 'Studio République',
    startDate: '2023-01-10',
    endDate: '2024-01-10',
    monthlyRent: '800€',
    deposit: '1,600€',
    status: 'Expiré'
  }
];

const Contracts = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contrats</h1>
            <p className="text-gray-600 mt-2">Gérez vos contrats de location</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau contrat
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Contrat</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Loyer mensuel</TableHead>
                <TableHead>Dépôt de garantie</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                  <TableCell>{contract.tenant}</TableCell>
                  <TableCell>{contract.property}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{contract.monthlyRent}</TableCell>
                  <TableCell>{contract.deposit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={contract.status === 'Actif' ? 'default' : 'secondary'}
                      className={contract.status === 'Actif' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {contract.status}
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

export default Contracts;
