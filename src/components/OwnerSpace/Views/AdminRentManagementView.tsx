
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle, Edit, Trash2, Eye, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';
import { useToast } from '@/hooks/use-toast';
import SimpleRentPaymentForm from '@/components/RentPaymentForm/SimpleRentPaymentForm';

interface AdminRentManagementViewProps {
  currentProfile: any;
}

const AdminRentManagementView: React.FC<AdminRentManagementViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { payments } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const { pendingValidations, validatePayment } = usePaymentValidation();
  const { toast } = useToast();
  const profile = currentProfile || userProfile;
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'Payé').length;
  const latePayments = payments.filter(p => p.status === 'En retard').length;
  const pendingValidationsCount = pendingValidations.length;
  const { roommates } = useOwnerData(currentProfile);
  const monthlyRevenue = roommates?.filter(r => r.status === 'Actif').reduce((sum, r) => sum + (parseFloat(r.rentAmount) || 0), 0) || 0;

  const handlePaymentSubmit = async (paymentData: any) => {
    console.log('Payment data:', paymentData);
    setShowPaymentForm(false);
  };

  const handleValidatePayment = async (paymentId: string, decision: 'validated' | 'rejected') => {
    try {
      await validatePayment(paymentId, decision);
      toast({
        title: decision === 'validated' ? 'Paiement validé' : 'Paiement rejeté',
        description: decision === 'validated' ? 
          'Le paiement a été validé et la quittance sera disponible pour le locataire.' :
          'Le paiement a été rejeté.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la validation.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'default';
      case 'En retard':
        return 'destructive';
      case 'En attente':
        return 'secondary';
      case 'En attente de validation':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Loyers</h1>
            <p className="text-emerald-100 mt-2">Suivez vos paiements de loyer</p>
          </div>
          <Button 
            className="bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-md"
            onClick={() => setShowPaymentForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus Mensuels</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">Revenus perçus</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paiements Reçus</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{paidPayments}</div>
            <p className="text-xs text-gray-500 mt-1">{paidPayments} paiements validés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Attente de Validation</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingValidationsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Virements à valider</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paiements en Retard</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{latePayments}</div>
            <p className="text-xs text-gray-500 mt-1">{latePayments} en attente</p>
          </CardContent>
        </Card>
      </div>

      {/* Paiements en attente de validation */}
      {pendingValidations.length > 0 && (
        <Card className="shadow-lg border-0 border-l-4 border-l-yellow-500">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-white border-b">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Virements en attente de validation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {pendingValidations.map((payment) => (
                <div key={payment.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{payment.tenantName}</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {payment.tenantType}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Propriété:</strong> {payment.property}</p>
                        <p><strong>Montant:</strong> {payment.amount}€</p>
                        <p><strong>Date du virement:</strong> {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</p>
                        {payment.notes && (
                          <p><strong>Référence:</strong> {payment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidatePayment(payment.id, 'rejected')}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleValidatePayment(payment.id, 'validated')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Historique des Paiements</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {payments.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun paiement trouvé</h3>
              <p className="text-gray-500 mb-4">Les paiements apparaîtront ici</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un paiement
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead>Montant payé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.property}</TableCell>
                    <TableCell>{payment.tenantName}</TableCell>
                    <TableCell>{payment.rentAmount}€</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paidAmount || 0}€</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
  );
};

export default AdminRentManagementView;
