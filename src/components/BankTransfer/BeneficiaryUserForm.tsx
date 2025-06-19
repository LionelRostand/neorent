
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
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-5 w-5" />
            Créer un compte bénéficiaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Jean"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Durand"
                  className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jean@exemple.com"
                className="w-full"
                required
              />
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <h4 className="font-medium mb-3 sm:mb-4 flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Informations bancaires
              </h4>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="iban" className="text-sm font-medium">
                    IBAN <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="iban"
                    value={formData.iban}
                    onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                    placeholder="FR76 3000 6000 0112 3456 7890 189"
                    className="w-full font-mono text-sm"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bic" className="text-sm font-medium">
                      BIC/SWIFT <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bic"
                      value={formData.bic}
                      onChange={(e) => setFormData(prev => ({ ...prev, bic: e.target.value }))}
                      placeholder="AGRIFRPP"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium">
                      Nom de la banque
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="Crédit Agricole"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountHolder" className="text-sm font-medium">
                    Titulaire du compte
                  </Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder="Sera rempli automatiquement si vide"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={loading}
              size="lg"
            >
              {loading ? 'Création en cours...' : 'Créer le compte bénéficiaire'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeneficiaryUserForm;
