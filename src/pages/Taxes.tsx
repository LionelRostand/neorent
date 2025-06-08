
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

const taxDeclarations = [
  {
    id: 1,
    year: '2023',
    property: 'Appartement Rue des Fleurs',
    type: 'Revenus fonciers',
    grossIncome: '14,400€',
    deductions: '2,100€',
    netIncome: '12,300€',
    status: 'Déclarée',
    dueDate: '2024-05-31'
  },
  {
    id: 2,
    year: '2023',
    property: 'Villa Montparnasse',
    type: 'Revenus fonciers',
    grossIncome: '30,000€',
    deductions: '4,500€',
    netIncome: '25,500€',
    status: 'Déclarée',
    dueDate: '2024-05-31'
  },
  {
    id: 3,
    year: '2024',
    property: 'Studio République',
    type: 'Revenus fonciers',
    grossIncome: '9,600€',
    deductions: '1,200€',
    netIncome: '8,400€',
    status: 'En cours',
    dueDate: '2025-05-31'
  },
  {
    id: 4,
    year: '2023',
    property: 'Bureau Centre-ville',
    type: 'BIC',
    grossIncome: '18,000€',
    deductions: '3,600€',
    netIncome: '14,400€',
    status: 'À déclarer',
    dueDate: '2024-05-31'
  }
];

const Taxes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fiscalités</h1>
            <p className="text-gray-600 mt-2">Gérez vos déclarations fiscales et revenus fonciers</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle déclaration
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Type de revenus</TableHead>
                <TableHead>Revenus bruts</TableHead>
                <TableHead>Déductions</TableHead>
                <TableHead>Revenus nets</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxDeclarations.map((declaration) => (
                <TableRow key={declaration.id}>
                  <TableCell className="font-medium">{declaration.year}</TableCell>
                  <TableCell>{declaration.property}</TableCell>
                  <TableCell>{declaration.type}</TableCell>
                  <TableCell className="font-semibold text-blue-600">{declaration.grossIncome}</TableCell>
                  <TableCell className="text-red-600">{declaration.deductions}</TableCell>
                  <TableCell className="font-semibold text-green-600">{declaration.netIncome}</TableCell>
                  <TableCell>{new Date(declaration.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        declaration.status === 'Déclarée' ? 'default' : 
                        declaration.status === 'En cours' ? 'secondary' : 'destructive'
                      }
                      className={
                        declaration.status === 'Déclarée' ? 'bg-green-100 text-green-800' : 
                        declaration.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {declaration.status}
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

export default Taxes;
