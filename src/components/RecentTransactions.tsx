
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const recentTransactions = [
  {
    id: 1,
    type: 'Revenu',
    description: 'Loyer - Appartement Rue des Fleurs',
    amount: 1200,
    date: '2023-12-28',
    property: 'Appartement Rue des Fleurs'
  },
  {
    id: 2,
    type: 'Dépense',
    description: 'Réparation plomberie',
    amount: -350,
    date: '2023-12-27',
    property: 'Villa Montparnasse'
  },
  {
    id: 3,
    type: 'Revenu',
    description: 'Loyer - Villa Montparnasse',
    amount: 2500,
    date: '2023-12-25',
    property: 'Villa Montparnasse'
  }
];

const RecentTransactions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.amount > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.property}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}€
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(transaction.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
