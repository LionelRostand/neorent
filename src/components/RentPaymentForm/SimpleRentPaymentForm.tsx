
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useState } from 'react';

// Import des composants refactorisés
import PaymentFormHeader from './PaymentFormHeader';
import TenantSelector from './TenantSelector';
import PaymentDateInput from './PaymentDateInput';
import PropertyInfoDisplay from './PropertyInfoDisplay';
import PaymentAmountInput from './PaymentAmountInput';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentNotesInput from './PaymentNotesInput';
import PaymentFormActions from './PaymentFormActions';

interface SimpleRentPaymentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const SimpleRentPaymentForm: React.FC<SimpleRentPaymentFormProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [selectedTenant, setSelectedTenant] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { addPayment } = useFirebasePayments();

  // Combiner les locataires et colocataires avec leur type
  const allTenants = [
    ...tenants.filter(tenant => tenant.status === 'Actif').map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      type: 'Locataire',
      property: tenant.property,
      rentAmount: parseFloat(tenant.rentAmount) || 0
    })),
    ...roommates.filter(roommate => roommate.status === 'Actif').map(roommate => ({
      id: roommate.id,
      name: roommate.name,
      type: 'Colocataire',
      property: `${roommate.property} - Chambre ${roommate.roomNumber}`,
      rentAmount: parseFloat(roommate.rentAmount) || 0
    }))
  ];

  const selectedTenantData = allTenants.find(t => t.id === selectedTenant);
  
  // Vérifier s'il y a une incohérence de paiement
  const hasPaymentDiscrepancy = selectedTenantData && amount && 
    parseFloat(amount) !== selectedTenantData.rentAmount && 
    parseFloat(amount) > 0;

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenant(tenantId);
    const tenant = allTenants.find(t => t.id === tenantId);
    if (tenant) {
      setAmount(tenant.rentAmount.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenant || !paymentDate || !amount || !paymentMethod) {
      toast({
        title: t('common.error'),
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTenantData) {
      toast({
        title: t('common.error'),
        description: "Locataire/Colocataire non trouvé.",
        variant: "destructive",
      });
      return;
    }

    try {
      const paymentData = {
        tenantName: selectedTenantData.name,
        tenantType: selectedTenantData.type,
        property: selectedTenantData.property,
        rentAmount: parseFloat(amount),
        paidAmount: parseFloat(amount),
        dueDate: paymentDate,
        status: 'Payé',
        paymentDate: paymentDate,
        paymentMethod,
        notes: notes || null
      };

      await onSubmit(paymentData);

      toast({
        title: "Règlement enregistré",
        description: "Le règlement de loyer a été enregistré avec succès.",
      });

      // Reset form
      setSelectedTenant('');
      setPaymentDate('');
      setAmount('');
      setPaymentMethod('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du paiement:', err);
      toast({
        title: t('common.error'),
        description: "Erreur lors de l'enregistrement du règlement.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <PaymentFormHeader isInDialog={false} />
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Section Sélection du locataire/colocataire */}
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <TenantSelector
              selectedTenant={selectedTenant}
              onTenantChange={handleTenantChange}
              tenants={allTenants}
              selectedTenantData={selectedTenantData}
            />

            <PaymentDateInput
              paymentDate={paymentDate}
              onPaymentDateChange={setPaymentDate}
            />
          </div>

          {/* Section Informations du bien */}
          {selectedTenantData && (
            <PropertyInfoDisplay tenantData={selectedTenantData} />
          )}

          {/* Section Montant et Mode de paiement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <PaymentAmountInput
              amount={amount}
              onAmountChange={setAmount}
              selectedTenantData={selectedTenantData}
              hasPaymentDiscrepancy={hasPaymentDiscrepancy}
            />

            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Section Notes */}
          <PaymentNotesInput
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>

        {/* Boutons d'action */}
        <PaymentFormActions onCancel={onClose} />
      </form>
    </div>
  );
};

export default SimpleRentPaymentForm;
