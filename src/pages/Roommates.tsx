
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

const roommates = [
  {
    id: 1,
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '06 15 25 35 45',
    property: 'Colocation Rue Saint-Martin',
    room: 'Chambre A',
    rentShare: '450€',
    status: 'Actif',
    mainTenant: 'Marie Dubois'
  },
  {
    id: 2,
    name: 'Julie Bernard',
    email: 'julie.bernard@email.com',
    phone: '06 25 35 45 55',
    property: 'Colocation Rue Saint-Martin',
    room: 'Chambre B',
    rentShare: '500€',
    status: 'Actif',
    mainTenant: 'Marie Dubois'
  },
  {
    id: 3,
    name: 'Thomas Moreau',
    email: 'thomas.moreau@email.com',
    phone: '06 35 45 55 65',
    property: 'Colocation Avenue Parmentier',
    room: 'Chambre C',
    rentShare: '420€',
    status: 'Sortant',
    mainTenant: 'Jean Martin'
  }
];

const Roommates = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Colocataires</h1>
            <p className="text-gray-600 mt-2">Gérez les colocataires et leurs informations</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un colocataire
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
                <TableHead>Chambre</TableHead>
                <TableHead>Part du loyer</TableHead>
                <TableHead>Locataire principal</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roommates.map((roommate) => (
                <TableRow key={roommate.id}>
                  <TableCell className="font-medium">{roommate.name}</TableCell>
                  <TableCell>{roommate.email}</TableCell>
                  <TableCell>{roommate.phone}</TableCell>
                  <TableCell>{roommate.property}</TableCell>
                  <TableCell>{roommate.room}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{roommate.rentShare}</TableCell>
                  <TableCell>{roommate.mainTenant}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={roommate.status === 'Actif' ? 'default' : 'secondary'}
                      className={roommate.status === 'Actif' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {roommate.status}
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

export default Roommates;
