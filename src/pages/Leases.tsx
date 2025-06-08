
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

const leases = [
  {
    id: 1,
    leaseNumber: 'BL-2024-001',
    tenant: 'Marie Dubois',
    property: 'Appartement Rue des Fleurs',
    type: 'Bail résidentiel',
    duration: '12 mois',
    renewalDate: '2024-06-01',
    indexation: 'IRL 2024',
    status: 'En cours'
  },
  {
    id: 2,
    leaseNumber: 'BL-2024-002',
    tenant: 'Jean Martin',
    property: 'Villa Montparnasse',
    type: 'Bail résidentiel',
    duration: '36 mois',
    renewalDate: '2024-03-15',
    indexation: 'IRL 2024',
    status: 'En cours'
  },
  {
    id: 3,
    leaseNumber: 'BL-2023-015',
    tenant: 'Sophie Leroy',
    property: 'Bureau Centre-ville',
    type: 'Bail commercial',
    duration: '9 ans',
    renewalDate: '2032-01-10',
    indexation: 'ILC 2023',
    status: 'Résiliation demandée'
  }
];

const Leases = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Baux</h1>
            <p className="text-gray-600 mt-2">Gérez vos baux et leurs renouvellements</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau bail
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Bail</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Type de bail</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Prochaine échéance</TableHead>
                <TableHead>Indexation</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium">{lease.leaseNumber}</TableCell>
                  <TableCell>{lease.tenant}</TableCell>
                  <TableCell>{lease.property}</TableCell>
                  <TableCell>{lease.type}</TableCell>
                  <TableCell>{lease.duration}</TableCell>
                  <TableCell>{new Date(lease.renewalDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{lease.indexation}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={lease.status === 'En cours' ? 'default' : 'secondary'}
                      className={lease.status === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {lease.status}
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

export default Leases;
