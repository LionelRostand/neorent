
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, Calendar, Euro, CheckCircle, Clock } from 'lucide-react';

const RentHistory = () => {
  const rentHistory = [
    {
      id: 1,
      month: 'Décembre 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-12-01',
      paidDate: '2024-11-28',
      receiptAvailable: true
    },
    {
      id: 2,
      month: 'Novembre 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-11-01',
      paidDate: '2024-10-30',
      receiptAvailable: true
    },
    {
      id: 3,
      month: 'Octobre 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-10-01',
      paidDate: '2024-09-29',
      receiptAvailable: true
    },
    {
      id: 4,
      month: 'Septembre 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-09-01',
      paidDate: '2024-08-31',
      receiptAvailable: true
    },
    {
      id: 5,
      month: 'Août 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-08-01',
      paidDate: '2024-07-30',
      receiptAvailable: true
    },
    {
      id: 6,
      month: 'Juillet 2024',
      amount: '1,350€',
      status: 'Payé',
      dueDate: '2024-07-01',
      paidDate: '2024-06-28',
      receiptAvailable: true
    }
  ];

  const totalPaid = rentHistory.reduce((sum, rent) => {
    if (rent.status === 'Payé') {
      return sum + parseFloat(rent.amount.replace('€', '').replace(',', ''));
    }
    return sum;
  }, 0);

  const handleDownloadReceipt = (rentId: number, month: string) => {
    console.log(`Téléchargement de la quittance pour ${month}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'En attente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Résumé des Paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString('fr-FR')}€</p>
              <p className="text-sm text-gray-600">Total payé</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{rentHistory.filter(r => r.status === 'Payé').length}</p>
              <p className="text-sm text-gray-600">Loyers payés</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">1,350€</p>
              <p className="text-sm text-gray-600">Loyer mensuel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Historique des Loyers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rentHistory.map((rent) => (
              <div key={rent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(rent.status)}
                    <div>
                      <h3 className="font-semibold">{rent.month}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Échéance: {new Date(rent.dueDate).toLocaleDateString('fr-FR')}
                        {rent.paidDate && (
                          <>
                            {' • Payé le: '}
                            {new Date(rent.paidDate).toLocaleDateString('fr-FR')}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">{rent.amount}</p>
                    <Badge className={getStatusColor(rent.status)}>
                      {rent.status}
                    </Badge>
                  </div>
                  
                  {rent.receiptAvailable && rent.status === 'Payé' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadReceipt(rent.id, rent.month)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Quittance
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentHistory;
