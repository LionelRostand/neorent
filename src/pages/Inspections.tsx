
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

const inspections = [
  {
    id: 1,
    inspectionNumber: 'EDL-2024-001',
    property: 'Appartement Rue des Fleurs',
    tenant: 'Marie Dubois',
    type: 'État des lieux d\'entrée',
    date: '2023-06-01',
    inspector: 'Pierre Inspection',
    status: 'Terminé',
    issues: 0
  },
  {
    id: 2,
    inspectionNumber: 'EDL-2024-002',
    property: 'Villa Montparnasse',
    tenant: 'Jean Martin',
    type: 'État des lieux de sortie',
    date: '2024-01-15',
    inspector: 'Marie Contrôle',
    status: 'En cours',
    issues: 2
  },
  {
    id: 3,
    inspectionNumber: 'EDL-2024-003',
    property: 'Studio République',
    tenant: 'Sophie Leroy',
    type: 'Inspection périodique',
    date: '2024-01-20',
    inspector: 'Jean Vérif',
    status: 'Planifié',
    issues: null
  }
];

const Inspections = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">État des lieux</h1>
            <p className="text-gray-600 mt-2">Gérez les états des lieux et inspections</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel état des lieux
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° État des lieux</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inspecteur</TableHead>
                <TableHead>Problèmes détectés</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.inspectionNumber}</TableCell>
                  <TableCell>{inspection.property}</TableCell>
                  <TableCell>{inspection.tenant}</TableCell>
                  <TableCell>{inspection.type}</TableCell>
                  <TableCell>{new Date(inspection.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    {inspection.issues !== null ? (
                      <span className={inspection.issues > 0 ? 'text-orange-600' : 'text-green-600'}>
                        {inspection.issues} problème{inspection.issues > 1 ? 's' : ''}
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={inspection.status === 'Terminé' ? 'default' : inspection.status === 'En cours' ? 'secondary' : 'outline'}
                      className={
                        inspection.status === 'Terminé' ? 'bg-green-100 text-green-800' : 
                        inspection.status === 'En cours' ? 'bg-blue-100 text-blue-800' : ''
                      }
                    >
                      {inspection.status}
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

export default Inspections;
