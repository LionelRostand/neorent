
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import SimpleRentPaymentForm from '@/components/RentPaymentForm/SimpleRentPaymentForm';

interface AdminRentManagementViewProps {
  currentProfile: any;
}

const AdminRentManagementView: React.FC<AdminRentManagementViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { payments } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'Payé').length;
  const latePayments = payments.filter(p => p.status === 'En retard').length;
  const monthlyRevenue = payments
    .filter(p => p.status === 'Payé')
    .reduce((sum, p) => sum + (parseFloat(p.rentAmount?.toString() || '0') || 0), 0);

  const handlePaymentSubmit = async (paymentData: any) => {
    console.log('Payment data:', paymentData);
    setShowPaymentForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Loyers</h1>
            <p className="text-gray-600 mt-1">Suivez vos paiements de loyer</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowPaymentForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}€</div>
              <p className="text-xs text-muted-foreground">Revenus perçus</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements Reçus</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidPayments}</div>
              <p className="text-xs text-muted-foreground">{paidPayments} paiements validés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Retard</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latePayments}</div>
              <p className="text-xs text-muted-foreground">{latePayments} en attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Recouvrement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Paiements à jour</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun paiement trouvé</p>
                <p className="text-sm text-gray-400">Les paiements apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{payment.property}</h3>
                        <p className="text-sm text-gray-600">Locataire: {payment.tenantName}</p>
                        <p className="text-sm text-gray-500">Date: {payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{payment.rentAmount}€</p>
                      <Badge 
                        variant={
                          payment.status === 'Payé' ? 'default' :
                          payment.status === 'En retard' ? 'destructive' : 'secondary'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="w-[95vw] max-w-[650px] max-h-[95vh] overflow-y-auto p-3 sm:p-4 lg:p-6">
            <DialogHeader>
              <DialogTitle>Nouveau Paiement</DialogTitle>
            </DialogHeader>
            <SimpleRentPaymentForm 
              onClose={() => setShowPaymentForm(false)}
              onSubmit={handlePaymentSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminRentManagementView;
