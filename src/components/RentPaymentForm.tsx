
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

// Import des composants refactorisés
import PaymentFormHeader from './RentPaymentForm/PaymentFormHeader';
import TenantSelector from './RentPaymentForm/TenantSelector';
import PaymentDateInput from './RentPaymentForm/PaymentDateInput';
import PropertyInfoDisplay from './RentPaymentForm/PropertyInfoDisplay';
import PaymentAmountInput from './RentPaymentForm/PaymentAmountInput';
import PaymentMethodSelector from './RentPaymentForm/PaymentMethodSelector';
import PaymentNotesInput from './RentPaymentForm/PaymentNotesInput';
import PaymentFormActions from './RentPaymentForm/PaymentFormActions';

const RentPaymentForm = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
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

      await addPayment(paymentData);

      toast({
        title: "Règlement enregistré",
        description: "Le règlement de loyer a été enregistré avec succès.",
      });

      console.log('Nouveau règlement de loyer ajouté à Rent_Payments:', paymentData);

      // Reset form
      setSelectedTenant('');
      setPaymentDate('');
      setAmount('');
      setPaymentMethod('');
      setNotes('');
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          {t('rentManagement.addPayment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[650px] max-h-[95vh] overflow-y-auto p-3 sm:p-4 lg:p-6">
        <PaymentFormHeader isInDialog={true} />
        
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
          <PaymentFormActions onCancel={() => setOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RentPaymentForm;
