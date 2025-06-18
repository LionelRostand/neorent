import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Euro,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';

interface RentPaymentProps {
  tenantData: {
    name: string;
    type?: 'Locataire' | 'Colocataire';
  };
  propertyData: {
    title: string;
    address: string;
    rent: number;
    charges: number;
  };
}

const RentPayment = ({ tenantData, propertyData }: RentPaymentProps) => {
  const [open, setOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { addPayment } = useFirebasePayments();
  
  const { generateReceipt } = useReceiptGeneration({
    tenantName: tenantData.name,
    tenantType: tenantData.type || 'Locataire',
    propertyAddress: propertyData.address,
    propertyType: tenantData.type === 'Colocataire' ? 'Chambre en colocation' : 'Appartement'
  });

  // Valeurs corrigées selon la demande
  const monthlyRent = 400;
  const monthlyCharges = 50;
  const totalAmount = monthlyRent + monthlyCharges; // 450€

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDate || !paymentMethod) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        tenantName: tenantData.name,
        tenantType: tenantData.type || 'Locataire',
        property: propertyData.title,
        rentAmount: totalAmount,
        dueDate: paymentDate,
        status: 'Payé',
        paymentDate: paymentDate,
        paymentMethod,
        notes: notes || null
      };

      await addPayment(paymentData);

      // Générer automatiquement le reçu PDF
      const currentDate = new Date(paymentDate);
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

      generateReceipt({
        month: monthYear,
        rentAmount: monthlyRent,
        charges: monthlyCharges,
        paymentDate: paymentDate,
        paymentMethod: paymentMethod
      });

      toast({
        title: "Paiement enregistré",
        description: "Votre paiement de loyer a été enregistré et le reçu a été téléchargé automatiquement.",
      });

      // Reset form
      setPaymentDate('');
      setPaymentMethod('');
      setNotes('');
      setOpen(false);
    } catch (err) {
      console.error('Erreur lors du paiement:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement du paiement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CreditCard className="h-5 w-5" />
          Payer mon loyer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informations du loyer */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Loyer mensuel</p>
                <p className="text-lg font-semibold text-gray-900">{monthlyRent}€</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Charges</p>
                <p className="text-lg font-semibold text-gray-900">{monthlyCharges}€</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Total à payer</p>
                <p className="text-xl font-bold text-green-600">{totalAmount}€</p>
              </div>
            </div>
          </div>

          {/* Bouton de paiement */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                <DollarSign className="mr-2 h-4 w-4" />
                Effectuer un paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Paiement de loyer
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Détails du paiement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Locataire:</span>
                      <span className="font-medium">{tenantData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Propriété:</span>
                      <span className="font-medium">{propertyData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant total:</span>
                      <span className="font-bold text-green-600">{totalAmount}€</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date de paiement <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Mode de paiement <span className="text-red-500">*</span>
                    </Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner le mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="virement">Virement bancaire</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="especes">Espèces</SelectItem>
                        <SelectItem value="carte">Carte bancaire</SelectItem>
                        <SelectItem value="prelevement">Prélèvement automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Input
                      id="notes"
                      placeholder="Commentaires sur ce paiement..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Download className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Reçu de paiement :</p>
                      <p className="text-xs">Un reçu PDF sera automatiquement téléchargé après validation du paiement.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Traitement...' : 'Confirmer le paiement'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Informations importantes */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informations importantes :</p>
                <ul className="space-y-1 text-xs">
                  <li>• Le paiement doit être effectué avant le 5 de chaque mois</li>
                  <li>• Conservez vos justificatifs de paiement</li>
                  <li>• Un reçu PDF sera généré automatiquement</li>
                  <li>• En cas de problème, contactez votre gestionnaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentPayment;
