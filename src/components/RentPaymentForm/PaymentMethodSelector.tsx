
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, DollarSign, Smartphone, Wallet } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  onPaymentMethodChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 sm:space-y-3">
      <Label htmlFor="paymentMethod" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
        <span className="truncate">{t('rentManagement.paymentMethod')}</span>
        <span className="text-red-500">*</span>
      </Label>
      <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <SelectTrigger className="h-10 sm:h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors text-sm sm:text-base">
          <SelectValue placeholder={t('rentManagement.selectPaymentMethod')} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem value="virement" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{t('rentManagement.bankTransfer')}</span>
            </div>
          </SelectItem>
          <SelectItem value="cheque" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{t('rentManagement.check')}</span>
            </div>
          </SelectItem>
          <SelectItem value="especes" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{t('rentManagement.cash')}</span>
            </div>
          </SelectItem>
          <SelectItem value="carte" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{t('rentManagement.creditCard')}</span>
            </div>
          </SelectItem>
          <SelectItem value="prelevement" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{t('rentManagement.automaticDebit')}</span>
            </div>
          </SelectItem>
          <SelectItem value="paypal" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">PayPal</span>
            </div>
          </SelectItem>
          <SelectItem value="apple_pay" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Apple Pay</span>
            </div>
          </SelectItem>
          <SelectItem value="google_pay" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Google Pay</span>
            </div>
          </SelectItem>
          <SelectItem value="revolut" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Revolut</span>
            </div>
          </SelectItem>
          <SelectItem value="n26" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">N26</span>
            </div>
          </SelectItem>
          <SelectItem value="lydia" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Lydia</span>
            </div>
          </SelectItem>
          <SelectItem value="orange_money" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Orange Money</span>
            </div>
          </SelectItem>
          <SelectItem value="mtn_money" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">MTN Money</span>
            </div>
          </SelectItem>
          <SelectItem value="moov_money" className="py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Moov Money</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentMethodSelector;
