
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign } from 'lucide-react';
import PaymentForm from './PaymentForm';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actualTenantName: string;
  actualTenantType: 'Locataire' | 'Colocataire';
  propertyTitle: string;
  totalAmount: number;
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  paidAmount: string;
  setPaidAmount: (amount: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  loading: boolean;
  isFormValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  actualTenantName,
  actualTenantType,
  propertyTitle,
  totalAmount,
  paymentDate,
  setPaymentDate,
  paidAmount,
  setPaidAmount,
  paymentMethod,
  setPaymentMethod,
  notes,
  setNotes,
  loading,
  isFormValid,
  onSubmit,
  onOpenChange
}) => {
  const { t } = useTranslation();

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          {t('tenantSpace.payment.title')}
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh] pr-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">{t('tenantSpace.payment.paymentDetails')}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{actualTenantType}:</span>
              <span className="font-medium">{actualTenantName}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('tenantSpace.payment.property')}:</span>
              <span className="font-medium">{propertyTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('tenantSpace.payment.totalAmount')}:</span>
              <span className="font-bold text-green-600">{totalAmount}€</span>
            </div>
          </div>
        </div>

        <PaymentForm
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          notes={notes}
          setNotes={setNotes}
          totalAmount={totalAmount}
          loading={loading}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </ScrollArea>
    </DialogContent>
  );
};

export default PaymentDialog;
