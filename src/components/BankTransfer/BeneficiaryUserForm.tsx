
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, CreditCard } from 'lucide-react';
import { BeneficiaryUser } from '@/types/bankTransfer';

interface BeneficiaryUserFormProps {
  onSubmit: (userData: Omit<BeneficiaryUser, 'id' | 'status' | 'createdAt'>) => void;
  loading?: boolean;
}

const BeneficiaryUserForm: React.FC<BeneficiaryUserFormProps> = ({
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    iban: '',
    bic: '',
    accountHolder: '',
    bankName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.iban || !formData.bic) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      bankAccount: {
        id: '',
        iban: formData.iban,
        bic: formData.bic,
        accountHolder: formData.accountHolder || `${formData.firstName} ${formData.lastName}`,
        bankName: formData.bankName,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      }
    };

    onSubmit(userData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Créer un compte bénéficiaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Jean"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Durand"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="jean@exemple.com"
              required
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Informations bancaires
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN <span className="text-red-500">*</span></Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                  placeholder="FR76 3000 6000 0112 3456 7890 189"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bic">BIC/SWIFT <span className="text-red-500">*</span></Label>
                  <Input
                    id="bic"
                    value={formData.bic}
                    onChange={(e) => setFormData(prev => ({ ...prev, bic: e.target.value }))}
                    placeholder="AGRIFRPP"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Nom de la banque</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Crédit Agricole"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Titulaire du compte</Label>
                <Input
                  id="accountHolder"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                  placeholder="Sera rempli automatiquement si vide"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le compte bénéficiaire'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryUserForm;
