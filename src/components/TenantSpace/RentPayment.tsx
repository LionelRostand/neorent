
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import PaymentDetailsCard from './PaymentDetailsCard';
import PaymentDialog from './PaymentDialog';
import PaymentImportantInfo from './PaymentImportantInfo';

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
  const { t } = useTranslation();
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
        title: t('tenantSpace.payment.validationError'),
        description: t('tenantSpace.payment.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (paidAmountNum <= 0) {
      toast({
        title: t('tenantSpace.payment.paymentError'),
        description: t('tenantSpace.payment.amountMustBePositive'),
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
          title: t('tenantSpace.payment.partialPaymentAlert'),
          description: `${t('tenantSpace.payment.amountEntered')}: ${paidAmountNum}€ / ${t('tenantSpace.payment.expectedAmount')}: ${totalAmount}€. ${t('tenantSpace.payment.missing')}: ${(totalAmount - paidAmountNum).toFixed(2)}€`,
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
          title: t('tenantSpace.payment.overpaymentAlert'),
          description: `${t('tenantSpace.payment.amountEntered')}: ${paidAmountNum}€ / ${t('tenantSpace.payment.expectedAmount')}: ${totalAmount}€. ${t('tenantSpace.payment.surplus')}: ${(paidAmountNum - totalAmount).toFixed(2)}€`,
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
          title: t('tenantSpace.payment.paymentRecorded'),
          description: t('tenantSpace.payment.paymentSuccess'),
        });
      } else {
        toast({
          title: t('tenantSpace.payment.paymentRecorded'),
          description: `${t('tenantSpace.payment.paymentRecorded')}. ${t('tenantSpace.payment.noReceiptPartial')}.`,
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
        title: t('tenantSpace.payment.paymentError'),
        description: t('tenantSpace.payment.paymentError'),
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
          {t('tenantSpace.payment.payRent')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PaymentDetailsCard 
            monthlyRent={monthlyRent}
            monthlyCharges={monthlyCharges}
            totalAmount={totalAmount}
          />

          <PaymentDialog
            open={open}
            onOpenChange={setOpen}
            actualTenantName={actualTenantName}
            actualTenantType={actualTenantType}
            propertyTitle={propertyData.title}
            totalAmount={totalAmount}
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            notes={notes}
            setNotes={setNotes}
            loading={loading}
            isFormValid={isFormValid}
            onSubmit={handleSubmit}
          />

          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3" onClick={() => setOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              {t('tenantSpace.payment.makePayment')}
            </Button>
          </DialogTrigger>

          <PaymentImportantInfo />
        </div>
      </CardContent>
    </Card>
  );
};

export default RentPayment;
