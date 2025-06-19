
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  CheckCircle, 
  Clock,
  Receipt,
  FileText,
  Euro
} from 'lucide-react';

interface PaymentHistoryListProps {
  rentPayments: any[];
  contractData: any;
  onDownloadReceipt: (payment: any) => void;
}

const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({
  rentPayments,
  contractData,
  onDownloadReceipt
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    const className = `text-xs ${isMobile ? 'px-2 py-1' : ''}`;
    switch (status) {
      case 'Payé':
        return (
          <Badge className={`bg-green-100 text-green-800 ${className}`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('tenantSpace.history.status.paid')}
          </Badge>
        );
      case 'En attente':
        return (
          <Badge className={`bg-yellow-100 text-yellow-800 ${className}`}>
            <Clock className="h-3 w-3 mr-1" />
            {t('tenantSpace.history.status.pending')}
          </Badge>
        );
      case 'En retard':
        return (
          <Badge variant="destructive" className={className}>
            ⚠️ {t('tenantSpace.history.status.overdue')}
          </Badge>
        );
      default:
        return <Badge variant="secondary" className={className}>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Receipt className="h-4 w-4 md:h-5 md:w-5" />
          {t('tenantSpace.history.rentHistory')} {contractData ? `- ${t('tenantSpace.history.since')} ${new Date(contractData.startDate).toLocaleDateString('en-US')}` : `- ${t('tenantSpace.history.since')} September 2023`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {rentPayments.map((payment) => (
            <div key={payment.id} className={`flex flex-col ${isMobile ? 'space-y-3' : 'md:flex-row md:items-center md:justify-between'} p-3 md:p-4 border rounded-lg hover:bg-gray-50`}>
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm md:text-base">{payment.month}</h3>
                  <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center gap-4'} text-xs md:text-sm text-gray-600 mt-1`}>
                    <span>{t('tenantSpace.history.dueDate')}: {new Date(payment.dueDate).toLocaleDateString('en-US')}</span>
                    {payment.paymentDate && (
                      <span>{t('tenantSpace.history.paidOn')}: {new Date(payment.paymentDate).toLocaleDateString('en-US')}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
                <div className={`${isMobile ? 'flex justify-between items-center' : 'text-right'}`}>
                  <div>
                    {/* Montant versé - Affiché en priorité pour les paiements effectués */}
                    {payment.status === 'Payé' && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1 justify-end">
                          <Euro className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">{t('tenantSpace.history.amountPaid')}</span>
                        </div>
                        <p className="font-bold text-base md:text-lg text-green-600">{payment.amount}€</p>
                      </div>
                    )}
                    
                    {/* Montant à payer - Pour les paiements en attente */}
                    {payment.status !== 'Payé' && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">{t('tenantSpace.history.amountToPay')}</span>
                        <p className="font-semibold text-sm md:text-base text-gray-900">{payment.amount}€</p>
                      </div>
                    )}
                    
                    {/* Détail loyer + charges */}
                    <p className="text-xs md:text-sm text-gray-600">
                      {t('tenantSpace.history.rent')}: {payment.rent}€ + {t('tenantSpace.history.charges')}: {payment.charges}€
                    </p>
                  </div>
                </div>
                
                <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center gap-3'}`}>
                  {getStatusBadge(payment.status)}
                  
                  {payment.status === 'Payé' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={isMobile ? 'text-xs px-3 py-1' : ''}
                      onClick={() => onDownloadReceipt(payment)}
                    >
                      <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      {t('tenantSpace.history.receiptPdf')}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className={isMobile ? 'text-xs px-3 py-1' : ''}>
                      {t('tenantSpace.history.notAvailable')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryList;
