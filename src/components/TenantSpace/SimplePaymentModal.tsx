import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DollarSign } from 'lucide-react';

interface SimplePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: any;
  propertyData: any;
}

const SimplePaymentModal = ({ open, onOpenChange, tenantData, propertyData }: SimplePaymentModalProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('450');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log('🚀 Simple Payment Submit');
    
    if (!amount || !paymentMethod || !date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Générer la quittance PDF
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
          amount: parseFloat(amount),
          date: date,
          method: getMethodLabel(paymentMethod),
          reference: reference || '',
          period: format(new Date(date), 'MMMM yyyy', { locale: fr })
        }
      });

      toast({
        title: "Paiement enregistré",
        description: "Votre quittance a été générée et téléchargée avec succès"
      });

      // Reset form
      setAmount('450');
      setPaymentMethod('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setReference('');
      setDescription('');
      onOpenChange(false);

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la quittance",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'transfer': return 'Virement bancaire';
      case 'check': return 'Chèque';
      case 'online': return 'Paiement en ligne';
      default: return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Déclarer un paiement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="450"
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="method">Mode de paiement *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="transfer">Virement bancaire</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
                <SelectItem value="online">Paiement en ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de transaction, chèque..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Loyer du mois de..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Génération...' : 'Déclarer et générer la quittance'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimplePaymentModal;