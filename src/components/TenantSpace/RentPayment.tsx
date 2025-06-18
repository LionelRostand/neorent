
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Euro,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

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
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { addPayment } = useFirebasePayments();
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  
  // Obtenir le profil actuel (soit utilisateur connecté, soit profil en mode admin)
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const actualTenantName = currentProfile?.name || tenantData.name;
  const actualTenantType = (currentUserType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Locataire' | 'Colocataire';
  
  console.log('Données du locataire pour PDF:', {
    actualTenantName,
    actualTenantType,
    currentProfile
  });
  
  const { generateReceipt } = useReceiptGeneration({
    tenantName: actualTenantName,
    tenantType: actualTenantType,
    propertyAddress: propertyData.address,
    propertyType: actualTenantType === 'Colocataire' ? 'Chambre en colocation' : 'Appartement'
  });

  // Valeurs corrigées selon la demande
  const monthlyRent = 400;
  const monthlyCharges = 50;
  const totalAmount = monthlyRent + monthlyCharges; // 450€

  // Vérifier s'il y a une différence entre le montant saisi et le montant attendu
  const paidAmountNum = parseFloat(paidAmount) || 0;
  const hasDiscrepancy = paidAmount && paidAmountNum !== totalAmount && paidAmountNum > 0;
  const isFullPayment = paidAmountNum === totalAmount;

  // Validation du formulaire
  const isFormValid = paymentDate && paymentMethod && paidAmount && paidAmountNum > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Validation du formulaire:', {
      paymentDate,
      paymentMethod,
      paidAmount,
      paidAmountNum,
      isFormValid
    });
    
    if (!paymentDate || !paymentMethod || !paidAmount) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (Date, Montant et Mode de paiement).",
        variant: "destructive",
      });
      return;
    }

    if (paidAmountNum <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être supérieur à 0€.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Déterminer le statut selon le montant payé
      let paymentStatus = 'Payé';
      if (paidAmountNum < totalAmount) {
        paymentStatus = 'Partiel';
        
        // Alerte backend pour paiement partiel
        console.warn('🚨 ALERTE BACKEND - Paiement partiel détecté:', {
          tenant: actualTenantName,
          attendu: totalAmount,
          paye: paidAmountNum,
          difference: totalAmount - paidAmountNum,
          pourcentage: ((paidAmountNum / totalAmount) * 100).toFixed(1) + '%'
        });
        
        toast({
          title: "Alerte - Paiement partiel",
          description: `Montant payé: ${paidAmountNum}€ / Attendu: ${totalAmount}€. Différence: ${(totalAmount - paidAmountNum).toFixed(2)}€`,
          variant: "destructive",
        });
      } else if (paidAmountNum > totalAmount) {
        paymentStatus = 'Trop-perçu';
        
        // Alerte backend pour trop-perçu
        console.warn('🚨 ALERTE BACKEND - Trop-perçu détecté:', {
          tenant: actualTenantName,
          attendu: totalAmount,
          paye: paidAmountNum,
          surplus: paidAmountNum - totalAmount
        });
        
        toast({
          title: "Alerte - Trop-perçu",
          description: `Montant payé: ${paidAmountNum}€ / Attendu: ${totalAmount}€. Surplus: ${(paidAmountNum - totalAmount).toFixed(2)}€`,
          variant: "destructive",
        });
      }

      const paymentData = {
        tenantName: actualTenantName,
        tenantType: actualTenantType,
        property: propertyData.title,
        rentAmount: totalAmount,
        paidAmount: paidAmountNum,
        dueDate: paymentDate,
        status: paymentStatus,
        paymentDate: paymentDate,
        paymentMethod,
        notes: notes || null
      };

      console.log('💾 Données de paiement à enregistrer:', paymentData);

      await addPayment(paymentData);

      // Générer automatiquement le reçu PDF seulement si paiement complet
      if (isFullPayment) {
        const currentDate = new Date(paymentDate);
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        console.log('Génération du reçu PDF pour:', actualTenantName);

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
      } else {
        toast({
          title: "Paiement enregistré",
          description: `Paiement ${paymentStatus.toLowerCase()} enregistré. Aucun reçu généré pour un paiement non complet.`,
        });
      }

      // Reset form
      setPaymentDate('');
      setPaymentMethod('');
      setPaidAmount('');
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
            <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Paiement de loyer
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[70vh] pr-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Détails du paiement</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{actualTenantType}:</span>
                        <span className="font-medium">{actualTenantName}</span>
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
                      <Label htmlFor="paidAmount" className="flex items-center gap-2">
                        <Euro className="h-4 w-4" />
                        Montant à payer <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="paidAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={totalAmount.toString()}
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          className={`mt-1 pr-8 ${
                            hasDiscrepancy 
                              ? 'border-red-300 focus:border-red-500 bg-red-50' 
                              : isFullPayment
                              ? 'border-green-300 focus:border-green-500 bg-green-50'
                              : ''
                          }`}
                          required
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                      </div>
                      
                      {/* Alerte de discordance */}
                      {hasDiscrepancy && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium text-red-800">Attention - Montant différent</p>
                              <p className="text-red-700">
                                Montant saisi: <span className="font-semibold">{paidAmountNum}€</span> • 
                                Montant attendu: <span className="font-semibold">{totalAmount}€</span>
                              </p>
                              <p className="text-xs text-red-600 mt-1">
                                {paidAmountNum < totalAmount 
                                  ? `Manquant: ${(totalAmount - paidAmountNum).toFixed(2)}€`
                                  : `Surplus: ${(paidAmountNum - totalAmount).toFixed(2)}€`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Confirmation paiement complet */}
                      {isFullPayment && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <p className="text-sm font-medium text-green-800">
                              Montant correct - Paiement complet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Mode de paiement <span className="text-red-500">*</span>
                      </Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
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

                  {/* Informations sur le reçu */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <Download className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Reçu de paiement :</p>
                        <p className="text-xs">
                          {isFullPayment 
                            ? "Un reçu PDF sera automatiquement téléchargé après validation du paiement complet."
                            : "Aucun reçu ne sera généré pour un paiement partiel ou excédentaire."
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Validation form indicator */}
                  {!isFormValid && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-800">
                          Veuillez remplir tous les champs obligatoires pour continuer
                        </p>
                      </div>
                    </div>
                  )}

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
                      className={`${
                        isFormValid 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={loading || !isFormValid}
                    >
                      {loading ? 'Traitement...' : 'Confirmer le paiement'}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
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
                  <li>• Saisissez le montant exact que vous payez</li>
                  <li>• Un reçu PDF sera généré seulement pour les paiements complets</li>
                  <li>• En cas de montant différent, une alerte sera remontée</li>
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
