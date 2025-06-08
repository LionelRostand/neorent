
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

const properties = [
  {
    id: 1,
    title: 'Appartement Rue des Fleurs',
    address: '123 Rue des Fleurs, 75001 Paris',
    type: 'Appartement',
    surface: '65m²',
    rent: '1,200€',
    status: 'Occupé',
    tenant: 'Marie Dubois'
  },
  {
    id: 2,
    title: 'Studio Centre-ville',
    address: '45 Avenue de la République, 75011 Paris',
    type: 'Studio',
    surface: '30m²',
    rent: '800€',
    status: 'Libre',
    tenant: null
  },
  {
    id: 3,
    title: 'Villa Montparnasse',
    address: '78 Boulevard Montparnasse, 75014 Paris',
    type: 'Maison',
    surface: '120m²',
    rent: '2,500€',
    status: 'Occupé',
    tenant: 'Jean Martin'
  }
];

const Properties = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biens Immobiliers</h1>
            <p className="text-gray-600 mt-2">Gérez votre portefeuille immobilier</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du bien</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Surface</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Locataire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.surface}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{property.rent}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={property.status === 'Occupé' ? 'default' : 'secondary'}
                      className={property.status === 'Occupé' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.tenant || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
