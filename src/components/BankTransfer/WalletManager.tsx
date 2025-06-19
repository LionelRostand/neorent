
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Euro } from 'lucide-react';
import { Wallet as WalletType } from '@/types/bankTransfer';

interface WalletManagerProps {
  wallets: WalletType[];
  onCreateWallet: (walletData: Omit<WalletType, 'id' | 'status' | 'createdAt'>) => void;
  loading?: boolean;
}

const WalletManager: React.FC<WalletManagerProps> = ({
  wallets,
  onCreateWallet,
  loading = false
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    userId: '',
    currency: 'EUR',
    initialBalance: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.userId) {
      toast({
        title: "Utilisateur requis",
        description: "Veuillez sélectionner un utilisateur",
        variant: "destructive",
      });
      return;
    }

    const walletData = {
      userId: formData.userId,
      currency: formData.currency,
      balance: formData.initialBalance ? parseFloat(formData.initialBalance) * 100 : 0 // convertir en centimes
    };

    onCreateWallet(walletData);
    
    // Reset form
    setFormData({
      userId: '',
      currency: 'EUR',
      initialBalance: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Créer un portefeuille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">ID Utilisateur <span className="text-red-500">*</span></Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="123456"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="USD">USD - Dollar américain</SelectItem>
                    <SelectItem value="GBP">GBP - Livre sterling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">Solde initial (optionnel)</Label>
                <div className="relative">
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: e.target.value }))}
                    placeholder="0.00"
                    className="pr-8"
                  />
                  <Euro className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer le portefeuille'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des portefeuilles existants */}
      <Card>
        <CardHeader>
          <CardTitle>Portefeuilles existants</CardTitle>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun portefeuille créé</p>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Portefeuille #{wallet.id}</p>
                    <p className="text-sm text-gray-600">Utilisateur: {wallet.userId} • {wallet.currency}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{(wallet.balance / 100).toFixed(2)} {wallet.currency}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      wallet.status === 'active' ? 'bg-green-100 text-green-800' :
                      wallet.status === 'frozen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {wallet.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManager;
