
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Euro, CreditCard } from 'lucide-react';
import PaymentValidation from './PaymentValidation';
import PaymentInfoBanner from './PaymentInfoBanner';

interface PaymentFormProps {
  paymentDate: string;
  setPaymentDate: (date: string) => void;
  paidAmount: string;
  setPaidAmount: (amount: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  totalAmount: number;
  loading: boolean;
  isFormValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentDate,
  setPaymentDate,
  paidAmount,
  setPaidAmount,
  paymentMethod,
  setPaymentMethod,
  notes,
  setNotes,
  totalAmount,
  loading,
  isFormValid,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();
  const paidAmountNum = parseFloat(paidAmount) || 0;
  const hasDiscrepancy = paidAmount && paidAmountNum !== totalAmount && paidAmountNum > 0;
  const isFullPayment = paidAmountNum === totalAmount;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="paymentDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('tenantSpace.payment.paymentDate')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="paidAmount" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            {t('tenantSpace.payment.amountToPay')} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="paidAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder={totalAmount.toString()}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className={`mt-1 pr-8 ${
                hasDiscrepancy 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : isFullPayment
                  ? 'border-green-300 focus:border-green-500 bg-green-50'
                  : ''
              }`}
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
          </div>
          
          <PaymentValidation 
            paidAmount={paidAmount}
            totalAmount={totalAmount}
            isFormValid={isFormValid}
          />
        </div>

        <div>
          <Label htmlFor="paymentMethod" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t('tenantSpace.payment.paymentMethod')} <span className="text-red-500">*</span>
          </Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t('tenantSpace.payment.paymentMethod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="virement">{t('tenantSpace.payment.bankTransfer')}</SelectItem>
              <SelectItem value="cheque">{t('tenantSpace.payment.check')}</SelectItem>
              <SelectItem value="especes">{t('tenantSpace.payment.cash')}</SelectItem>
              <SelectItem value="carte">{t('tenantSpace.payment.card')}</SelectItem>
              <SelectItem value="prelevement">{t('tenantSpace.payment.automaticDebit')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">{t('tenantSpace.payment.paymentNotes')} ({t('tenantSpace.payment.optional')})</Label>
          <Input
            id="notes"
            placeholder={t('tenantSpace.payment.paymentNotes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <PaymentInfoBanner isFullPayment={isFullPayment} />

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          {t('tenantSpace.payment.cancel')}
        </Button>
        <Button 
          type="submit" 
          className={`${
            isFormValid 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={loading || !isFormValid}
        >
          {loading ? t('tenantSpace.payment.processing') : t('tenantSpace.payment.confirmPayment')}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
