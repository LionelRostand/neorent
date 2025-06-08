
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Euro,
  Receipt,
  TrendingUp
} from 'lucide-react';

const RentHistory = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  
  const rentPayments = [
    {
      id: 1,
      month: 'Janvier 2024',
      amount: 1350,
      rent: 1200,
      charges: 150,
      paymentDate: '2024-01-05',
      dueDate: '2024-01-01',
      status: 'Payé',
      method: 'Virement',
      receiptUrl: '#'
    },
    {
      id: 2,
      month: 'Février 2024',
      amount: 1350,
      rent: 1200,
      charges: 150,
      paymentDate: '2024-02-03',
      dueDate: '2024-02-01',
      status: 'Payé',
      method: 'Virement',
      receiptUrl: '#'
    },
    {
      id: 3,
      month: 'Mars 2024',
      amount: 1350,
      rent: 1200,
      charges: 150,
      paymentDate: '2024-03-01',
      dueDate: '2024-03-01',
      status: 'Payé',
      method: 'Virement',
      receiptUrl: '#'
    },
    {
      id: 4,
      month: 'Avril 2024',
      amount: 1350,
      rent: 1200,
      charges: 150,
      paymentDate: null,
      dueDate: '2024-04-01',
      status: 'En attente',
      method: null,
      receiptUrl: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'En attente':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'En retard':
        return (
          <Badge variant="destructive">
            ⚠️ {status}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPaid = rentPayments.filter(p => p.status === 'Payé').reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = rentPayments.filter(p => p.status === 'Payé').length;

  return (
    <div className="space-y-6">
      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total payé en 2024</p>
                <p className="text-2xl font-bold text-green-600">{totalPaid}€</p>
              </div>
              <Euro className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paiements effectués</p>
                <p className="text-2xl font-bold text-blue-600">{paidPayments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Loyer mensuel</p>
                <p className="text-2xl font-bold text-purple-600">1,200€</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Charges mensuelles</p>
                <p className="text-2xl font-bold text-orange-600">150€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Historique des loyers - {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{payment.month}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                      {payment.paymentDate && (
                        <span>Payé le: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount}€</p>
                    <p className="text-sm text-gray-600">
                      Loyer: {payment.rent}€ + Charges: {payment.charges}€
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(payment.status)}
                    
                    {payment.receiptUrl ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Quittance
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Non disponible
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations de paiement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Informations de paiement</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Modalités de paiement</h4>
              <ul className="space-y-1 text-sm">
                <li>• Loyer mensuel: 1,200€</li>
                <li>• Charges mensuelles: 150€</li>
                <li>• Total mensuel: 1,350€</li>
                <li>• Échéance: 1er de chaque mois</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Moyens de paiement acceptés</h4>
              <ul className="space-y-1 text-sm">
                <li>• Virement bancaire (recommandé)</li>
                <li>• Chèque</li>
                <li>• Prélèvement automatique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentHistory;
