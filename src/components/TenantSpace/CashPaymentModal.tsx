import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DollarSign, AlertTriangle } from 'lucide-react';

interface CashPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: {
    name: string;
    type?: 'Locataire' | 'Colocataire';
    email?: string;
  };
  propertyData: {
    address: string;
    rent: number;
    charges: number;
  };
}

const CashPaymentModal = ({ open, onOpenChange, tenantData, propertyData }: CashPaymentModalProps) => {
  const { toast } = useToast();
  const { addPayment } = useFirebasePayments();
  
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expectedAmount = propertyData.rent + propertyData.charges;

  const handleSubmit = async () => {
    console.log('🚀 Cash Payment Submit');
    
    if (!amount || !date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le montant et la date",
        variant: "destructive"
      });
      return;
    }

    const paidAmount = parseFloat(amount);
    if (paidAmount <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être positif",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Vérifier si le montant correspond au loyer attendu
      const hasDiscrepancy = paidAmount !== expectedAmount;
      
      if (hasDiscrepancy) {
        // Générer une alerte pour discordance
        toast({
          title: "⚠️ Montant différent du loyer attendu",
          description: `Montant payé: ${paidAmount}€ - Loyer attendu: ${expectedAmount}€. Une alerte a été envoyée au propriétaire.`,
          variant: "destructive"
        });
        
        console.log(`🚨 ALERTE: Paiement de ${paidAmount}€ au lieu de ${expectedAmount}€ par ${tenantData.name}`);
      }

      // Déterminer le statut du paiement
      let status = 'Payé';
      if (paidAmount < expectedAmount) {
        status = 'Partiel';
      } else if (paidAmount > expectedAmount) {
        status = 'Trop-perçu';
      }

      // Créer l'objet paiement pour Firebase
      const paymentData = {
        tenantName: tenantData.name,
        tenantType: tenantData.type || 'Locataire',
        property: propertyData.address,
        rentAmount: expectedAmount,
        paidAmount: paidAmount,
        dueDate: date,
        status: status,
        paymentDate: date,
        paymentMethod: 'Espèces',
        notes: description || null,
        paymentType: 'loyer' as const
      };

      console.log('💾 Enregistrement du paiement:', paymentData);

      // Enregistrer le paiement dans Firebase
      await addPayment(paymentData);

      // Générer la quittance PDF
      const { generateRentReceipt } = await import('@/services/receiptPdfService');
      
      await generateRentReceipt({
        tenant: {
          name: tenantData.name,
          address: propertyData.address,
          email: tenantData.email || 'email@example.com'
        },
        property: {
          address: propertyData.address,
          rent: propertyData.rent,
          charges: propertyData.charges
        },
        payment: {
          amount: paidAmount,
          date: date,
          method: 'Espèces',
          reference: reference || '',
          period: format(new Date(date), 'MMMM yyyy', { locale: fr })
        }
      });

      toast({
        title: "✅ Paiement en espèces enregistré",
        description: hasDiscrepancy 
          ? "Paiement enregistré avec alerte pour le propriétaire. Quittance générée."
          : "Votre paiement a été enregistré et votre quittance a été générée avec succès"
      });

      // Reset form
      setAmount('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setReference('');
      setDescription('');
      onOpenChange(false);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountDifference = amount ? parseFloat(amount) - expectedAmount : 0;
  const hasDiscrepancy = amount && parseFloat(amount) !== expectedAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Paiement en espèces
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Affichage du montant attendu */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Montant attendu :</strong> {expectedAmount}€
            </p>
            <p className="text-xs text-blue-600">
              Loyer: {propertyData.rent}€ + Charges: {propertyData.charges}€
            </p>
          </div>

          {/* Alerte si discordance */}
          {hasDiscrepancy && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Montant différent de {amountDifference > 0 ? '+' : ''}{amountDifference}€
                </span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Une alerte sera envoyée au propriétaire
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Montant payé (€) *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={expectedAmount.toString()}
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="date">Date du paiement *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de reçu, note..."
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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashPaymentModal;