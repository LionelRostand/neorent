
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import PaymentValidationPanel from '@/components/RentManagement/PaymentValidationPanel';
import { usePaymentValidation } from '@/hooks/usePaymentValidation';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import { useToast } from '@/hooks/use-toast';

const PaymentValidation = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { 
    pendingValidations, 
    loading, 
    error, 
    validatePayment, 
    markReceiptAsGenerated 
  } = usePaymentValidation();

  const handleValidatePayment = async (
    paymentId: string, 
    decision: 'validated' | 'rejected', 
    comment?: string
  ) => {
    await validatePayment(paymentId, decision, comment);
  };

  const handleGenerateReceipt = (payment: any) => {
    const { generateReceipt } = useReceiptGeneration({
      tenantName: payment.tenantName,
      tenantType: payment.tenantType,
      propertyAddress: payment.property,
      propertyType: payment.tenantType === 'Colocataire' ? 'Chambre en colocation' : 'Appartement'
    });

    const currentDate = new Date(payment.paymentDate);
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Estimation des montants (90% loyer, 10% charges)
    const rentAmount = Math.round(payment.amount * 0.9);
    const charges = payment.amount - rentAmount;

    generateReceipt({
      month: monthYear,
      rentAmount: rentAmount,
      charges: charges,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod
    });

    // Marquer le reçu comme généré
    markReceiptAsGenerated(payment.id);

    toast({
      title: 'Quittance générée',
      description: `La quittance a été générée pour ${payment.tenantName}`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des validations en attente...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validation des Virements</h1>
          <p className="text-gray-600 mt-2">
            Vérifiez et validez les virements déclarés par vos locataires
          </p>
        </div>

        <PaymentValidationPanel
          pendingPayments={pendingValidations}
          onValidatePayment={handleValidatePayment}
          onGenerateReceipt={handleGenerateReceipt}
        />
      </div>
    </MainLayout>
  );
};

export default PaymentValidation;
