
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign, History, CreditCard, Banknote, Wallet, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const [showBankTransferForm, setShowBankTransferForm] = React.useState(false);

  const handleQuickPayment = (method: string) => {
    console.log('Méthode de paiement sélectionnée:', method);
    
    if (method === 'virement') {
      console.log('Affichage du formulaire de virement bancaire');
      setPaymentMethod('virement');
      setPaidAmount(totalAmount.toString());
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setShowBankTransferForm(true);
    } else {
      console.log('Affichage du formulaire de paiement classique');
      setPaymentMethod(method);
      setPaidAmount(totalAmount.toString());
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setShowPaymentForm(true);
    }
  };

  const handleBankTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Soumission du virement bancaire');
    // Préparer les données pour le virement bancaire
    setPaymentMethod('virement');
    onSubmit(e);
  };

  const handleHistoryClick = () => {
    console.log('Clic sur historique des paiements');
    // Pour l'instant, on ferme juste le dialog
    // TODO: Implémenter la navigation vers l'historique
    onOpenChange(false);
  };

  if (showBankTransferForm) {
    return (
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Déclaration de virement bancaire
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Information importante</h4>
                <p className="text-sm text-yellow-700">
                  Vous déclarez avoir effectué un virement bancaire. Le bailleur recevra une notification 
                  et validera le paiement dès réception des fonds. Votre quittance sera disponible après validation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Détails du paiement</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{actualTenantType}:</span>
                <span className="font-medium">{actualTenantName}</span>
              </div>
              <div className="flex justify-between">
                <span>Propriété:</span>
                <span className="font-medium">{propertyTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant attendu:</span>
                <span className="font-bold text-green-600">{totalAmount}€</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleBankTransferSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date du virement *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidAmount">Montant viré *</Label>
              <Input
                id="paidAmount"
                type="number"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Montant en euros"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Référence du virement (optionnel)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Référence bancaire, numéro de transaction..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBankTransferForm(false);
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !paymentDate || !paidAmount}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Déclaration...' : 'Déclarer le virement'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    );
  }

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
            onClick={handleHistoryClick}
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
                <p className="text-sm text-gray-600 mt-1">Déclarer un virement bancaire effectué</p>
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
