
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'default';
      case 'En retard':
        return 'destructive';
      case 'En attente':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* Header - responsive */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{t('rentManagement.title')}</h1>
            <p className="text-emerald-100 mt-1 sm:mt-2 text-sm sm:text-base">{t('rentManagement.subtitle')}</p>
          </div>
          <Button 
            className="bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-md w-full sm:w-auto text-sm sm:text-base"
            onClick={() => setShowPaymentForm(true)}
          >
            <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{t('rentManagement.newPayment')}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Grid - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('rentManagement.monthlyRevenue')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">{t('rentManagement.received')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('rentManagement.receivedPayments')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{paidPayments}</div>
            <p className="text-xs text-gray-500 mt-1">{paidPayments} {t('rentManagement.paymentsValidated')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('rentManagement.latePayments')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{latePayments}</div>
            <p className="text-xs text-gray-500 mt-1">{latePayments} {t('rentManagement.paymentsPending')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('rentManagement.collectionRate')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('rentManagement.paymentsUpToDate')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table - responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b px-3 sm:px-6 py-3 sm:py-6">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{t('rentManagement.paymentHistory')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-3 lg:p-6">
          {payments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200 mx-3 sm:mx-0">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{t('rentManagement.noPayments')}</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">{t('rentManagement.paymentsWillAppear')}</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base">
                <Plus className="h-4 w-4 mr-2" />
                {t('rentManagement.addPayment')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">{t('rentManagement.property')}</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">{t('rentManagement.tenant')}</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">{t('rentManagement.amount')}</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">{t('rentManagement.dueDate')}</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">{t('rentManagement.paidAmount')}</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">{t('rentManagement.status')}</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm px-2 sm:px-4">{t('rentManagement.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">{payment.property}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{payment.tenantName}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{payment.rentAmount}€</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">{payment.dueDate}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell">{payment.paidAmount || 0}€</TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <Badge variant={getStatusBadgeVariant(payment.status)} className="text-xs">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 hidden sm:inline-flex">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 hidden sm:inline-flex">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="w-[95vw] max-w-[650px] max-h-[95vh] overflow-y-auto p-3 sm:p-4 lg:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{t('rentManagement.newPayment')}</DialogTitle>
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
