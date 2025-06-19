
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Clock, FileText, DollarSign } from 'lucide-react';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  contractRentAmount?: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface NewRentPaymentCardProps {
  payment: Payment;
  onMarkAsPaid: (paymentId: string) => void;
  onDelete: (paymentId: string) => void;
}

const NewRentPaymentCard: React.FC<NewRentPaymentCardProps> = ({
  payment,
  onMarkAsPaid,
  onDelete
}) => {
  const { t } = useTranslation();
  const contractAmount = payment.contractRentAmount || payment.rentAmount;
  
  const getStatusConfig = () => {
    switch (payment.status) {
      case 'Payé':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          textColor: 'text-green-800',
          label: t('rentManagement.paid')
        };
      case 'En retard':
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-800',
          label: t('rentManagement.late')
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          textColor: 'text-yellow-800',
          label: t('rentManagement.pending')
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${statusConfig.borderColor}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{payment.tenantName}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {payment.tenantType === 'Colocataire' ? t('rentManagement.roommate') : t('rentManagement.tenant')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {statusConfig.icon}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
              onClick={() => onDelete(payment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Property */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span>{payment.property}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('rentManagement.dueDate')}: {payment.dueDate}
          </div>
        </div>

        {/* Contract amount */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">{t('rentManagement.contractRent')}</span>
                <p className="text-xs text-gray-500">{t('rentManagement.accordingToContract')}</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">{contractAmount}€</span>
          </div>
        </div>

        {/* Paid amount if applicable */}
        {payment.paidAmount !== undefined && payment.paidAmount !== null && (
          <div className={`rounded-lg p-4 mb-4 ${
            payment.paidAmount === contractAmount ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t('rentManagement.amountPaid')}</span>
              <span className={`text-2xl font-bold ${
                payment.paidAmount === contractAmount ? 'text-green-600' : 'text-red-600'
              }`}>
                {payment.paidAmount}€
              </span>
            </div>
          </div>
        )}

        {/* Status */}
        <div className={`rounded-lg p-3 mb-4 ${statusConfig.bgColor}`}>
          <div className="flex items-center justify-center">
            {statusConfig.icon}
            <span className={`ml-2 font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        {payment.status !== 'Payé' && (
          <Button
            onClick={() => onMarkAsPaid(payment.id)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('rentManagement.markAsPaidButton')}
          </Button>
        )}

        {/* Payment details if paid */}
        {payment.status === 'Payé' && payment.paymentDate && (
          <div className="text-xs text-gray-500 text-center">
            {t('rentManagement.paymentDate')}: {payment.paymentDate}
            {payment.paymentMethod && ` - ${payment.paymentMethod}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewRentPaymentCard;
