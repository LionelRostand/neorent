
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const monthlyData = [
  { month: 'Jan', revenus: 4200, depenses: 800 },
  { month: 'Fév', revenus: 4800, depenses: 1200 },
  { month: 'Mar', revenus: 4500, depenses: 900 },
  { month: 'Avr', revenus: 5200, depenses: 1100 },
  { month: 'Mai', revenus: 4900, depenses: 850 },
  { month: 'Jun', revenus: 5400, depenses: 950 },
];

const expenseData = [
  { name: 'Maintenance', value: 2400, color: '#ff6b6b' },
  { name: 'Assurance', value: 1200, color: '#4ecdc4' },
  { name: 'Taxes', value: 800, color: '#45b7d1' },
  { name: 'Frais de gestion', value: 600, color: '#96ceb4' },
];

const transactions = [
  {
    id: 1,
    date: '2023-12-28',
    description: 'Loyer - Appartement Rue des Fleurs',
    property: 'Appartement Rue des Fleurs',
    category: 'Loyer',
    amount: 1200,
    type: 'Revenu'
  },
  {
    id: 2,
    date: '2023-12-27',
    description: 'Réparation plomberie',
    property: 'Villa Montparnasse',
    category: 'Maintenance',
    amount: -350,
    type: 'Dépense'
  },
  {
    id: 3,
    date: '2023-12-25',
    description: 'Loyer - Villa Montparnasse',
    property: 'Villa Montparnasse',
    category: 'Loyer',
    amount: 2500,
    type: 'Revenu'
  },
  {
    id: 4,
    date: '2023-12-20',
    description: 'Assurance habitation',
    property: 'Studio République',
    category: 'Assurance',
    amount: -120,
    type: 'Dépense'
  }
];

const Finances = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
            <p className="text-gray-600 mt-2">Suivi des revenus et dépenses</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter transaction
          </Button>
        </div>

        {/* Résumé financier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">5,400€</p>
                  <p className="text-sm text-green-600 mt-1">+12% vs mois dernier</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dépenses ce mois</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">950€</p>
                  <p className="text-sm text-red-600 mt-1">-8% vs mois dernier</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bénéfice net</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">4,450€</p>
                  <p className="text-sm text-blue-600 mt-1">+18% vs mois dernier</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bien</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>{transaction.property}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'Revenu' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenus vs Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}€`]} />
                    <Bar dataKey="revenus" fill="#10b981" name="Revenus" />
                    <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}€`}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}€`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Finances;
