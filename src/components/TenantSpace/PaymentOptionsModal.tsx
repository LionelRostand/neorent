import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, CreditCard, Banknote, Upload, History, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaymentOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: any;
  propertyData: any;
}

const PaymentOptionsModal = ({ open, onOpenChange, tenantData, propertyData }: PaymentOptionsModalProps) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    reference: '',
    description: '',
    method: ''
  });

  console.log('PaymentOptionsModal render - selectedOption:', selectedOption);
  console.log('PaymentOptionsModal render - open:', open);

  const paymentOptions = [
    {
      id: 'history',
      title: 'Historique des paiements',
      description: 'Consulter l\'historique des paiements',
      icon: History,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'bank-transfer',
      title: 'Virement bancaire',
      description: 'Déclarer un virement bancaire effectué',
      icon: Banknote,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'cash',
      title: 'Paiement en espèces',
      description: 'Déclarer un paiement en espèces',
      icon: DollarSign,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      id: 'online',
      title: 'Paiement en ligne',
      description: 'Payer en ligne par carte',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    console.log('🔥 handleOptionSelect called with:', optionId);
    console.log('🔥 Current selectedOption before:', selectedOption);
    
    if (optionId === 'history') {
      console.log('🔥 History option selected, closing modal');
      onOpenChange(false);
      return;
    }
    
    console.log('🔥 Setting selectedOption to:', optionId);
    setSelectedOption(optionId);
    
    const newForm = { 
      ...paymentForm, 
      method: optionId,
      amount: tenantData?.type === 'Colocataire' ? '450' : '1200'
    };
    console.log('🔥 Setting paymentForm to:', newForm);
    setPaymentForm(newForm);
    
    console.log('🔥 handleOptionSelect completed');
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.amount || !paymentForm.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      // Données du paiement
      const paymentData = {
        tenantId: tenantData?.id,
        tenantName: tenantData?.name,
        amount: parseFloat(paymentForm.amount),
        date: paymentForm.date,
        method: paymentForm.method,
        reference: paymentForm.reference,
        description: paymentForm.description,
        status: selectedOption === 'online' ? 'processing' : 'declared',
        property: propertyData?.address
      };

      console.log('Payment data to save:', paymentData);

      if (selectedOption === 'online') {
        // Intégration Stripe à venir
        toast({
          title: "Paiement en ligne",
          description: "Redirection vers le paiement sécurisé..."
        });
      } else {
        // Générer immédiatement la quittance pour espèces/virement
        const { generateRentReceipt } = await import('@/services/receiptPdfService');
        await generateRentReceipt({
          tenant: {
            name: tenantData?.name || 'Nom du locataire',
            address: propertyData?.address || 'Adresse de la propriété',
            email: tenantData?.email || 'email@example.com'
          },
          property: {
            address: propertyData?.address || 'Adresse de la propriété',
            rent: propertyData?.rent || 400,
            charges: propertyData?.charges || 50
          },
          payment: {
            amount: parseFloat(paymentForm.amount),
            date: paymentForm.date,
            method: getPaymentMethodLabel(paymentForm.method),
            reference: paymentForm.reference || '',
            period: format(new Date(paymentForm.date), 'MMMM yyyy', { locale: fr })
          }
        });

        toast({
          title: "Paiement déclaré",
          description: "Votre quittance a été générée et téléchargée"
        });
      }

      // Reset form
      setSelectedOption(null);
      setPaymentForm({
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        reference: '',
        description: '',
        method: ''
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank-transfer':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      case 'online':
        return 'Paiement en ligne';
      default:
        return 'Autre';
    }
  };

  const getPaymentFormTitle = () => {
    switch (selectedOption) {
      case 'bank-transfer':
        return 'Déclarer un virement bancaire';
      case 'cash':
        return 'Déclarer un paiement en espèces';
      case 'online':
        return 'Paiement en ligne par carte';
      default:
        return 'Nouveau paiement';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            {selectedOption ? getPaymentFormTitle() : 'Options de paiement'}
          </DialogTitle>
        </DialogHeader>

        {!selectedOption ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">DEBUG: selectedOption is null, showing options</p>
            {paymentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => {
                    console.log('🔥 Card clicked for option:', option.id);
                    handleOptionSelect(option.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${option.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{option.title}</h3>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-green-600">DEBUG: selectedOption is {selectedOption}, showing form</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Montant *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="450"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date">Date du paiement *</Label>
                <Input
                  id="date"
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reference">Référence de transaction</Label>
              <Input
                id="reference"
                placeholder={selectedOption === 'bank-transfer' ? 'Numéro de virement' : 'Référence'}
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, reference: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                placeholder="Loyer du mois de..."
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {selectedOption === 'online' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Paiement sécurisé</h4>
                <p className="text-blue-700 text-sm">
                  Vous serez redirigé vers notre plateforme de paiement sécurisé pour effectuer le règlement par carte bancaire.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Retour clicked');
                  setSelectedOption(null);
                }}
                className="flex-1"
              >
                Retour
              </Button>
              <Button 
                onClick={() => {
                  console.log('Déclarer clicked');
                  handlePaymentSubmit();
                }}
                className="flex-1"
              >
                {selectedOption === 'online' ? 'Payer en ligne' : 'Déclarer le paiement'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentOptionsModal;