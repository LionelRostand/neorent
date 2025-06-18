
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { usePaymentStatus } from './PaymentCard/usePaymentStatus';
import TenantInfo from './PaymentCard/TenantInfo';
import PropertyDetails from './PaymentCard/PropertyDetails';
import PaymentAmounts from './PaymentCard/PaymentAmounts';
import PaymentActions from './PaymentCard/PaymentActions';
import PaymentDiscrepancyAlert from './PaymentCard/PaymentDiscrepancyAlert';

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

interface RentPaymentCardProps {
  payment: Payment;
  onMarkAsPaid: (paymentId: string) => void;
  onDelete: (paymentId: string) => void;
}

const RentPaymentCard: React.FC<RentPaymentCardProps> = ({
  payment,
  onMarkAsPaid,
  onDelete
}) => {
  const statusData = usePaymentStatus(payment.status);
  
  // PRIORITÉ ABSOLUE au montant du contrat si disponible
  const expectedAmount = payment.contractRentAmount ?? payment.rentAmount;
  
  // Vérifier s'il y a une incohérence de paiement
  const hasPaymentDiscrepancy = payment.paidAmount !== undefined && 
    payment.paidAmount !== null && 
    payment.paidAmount !== expectedAmount;

  console.log(`🎯 RentPaymentCard pour ${payment.tenantName}:`, {
    rentAmount: payment.rentAmount,
    contractRentAmount: payment.contractRentAmount,
    expectedAmount,
    paidAmount: payment.paidAmount,
    hasDiscrepancy: hasPaymentDiscrepancy
  });

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${statusData.borderColor} h-full flex flex-col ${hasPaymentDiscrepancy ? 'ring-2 ring-red-200' : ''}`}>
      <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col h-full">
        {/* Header avec nom et statut */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <TenantInfo 
            tenantName={payment.tenantName} 
            tenantType={payment.tenantType} 
          />
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {statusData.icon}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2"
              onClick={() => onDelete(payment.id)}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Alerte d'incohérence de paiement */}
        <PaymentDiscrepancyAlert hasDiscrepancy={hasPaymentDiscrepancy} />

        {/* Informations du bien */}
        <PropertyDetails
          property={payment.property}
          dueDate={payment.dueDate}
          paymentDate={payment.paymentDate}
          paymentMethod={payment.paymentMethod}
        />

        {/* Montants de paiement - UTILISER LE BON MONTANT ATTENDU */}
        <PaymentAmounts
          rentAmount={expectedAmount}
          paidAmount={payment.paidAmount}
          contractRentAmount={payment.contractRentAmount}
        />

        {/* Statut de paiement */}
        <div className="mb-3 sm:mb-4">
          {statusData.badge}
        </div>
        
        {/* Actions pour les paiements non payés */}
        <PaymentActions
          status={payment.status}
          onMarkAsPaid={() => onMarkAsPaid(payment.id)}
        />
      </CardContent>
    </Card>
  );
};

export default RentPaymentCard;
