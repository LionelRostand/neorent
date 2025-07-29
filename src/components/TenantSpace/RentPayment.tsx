
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';
import PaymentDetailsCard from './PaymentDetailsCard';
import PaymentOptionsModal from './PaymentOptionsModal';
import CashPaymentModal from './CashPaymentModal';
import PaymentImportantInfo from './PaymentImportantInfo';
import PaymentStatusNotification from './PaymentStatusNotification';

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
  const [cashPaymentModalOpen, setCashPaymentModalOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { addPayment } = useFirebasePayments();
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { pendingValidations } = usePaymentValidation();
  
  // Obtenir le profil actuel (soit utilisateur connecté, soit profil en mode admin)
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const actualTenantName = currentProfile?.name || tenantData.name;
  const actualTenantType = (currentUserType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Locataire' | 'Colocataire';
  
  // Filtrer les paiements pour ce locataire
  const tenantPendingPayments = pendingValidations.filter(payment => 
    payment.tenantName === actualTenantName
  );
  
  const { generateReceipt } = useReceiptGeneration({
    tenantName: actualTenantName,
    tenantType: actualTenantType,
    propertyAddress: propertyData.address,
    propertyType: actualTenantType === 'Colocataire' ? 'Chambre en colocation' : 'Appartement'
  });

  // Écouter l'événement d'ouverture du modal de paiement en espèces
  React.useEffect(() => {
    const handleOpenCashModal = () => {
      console.log('🔥 ÉVÉNEMENT REÇU - Ouverture modal espèces');
      setCashPaymentModalOpen(true);
    };

    window.addEventListener('openCashPaymentModal', handleOpenCashModal);
    return () => window.removeEventListener('openCashPaymentModal', handleOpenCashModal);
  }, []);

  // Utiliser le montant du contrat depuis propertyData (qui vient maintenant du contrat signé)
  const monthlyRent = propertyData.rent;
  const monthlyCharges = propertyData.charges;
  const totalAmount = monthlyRent + monthlyCharges;

  // Validation du formulaire
  const isFormValid = paymentDate && paymentMethod && paidAmount && (parseFloat(paidAmount) || 0) > 0;

  const handleDownloadReceipt = (paymentId: string) => {
    const payment = tenantPendingPayments.find(p => p.id === paymentId);
    if (payment) {
      const currentDate = new Date(payment.paymentDate);
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

      generateReceipt({
        month: monthYear,
        rentAmount: monthlyRent,
        charges: monthlyCharges,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDate || !paymentMethod || !paidAmount) {
      toast({
        title: t('tenantSpace.payment.validationError'),
        description: t('tenantSpace.payment.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    const paidAmountNum = parseFloat(paidAmount) || 0;
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
      // Déterminer le statut selon le montant payé et le mode de paiement
      let paymentStatus = 'Payé';
      let validationStatus = undefined;
      
      // Si c'est un virement, le mettre en attente de validation
      if (paymentMethod === 'virement') {
        paymentStatus = 'En attente de validation';
        validationStatus = 'pending';
      } else {
        // Pour les autres modes de paiement, traitement normal
        if (paidAmountNum < totalAmount) {
          paymentStatus = 'Partiel';
        } else if (paidAmountNum > totalAmount) {
          paymentStatus = 'Trop-perçu';
        }
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
        notes: notes || null,
        validationStatus,
        receiptGenerated: false
      };

      await addPayment(paymentData);

      // Messages différents selon le mode de paiement
      if (paymentMethod === 'virement') {
        toast({
          title: 'Virement déclaré',
          description: 'Votre virement a été déclaré. Il sera validé par le bailleur sous 24h.',
        });
      } else {
        // Générer automatiquement le reçu pour les autres modes de paiement
        if (paidAmountNum === totalAmount) {
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
            title: t('tenantSpace.payment.paymentRecorded'),
            description: t('tenantSpace.payment.paymentSuccess'),
          });
        } else {
          toast({
            title: t('tenantSpace.payment.paymentRecorded'),
            description: `${t('tenantSpace.payment.paymentRecorded')}. ${t('tenantSpace.payment.noReceiptPartial')}.`,
          });
        }
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
    <div className="space-y-4">
      {/* Notifications de statut des paiements */}
      <PaymentStatusNotification
        pendingPayments={tenantPendingPayments}
        onDownloadReceipt={handleDownloadReceipt}
      />

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

            <PaymentOptionsModal
              open={open}
              onOpenChange={setOpen}
              onSelectCashPayment={() => setCashPaymentModalOpen(true)}
              onSelectBankTransfer={() => {
                // TODO: Ouvrir modal virement bancaire
                console.log('Virement bancaire sélectionné');
              }}
              onSelectOnlinePayment={() => {
                // TODO: Ouvrir modal paiement en ligne
                console.log('Paiement en ligne sélectionné');
              }}
              onSelectHistory={() => {
                // TODO: Naviguer vers historique
                console.log('Historique sélectionné');
              }}
            />

            <CashPaymentModal
              open={cashPaymentModalOpen}
              onOpenChange={setCashPaymentModalOpen}
              tenantData={{
                name: actualTenantName,
                type: actualTenantType,
                email: currentProfile?.email || 'email@example.com'
              }}
              propertyData={{
                address: propertyData.address,
                rent: monthlyRent,
                charges: monthlyCharges
              }}
            />

            <div className="space-y-2">
              {/* Menu principal de paiement */}
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                onClick={() => setOpen(true)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {t('tenantSpace.payment.makePayment')}
              </Button>
            </div>

            <PaymentImportantInfo />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentPayment;
