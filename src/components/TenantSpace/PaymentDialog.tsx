
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign, History, CreditCard, Banknote, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);

  const handleQuickPayment = (method: string) => {
    setPaymentMethod(method);
    setPaidAmount(totalAmount.toString());
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setShowPaymentForm(true);
  };

  if (showPaymentForm) {
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
            onCancel={() => {
              setShowPaymentForm(false);
              onOpenChange(false);
            }}
          />
        </ScrollArea>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Options de paiement
        </DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh] pr-4">
        <div className="space-y-4">
          {/* Historique des paiements */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50"
            onClick={() => {
              // Navigate to payment history
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3 w-full">
              <History className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Historique des paiements</h3>
                <p className="text-sm text-gray-600 mt-1">Consulter l'historique des paiements</p>
              </div>
            </div>
          </Button>

          {/* Virement bancaire */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50 border-blue-200"
            onClick={() => handleQuickPayment('virement')}
          >
            <div className="flex items-center gap-3 w-full">
              <CreditCard className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Virement bancaire</h3>
                <p className="text-sm text-gray-600 mt-1">Effectuer un virement bancaire</p>
              </div>
            </div>
          </Button>

          {/* Paiement en espèces */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-green-50 border-green-200"
            onClick={() => handleQuickPayment('especes')}
          >
            <div className="flex items-center gap-3 w-full">
              <Banknote className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Paiement en espèces</h3>
                <p className="text-sm text-gray-600 mt-1">Déclarer un paiement en espèces</p>
              </div>
            </div>
          </Button>

          {/* Paiement en ligne */}
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-purple-50 border-purple-200"
            onClick={() => handleQuickPayment('carte')}
          >
            <div className="flex items-center gap-3 w-full">
              <Wallet className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Paiement en ligne</h3>
                <p className="text-sm text-gray-600 mt-1">Payer en ligne par carte</p>
              </div>
            </div>
          </Button>
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default PaymentDialog;
