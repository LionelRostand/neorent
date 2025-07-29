import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, History, Banknote, Smartphone } from 'lucide-react';

interface PaymentOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCashPayment: () => void;
  onSelectBankTransfer: () => void;
  onSelectOnlinePayment: () => void;
  onSelectHistory: () => void;
}

const PaymentOptionsModal = ({ 
  open, 
  onOpenChange, 
  onSelectCashPayment,
  onSelectBankTransfer,
  onSelectOnlinePayment,
  onSelectHistory
}: PaymentOptionsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Options de paiement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Historique des paiements */}
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto"
            onClick={() => {
              onSelectHistory();
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Historique des paiements</div>
                <div className="text-sm text-gray-500">Consulter l'historique des paiements</div>
              </div>
            </div>
          </Button>

          {/* Virement bancaire */}
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto border-blue-200 hover:bg-blue-50"
            onClick={() => {
              onSelectBankTransfer();
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Virement bancaire</div>
                <div className="text-sm text-gray-500">Déclarer un virement bancaire effectué</div>
              </div>
            </div>
          </Button>

          {/* Paiement en espèces */}
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto border-green-200 hover:bg-green-50"
            onClick={() => {
              console.log('🔥 Paiement en espèces cliqué');
              onSelectCashPayment();
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Paiement en espèces</div>
                <div className="text-sm text-gray-500">Déclarer un paiement en espèces</div>
              </div>
            </div>
          </Button>

          {/* Paiement en ligne */}
          <Button
            variant="outline"
            className="w-full justify-start p-4 h-auto border-purple-200 hover:bg-purple-50"
            onClick={() => {
              onSelectOnlinePayment();
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Smartphone className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Paiement en ligne</div>
                <div className="text-sm text-gray-500">Payer en ligne par carte</div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentOptionsModal;