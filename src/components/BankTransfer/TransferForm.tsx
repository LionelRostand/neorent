
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpCircle, Euro } from 'lucide-react';
import { BankTransfer } from '@/types/bankTransfer';

interface TransferFormProps {
  wallets: Array<{ id: string; userId: string; currency: string; balance: number }>;
  bankAccounts: Array<{ id: string; iban: string; accountHolder: string }>;
  onSubmit: (transferData: Omit<BankTransfer, 'id' | 'status' | 'createdAt'>) => void;
  loading?: boolean;
}

const TransferForm: React.FC<TransferFormProps> = ({
  wallets,
  bankAccounts,
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    walletId: '',
    amount: '',
    bankAccountId: '',
    tag: ''
  });

  const selectedWallet = wallets.find(w => w.id === formData.walletId);
  const amountInCents = formData.amount ? parseFloat(formData.amount) * 100 : 0;
  const insufficientFunds = selectedWallet && amountInCents > selectedWallet.balance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.walletId || !formData.amount || !formData.bankAccountId || !formData.tag) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (insufficientFunds) {
      toast({
        title: "Fonds insuffisants",
        description: "Le portefeuille ne dispose pas de suffisamment de fonds",
        variant: "destructive",
      });
      return;
    }

    const transferData = {
      walletId: formData.walletId,
      amount: amountInCents,
      bankAccountId: formData.bankAccountId,
      tag: formData.tag
    };

    onSubmit(transferData);
    
    // Reset form
    setFormData({
      walletId: '',
      amount: '',
      bankAccountId: '',
      tag: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5" />
          Initier un virement sortant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletId">Portefeuille source <span className="text-red-500">*</span></Label>
            <Select value={formData.walletId} onValueChange={(value) => setFormData(prev => ({ ...prev, walletId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un portefeuille" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    Portefeuille #{wallet.id} - {(wallet.balance / 100).toFixed(2)} {wallet.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="500.00"
                className={`pr-8 ${insufficientFunds ? 'border-red-300 bg-red-50' : ''}`}
                required
              />
              <Euro className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {selectedWallet && (
              <p className="text-sm text-gray-600">
                Solde disponible: {(selectedWallet.balance / 100).toFixed(2)} {selectedWallet.currency}
              </p>
            )}
            {insufficientFunds && (
              <p className="text-sm text-red-600">Fonds insuffisants</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccountId">Compte bénéficiaire <span className="text-red-500">*</span></Label>
            <Select value={formData.bankAccountId} onValueChange={(value) => setFormData(prev => ({ ...prev, bankAccountId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un compte bancaire" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountHolder} - {account.iban.substring(0, 20)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Libellé du virement <span className="text-red-500">*</span></Label>
            <Textarea
              id="tag"
              value={formData.tag}
              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
              placeholder="Virement loyer juin"
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || insufficientFunds}>
            {loading ? 'Virement en cours...' : 'Initier le virement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
